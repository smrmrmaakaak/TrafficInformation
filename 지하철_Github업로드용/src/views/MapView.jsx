import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, Star, Search, X, ZoomIn, ZoomOut, ArrowUp, Phone } from 'lucide-react';
import TrainCongestion from '../components/common/TrainCongestion';
import { linesData } from '../data/stations';
import { useRealtimeTrains } from '../hooks/useRealtimeTrains';
import TrainMarker from '../components/map/TrainMarker';
import LineFilterBottomSheet from '../components/map/LineFilterBottomSheet';

const intercityTrains = {
  '서울역': ['KTX', '일반'],
  '용산': ['KTX', 'ITX'],
  '영등포': ['KTX', '일반'],
  '수원': ['KTX', '일반'],
  '광명': ['KTX'],
  '청량리': ['KTX', 'ITX'],
  '상봉': ['KTX', 'ITX'],
  '수서': ['SRT'],
  '동탄': ['SRT'],
  '평택지제': ['SRT'],
  '아산': ['KTX', 'SRT'],
  '천안': ['일반'],
  '평택': ['일반'],
  '행신': ['KTX'],
  '가평': ['ITX'],
  '춘천': ['ITX'],
  '평내호평': ['ITX']
};

import { phoneData } from '../data/phoneData';

// 특정 운영기관(호선)별 고객센터 전화번호 예외 처리
const getLineSpecificPhoneNumber = (stationName, lineKey) => {
  // 1. 역이름_노선명 (예: "종로3가_1호선") 정확한 매칭 시도
  let lineLabel = linesData[lineKey]?.label || '';
  if (lineLabel.includes('(')) lineLabel = lineLabel.split('(')[0];
  const exactKey = `${stationName}_${lineLabel}`;
  if (phoneData[exactKey]) return phoneData[exactKey];
  
  // 2. 역이름 만으로 매칭 시도 (서울교통공사 관할역)
  if (phoneData[stationName]) return phoneData[stationName];

  // 3. 서울교통공사 데이터에 없는 경우 각 운영기관 고객센터로 폴백
  if (lineKey === 'airport') return '1599-7788'; // 공항철도
  if (lineKey === '9') return '02-2656-0009'; // 9호선
  if (lineKey === 'shinbundang') return '02-3436-1500'; // 신분당선
  if (lineKey === 'incheon1' || lineKey === 'incheon2') return '1577-1234'; // 인천교통공사
  if (lineKey === 'sillim') return '02-2081-8181'; // 신림선
  if (lineKey === 'uisinseol') return '02-3499-5561'; // 우이신설선
  if (lineKey === 'gimpo') return '031-8048-1500'; // 김포골드라인
  if (lineKey === 'everline') return '031-329-3500'; // 용인경전철
  if (lineKey === 'uijeongbu') return '031-820-1000'; // 의정부경전철
  if (lineKey === 'gtxa') return '1800-1492'; // GTX-A
  
  // 코레일 관할 (1호선 지선, 3/4호선 연장구간, 경의중앙, 수인분당, 경춘, 서해, 경강 등)
  const korailLines = ['1', '1-sinchang', '1-gwangmyeong', '1-seodongtan', '3', '4', 'gyeongui', 'suin', 'gyeongchun', 'seohae', 'gyeonggang'];
  if (korailLines.includes(lineKey)) return '1544-7788'; // 코레일 고객센터
  
  // 모든 조건에 안 맞으면 최후의 보루 다산콜센터
  return '02-120';
};

export default function MapView({ onSetAlarmTarget, initialStation, clearInitialStation, favorites, toggleFavorite, isFavorite }) {
  const [selectedLine, setSelectedLine] = useState('2');
  const [selectedStation, setSelectedStation] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchResults, setMapSearchResults] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef(null);
  const zoomRef = useRef(zoomLevel);
  
  useEffect(() => {
    zoomRef.current = zoomLevel;
  }, [zoomLevel]);

  // 휠 줌 처리
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoomLevel(prev => Math.max(0.3, Math.min(2.0, prev - e.deltaY * 0.005)));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // 핀치 줌 (모바일 터치) 처리
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initialDist = 0;
    let initialZoom = 1;

    const getDistance = (touches) => {
      return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        initialDist = getDistance(e.touches);
        initialZoom = zoomRef.current;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && initialDist > 0) {
        e.preventDefault(); // 기본 스크롤/줌 방지
        const currentDist = getDistance(e.touches);
        const scale = currentDist / initialDist;
        setZoomLevel(Math.max(0.3, Math.min(2.0, initialZoom * scale)));
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        initialDist = 0;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // 스크롤 탑 버튼 표시/숨김 로직
  useEffect(() => {
    const handleScroll = () => {
      // window.scrollY 를 사용하여 윈도우 스크롤 위치를 추적
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 초기 상태 체크
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mainContainer = document.getElementById('main-scroll-container');
    if (!mainContainer) return;
    
    if (selectedStation || isFilterOpen) {
      mainContainer.style.overflowY = 'hidden';
    } else {
      mainContainer.style.overflowY = 'auto';
    }

    return () => {
      mainContainer.style.overflowY = 'auto';
    };
  }, [selectedStation, isFilterOpen]);

  // 바텀 시트가 열렸을 때 지도 컨테이너 자체의 모든 드래그/스크롤 이벤트를 원천 차단
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !selectedStation) return;

    const preventDrag = (e) => {
      e.preventDefault();
    };

    container.addEventListener('touchmove', preventDrag, { passive: false });
    container.addEventListener('wheel', preventDrag, { passive: false });
    
    return () => {
      container.removeEventListener('touchmove', preventDrag);
      container.removeEventListener('wheel', preventDrag);
    };
  }, [selectedStation]);

  useEffect(() => {
    if (mapSearchQuery.trim() === '') {
      setMapSearchResults([]);
      return;
    }
    const q = mapSearchQuery.trim().toLowerCase();
    const results = [];
    Object.entries(linesData).forEach(([key, data]) => {
      if (key.includes('-express')) return;
      data.stations.forEach((st, idx) => {
        if (st.name.toLowerCase().includes(q)) {
          results.push({
            lineKey: key,
            lineName: data.name,
            lineLabel: data.label,
            color: data.color,
            stationName: st.name,
            station: st,
            index: idx
          });
        }
      });
    });
    setMapSearchResults(results);
  }, [mapSearchQuery]);

  const handleSearchResultClick = (result) => {
    setSelectedLine(result.lineKey.startsWith('1-') ? '1' : result.lineKey);
    setSelectedStation({
      ...result.station,
      line: result.lineName,
      lineKey: result.lineKey,
      lineLabel: result.lineLabel,
      color: result.color,
      index: result.index
    });
    setMapSearchQuery('');
    setMapSearchResults([]);
  };

  useEffect(() => {
    if (initialStation) {
      setSelectedLine(initialStation.lineKey.startsWith('1-') ? '1' : initialStation.lineKey);
      
      const lineData = linesData[initialStation.lineKey];
      if (lineData) {
        const index = lineData.stations.findIndex(s => s.name === initialStation.stationName);
        if (index !== -1) {
          setSelectedStation({
            ...lineData.stations[index],
            line: lineData.name,
            lineKey: initialStation.lineKey,
            lineLabel: lineData.label,
            color: lineData.color,
            index
          });
        }
      }
      
      if (clearInitialStation) {
        clearInitialStation();
      }
    }
  }, [initialStation, clearInitialStation]);

  const currentLine = linesData[selectedLine];

  // --- 2D Layout Computation for Branches ---
  const { layout, linesToMerge } = useMemo(() => {
    const computed = { stations: [], maxX: 0, maxY: 0, paths: [] };
    if (!currentLine) return { layout: computed, linesToMerge: [] };

    let mergeKeys = [selectedLine];
    if (selectedLine === '1') {
      mergeKeys = ['1', '1-sinchang', '1-gwangmyeong', '1-seodongtan'];
    }

    const stationMap = new Map();
    
    mergeKeys.forEach((lKey, index) => {
      const lineInfo = linesData[lKey];
      if (!lineInfo) return;

      if (index === 0) {
        lineInfo.stations.forEach((st, i) => {
          const node = { ...st, x: 0, y: i, lineKey: lKey };
          computed.stations.push(node);
          stationMap.set(st.name, node);
        });
        computed.maxY = Math.max(computed.maxY, lineInfo.stations.length - 1);
      } else {
        const branchPoints = lineInfo.stations.filter(st => stationMap.has(st.name));
        if (branchPoints.length > 0) {
          const parentNode = stationMap.get(branchPoints[0].name);
          const startY = parentNode.y;
          const branchX = parentNode.x + 1;
          
          const branchStations = lineInfo.stations.slice(1);
          branchStations.forEach((st, i) => {
             const node = { ...st, x: branchX, y: startY + 1 + i, lineKey: lKey };
             computed.stations.push(node);
             stationMap.set(st.name, node);
             computed.maxY = Math.max(computed.maxY, node.y);
          });
          computed.maxX = Math.max(computed.maxX, branchX);
        }
      }
    });

    mergeKeys.forEach((lKey) => {
      const stArr = linesData[lKey]?.stations || [];
      for(let i=0; i<stArr.length-1; i++) {
         const p1 = stationMap.get(stArr[i].name);
         const p2 = stationMap.get(stArr[i+1].name);
         if (p1 && p2) {
           computed.paths.push({
             p1, p2, color: linesData[lKey].color, key: `${p1.id}-${p2.id}`
           });
         }
      }
    });

    return { layout: computed, linesToMerge: mergeKeys };
  }, [selectedLine, currentLine]);

  const { trains } = useRealtimeTrains(selectedLine, layout.stations);

  // 환승 가능한 호선 목록을 찾아주는 헬퍼 함수
  const getTransferLines = (stationName, currentLineKey) => {
    const transfers = [];
    Object.entries(linesData).forEach(([key, data]) => {
      if (key !== currentLineKey && data.stations.some(s => s.name === stationName)) {
        transfers.push({ key, label: data.label, color: data.color });
      }
    });
    return transfers;
  };

  const handleStationClick = (station, index) => {
    const lineInfo = linesData[station.lineKey];
    setSelectedStation({ 
      ...station, 
      line: lineInfo.name, 
      lineKey: station.lineKey,
      lineLabel: lineInfo.label,
      color: lineInfo.color,
      index
    });
  };

  const handleLineSelect = (key) => {
    setSelectedLine(key);
    setSelectedStation(null);
    setIsFilterOpen(false);
  };


  return (
    <div className="animate-fade-in" style={{ position: 'relative', height: '100%', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 호선 선택기 및 검색창 */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>노선도</h2>
          
          <button 
            onClick={() => setIsFilterOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
              backgroundColor: currentLine.color, color: 'white',
              borderRadius: '20px', fontWeight: 600, fontSize: '15px',
              border: 'none', boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{
              height: '24px', borderRadius: '12px', padding: '0 8px',
              backgroundColor: 'var(--bg-primary)', color: currentLine.color,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontWeight: 800, fontSize: '13px', whiteSpace: 'nowrap'
            }}>
              {currentLine.label.replace('호선', '').replace('선', '')}
            </div>
            {currentLine.label}
            <ChevronDown size={16} />
          </button>
        </div>

        {/* 역 검색창 */}
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'text' }}>
            <Search size={18} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
            <input 
              type="text"
              placeholder="역 이름으로 검색"
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '15px', color: 'var(--text-primary)' }}
            />
            {mapSearchQuery && (
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); setMapSearchQuery(''); }} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                <X size={16} />
              </button>
            )}
          </label>

          {/* 검색 결과 드롭다운 */}
          {mapSearchResults.length > 0 && (
            <div style={{ 
              position: 'absolute', top: '100%', left: 0, right: 0, 
              backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', 
              boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', 
              maxHeight: '300px', overflowY: 'auto', zIndex: 40, marginTop: '8px' 
            }}>
              {mapSearchResults.map((res, i) => (
                <button 
                  key={`${res.lineKey}-${res.stationName}-${i}`}
                  onClick={() => handleSearchResultClick(res)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', 
                    width: '100%', padding: '12px 16px', border: 'none', 
                    background: 'none', borderBottom: i < mapSearchResults.length - 1 ? '1px solid var(--border)' : 'none',
                    textAlign: 'left', cursor: 'pointer'
                  }}
                >
                  <div style={{ 
                    width: '28px', height: '28px', borderRadius: '14px', backgroundColor: res.color, 
                    color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                    fontSize: '11px', fontWeight: 'bold' 
                  }}>
                    {res.lineName}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{res.stationName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 노선도 캔버스 */}
      <div 
        ref={containerRef}
        style={{ position: 'relative', flex: 1, display: 'flex', padding: '40px 20px 100px 20px' }}
      >
        <div 
          className="animate-fade-in" 
          key={selectedLine}
          style={{ 
            position: 'relative', 
            flex: 1, 
            overflow: selectedStation ? 'hidden' : 'auto', 
            touchAction: selectedStation ? 'none' : 'pan-x pan-y',
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: '24px', 
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Zoom Area */}
          <div style={{ 
            position: 'relative', 
            width: `${Math.max(100, layout.maxX * 200 + 200) * zoomLevel}px`,
            minWidth: '100%',
            height: `${(layout.maxY * 100 + 120) * zoomLevel}px`,
            minHeight: '100%',
            overflow: 'hidden'
          }}>
            {/* Zoom Wrapper */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${Math.max(100, layout.maxX * 200 + 200)}px`,
              height: `${layout.maxY * 100 + 120}px`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: '0 0'
            }}>
            {/* SVG 연결선 */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {layout.paths.map(path => {
              const x1 = path.p1.x * 200 + 54;
              const y1 = path.p1.y * 100 + 40 + 12; // 12 is half of the 24px marker height
              const x2 = path.p2.x * 200 + 54;
              const y2 = path.p2.y * 100 + 40 + 12;
              
              if (path.p1.x === path.p2.x) {
                return <line key={path.key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={path.color} strokeWidth="8" strokeLinecap="round" />;
              } else {
                return <path key={path.key} d={`M ${x1} ${y1} C ${x1} ${y1 + 50}, ${x2} ${y2 - 50}, ${x2} ${y2}`} stroke={path.color} strokeWidth="8" fill="none" strokeLinecap="round" />;
              }
            })}
          </svg>

          {/* 실시간 이동 열차 시각화 */}
          {trains.map(t => {
            const stationHeight = 100;
            const stationWidth = 200;
            const topOffset = 40;
            const leftOffset = 42;
            let yPos = topOffset + (t.y + (t.direction === 'down' ? t.progress : -t.progress)) * stationHeight;
            let xPos = leftOffset + t.x * stationWidth + (t.direction === 'down' ? -20 : 20);
            
            return (
              <div key={t.id} style={{
                position: 'absolute',
                left: `${xPos}px`,
                top: `${yPos - 23}px`,
                transition: 'top 1s linear',
                zIndex: 20
              }}>
                <TrainMarker color={currentLine.color} direction={t.direction} />
              </div>
            );
          })}

          {/* 역 마커 */}
          {layout.stations.map((st) => {
            const isSelected = selectedStation?.id === st.id;
            const transfers = getTransferLines(st.name, selectedLine);
            const isTransfer = transfers.length > 0;
            const leftPos = st.x * 200 + 42;
            
            return (
              <button key={`${st.id}-${st.lineKey}`} 
                onClick={() => handleStationClick(st, st.index)}
                style={{
                  position: 'absolute', left: `${leftPos}px`, top: `${40 + st.y * 100}px`,
                  display: 'flex', alignItems: 'center', gap: '16px', width: '200px', textAlign: 'left',
                  border: 'none', background: 'none', padding: 0, cursor: 'pointer', zIndex: 2
                }}
              >
                <div style={{
                  width: isTransfer ? '28px' : '24px', height: isTransfer ? '28px' : '24px', 
                  backgroundColor: 'var(--bg-primary)', 
                  border: `${isTransfer ? '6px' : '5px'} solid ${linesData[st.lineKey].color}`, 
                  borderRadius: '50%',
                  boxShadow: isSelected ? `0 0 0 6px ${linesData[st.lineKey].color}33` : (isTransfer ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'),
                  transition: 'all 0.2s',
                  marginLeft: isTransfer ? '-2px' : '0',
                  flexShrink: 0
                }} />
                
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', zIndex: 10 }}>
                  <span style={{ 
                    fontWeight: isSelected || isTransfer ? 800 : 600, 
                    fontSize: isSelected ? '18px' : '15px',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}>
                    {st.name}
                  </span>
                  
                  {isTransfer && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {transfers.map(t => (
                        <div key={t.key} 
                             title={t.label}
                             style={{ 
                               width: '16px', height: '16px', borderRadius: '50%', 
                               backgroundColor: t.color, 
                               border: '2px solid var(--bg-secondary)',
                               boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                             }} 
                        />
                      ))}
                    </div>
                  )}
                  
                  {intercityTrains[st.name] && (
                    <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                      {intercityTrains[st.name].map(train => (
                        <div key={train} style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          backgroundColor: train === 'KTX' ? '#1c4794' : train === 'SRT' ? '#5a133b' : '#555555',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: 700,
                          lineHeight: '1.2'
                        }}>
                          {train}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
          </div>
        </div>
        </div>
      </div>

      {/* 맨 위로 가기 버튼 */}
      {showScrollTop && (
        <button
          className="animate-fade-in"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            position: 'fixed',
            bottom: '120px',
            right: '20px',
            width: '48px',
            height: '48px',
            borderRadius: '24px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 45
          }}
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* 호선 선택 필터 바텀 시트 */}
      <LineFilterBottomSheet 
        isFilterOpen={isFilterOpen} 
        setIsFilterOpen={setIsFilterOpen} 
        selectedLine={selectedLine} 
        handleLineSelect={handleLineSelect} 
      />

      {/* 역 선택 시 바텀 시트 배경 블러 오버레이 */}
      {selectedStation && (
        <div 
          className="animate-fade-in"
          onClick={() => setSelectedStation(null)}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 40,
            touchAction: 'none'
          }}
        />
      )}

      {/* 역 선택 시 바텀 시트 */}
      {selectedStation && (
        <div className="animate-slide-up glass-card" style={{
          position: 'fixed', bottom: '100px', left: 0, right: 0, maxWidth: '480px', margin: '0 auto',
          padding: '24px', zIndex: 50
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: selectedStation.color, 
                color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' 
              }}>
                {selectedStation.line}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>{selectedStation.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <Phone size={12} color="var(--text-secondary)" />
                  <a href={`tel:${getLineSpecificPhoneNumber(selectedStation.name, selectedStation.lineKey)}`} style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                    {getLineSpecificPhoneNumber(selectedStation.name, selectedStation.lineKey)}
                  </a>
                </div>
              </div>
              {isFavorite && isFavorite({ stationName: selectedStation.name, lineKey: selectedStation.lineKey }) ? (
                <button 
                  onClick={() => toggleFavorite({
                    lineKey: selectedStation.lineKey,
                    lineLabel: selectedStation.lineLabel,
                    lineColor: selectedStation.color,
                    stationName: selectedStation.name
                  })}
                  style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: 'auto' }}
                >
                  <Star size={24} fill="var(--accent)" color="var(--accent)" />
                </button>
              ) : (
                <button 
                  onClick={() => toggleFavorite({
                    lineKey: selectedStation.lineKey,
                    lineLabel: selectedStation.lineLabel,
                    lineColor: selectedStation.color,
                    stationName: selectedStation.name
                  })}
                  style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Star size={24} color="var(--text-secondary)" />
                </button>
              )}
            </div>
            <button onClick={() => setSelectedStation(null)} style={{ padding: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none' }}>닫기</button>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>화장실:</span> 
              <span style={{ color: selectedStation.restroom === 'inside' ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {selectedStation.restroom === 'inside' ? '개찰구 안' : selectedStation.restroom === 'outside' ? '개찰구 밖' : selectedStation.restroom === 'both' ? '안/밖 모두' : '정보 없음'}
              </span>
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>빠른 하차:</span> 
              <span style={{ color: 'var(--accent)' }}>{selectedStation.fastestExit}</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              상행 ({selectedStation.index > 0 ? currentLine.stations[selectedStation.index - 1].name : '종착'} 방면) - 2분 후 도착
            </h4>
            <TrainCongestion congestions={['low', 'low', 'mid', 'high', 'high', 'mid', 'low', 'low', 'mid', 'high']} />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              하행 ({selectedStation.index < currentLine.stations.length - 1 ? currentLine.stations[selectedStation.index + 1].name : '종착'} 방면) - 5분 후 도착
            </h4>
            <TrainCongestion congestions={['mid', 'high', 'high', 'high', 'high', 'mid', 'mid', 'low', 'low', 'low']} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => {
                if (onSetAlarmTarget) {
                  onSetAlarmTarget('start', {
                    lineKey: selectedStation.lineKey,
                    lineLabel: selectedStation.lineLabel,
                    lineColor: selectedStation.color,
                    stationName: selectedStation.name
                  });
                  setSelectedStation(null);
                }
              }}
              style={{
                flex: 1, padding: '16px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)',
                border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 600, fontSize: '15px', cursor: 'pointer'
              }}
            >
              출발지로 설정
            </button>
            <button 
              onClick={() => {
                if (onSetAlarmTarget) {
                  onSetAlarmTarget('end', {
                    lineKey: selectedStation.lineKey,
                    lineLabel: selectedStation.lineLabel,
                    lineColor: selectedStation.color,
                    stationName: selectedStation.name
                  });
                  setSelectedStation(null);
                }
              }}
              style={{
                flex: 1, padding: '16px', backgroundColor: selectedStation.color, color: 'white',
                border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '15px', cursor: 'pointer'
              }}
            >
              도착지로 설정
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
