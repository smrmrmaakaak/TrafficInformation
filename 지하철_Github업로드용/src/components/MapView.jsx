import { useState, useEffect } from 'react';
import { Filter, ChevronDown, Map as MapIcon } from 'lucide-react';
import TrainCongestion from './common/TrainCongestion';
import StationMapModal from './common/StationMapModal';
import MiniStationMap from './common/MiniStationMap';

import { linesData } from '../data/stations';

const TrainMarker = ({ color, direction }) => (
  <div style={{
    transform: direction === 'down' ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s',
    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <svg width="24" height="46" viewBox="0 0 24 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* 매끄러운 메탈 바디 그라데이션 */}
        <linearGradient id={`body-${color.replace('#','')}`} x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="20%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="80%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        {/* 공기역학적 유리창 */}
        <linearGradient id="glass-sleek" x1="0" y1="0" x2="24" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* 유선형 고속열차 바디 (짧게 수정) */}
      <path d="M 6 3 
               C 10 -1, 14 -1, 18 3 
               L 22 15 
               L 22 42 
               C 22 43, 21 44, 20 44 
               L 4 44 
               C 3 44, 2 43, 2 42 
               L 2 15 
               Z" 
            fill={`url(#body-${color.replace('#','')})`} stroke="#475569" strokeWidth="0.5" />
      
      {/* 세련된 측면 컬러 라인 */}
      <rect x="2.5" y="18" width="1" height="24" fill={color} opacity="0.8" />
      <rect x="20.5" y="18" width="1" height="24" fill={color} opacity="0.8" />

      {/* 날렵한 전면 블랙 마스크 및 유리창 */}
      <path d="M 6.5 4 
               C 10 0.5, 14 0.5, 17.5 4 
               L 21.5 15 
               C 21.5 17, 12 18, 12 18 
               C 12 18, 2.5 17, 2.5 15 
               Z" 
            fill="url(#glass-sleek)" />

      {/* 전면 상단 호선 포인트 컬러 */}
      <path d="M 7.5 3 C 10 1, 14 1, 16.5 3 L 17.5 4 C 14 2, 10 2, 6.5 4 Z" fill={color} />

      {/* 플러시 마운트(매립형) 지붕 통풍구 (하나로 통합) */}
      <rect x="9" y="24" width="6" height="16" rx="3" fill="#64748b" opacity="0.4" />

      {/* LED 스트립 전조등 (날렵하고 미래지향적) */}
      <path d="M 4 13 L 6 9.5 L 7 9.5 L 5 13 Z" fill="#ffffff" />
      <path d="M 20 13 L 18 9.5 L 17 9.5 L 19 13 Z" fill="#ffffff" />
      <path d="M 4.5 12.5 L 6.5 10" stroke="#fef08a" strokeWidth="1" />
      <path d="M 19.5 12.5 L 17.5 10" stroke="#fef08a" strokeWidth="1" />
    </svg>
  </div>
);

export default function MapView({ onSetAlarmTarget }) {
  const [selectedLine, setSelectedLine] = useState('2');
  const [selectedStation, setSelectedStation] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [trains, setTrains] = useState([]);

  const currentLine = linesData[selectedLine];

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

  // 노선이 바뀔 때 및 주기적으로 실시간 열차 위치 데이터 Fetch
  useEffect(() => {
    const fetchRealtimeTrains = async () => {
      try {
        const apiKey = import.meta.env.VITE_SEOUL_API_KEY || 'sample';
        const lineName = currentLine.label; // 예: '1호선', '수인분당선'
        // 샘플 키는 한 번에 5개까지만 조회 가능, 정식 키는 100개까지 조회
        const endIndex = apiKey === 'sample' ? 5 : 100;
        const url = `/api/subway/${apiKey}/json/realtimePosition/0/${endIndex}/${encodeURIComponent(lineName)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.realtimePositionList) {
          const fetchedTrains = data.realtimePositionList.map((train) => {
            // 역 이름 매칭 (예: '서울역' -> '서울역', '강남' -> '강남')
            let statnNm = train.statnNm;
            if (statnNm === '서울') statnNm = '서울역';
            if (statnNm === '총신대입구(이수)') statnNm = '총신대입구(이수)';
            
            const stIndex = currentLine.stations.findIndex(s => 
              s.name === statnNm || s.name.includes(statnNm) || statnNm.includes(s.name)
            );
            
            if (stIndex === -1) return null; // 지도에 없는 역이면 무시
            
            // updnLine: '0'(상행/내선), '1'(하행/외선)
            const direction = train.updnLine === '1' ? 'down' : 'up';
            // trainSttus: '0'(진입), '1'(도착), '2'(출발)
            const status = train.trainSttus;
            
            // 시각적 부드러움을 위해 상태별 초기 progress 설정
            let initialProgress = 0;
            if (status === '2') initialProgress = 0.1; // 출발: 다음 역을 향해 10% 지점에서 시작
            else if (status === '0') initialProgress = -0.1; // 진입: 도달 역의 10% 전 위치
            else initialProgress = 0; // 도착: 역 위치 정확히 일치
            
            return {
              id: String(train.trainNo), // 인덱스 대신 고유 열차번호 사용하여 컴포넌트 유지
              direction,
              position: stIndex,
              status,
              progress: initialProgress
            };
          }).filter(Boolean);
          
          setTrains(prevTrains => {
            return fetchedTrains.map(newTrain => {
              const oldTrain = prevTrains.find(t => t.id === newTrain.id);
              if (oldTrain) {
                // 열차가 계속 이동 중(출발 상태)인 경우 기존 진행 상황 유지하여 부드럽게 이음
                if (oldTrain.status === '2' && newTrain.status === '2' && oldTrain.position === newTrain.position) {
                  return { ...newTrain, progress: oldTrain.progress };
                }
              }
              return newTrain;
            });
          });
        } else {
          setTrains([]);
        }
      } catch (error) {
        console.error("Failed to fetch train positions", error);
      }
    };

    // 즉시 실행 및 15초마다 갱신
    fetchRealtimeTrains();
    const interval = setInterval(fetchRealtimeTrains, 15000);
    return () => clearInterval(interval);
  }, [currentLine]);

  // 실시간 기차 애니메이션 로직 (1초마다 진행 상황 업데이트)
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setTrains(prevTrains => prevTrains.map(t => {
        if (t.status === '2') {
          // 역 간 이동을 시뮬레이션하여 조금씩 전진 (0.9에서 멈춰서 진입(-0.1)과 자연스럽게 연결)
          const newProgress = Math.min(0.9, t.progress + 0.015);
          return { ...t, progress: newProgress };
        }
        return t;
      }));
    }, 1000);
    return () => clearInterval(animationInterval);
  }, []);

  const handleStationClick = (station, index) => {
    setSelectedStation({ 
      ...station, 
      line: currentLine.name, 
      lineKey: selectedLine,
      lineLabel: currentLine.label,
      color: currentLine.color,
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
      
      {/* 호선 선택기 (필터 버튼) */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>노선도</h2>
        
        <button 
          onClick={() => setIsFilterOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: currentLine.color,
            color: 'white',
            borderRadius: '20px',
            fontWeight: 600,
            fontSize: '15px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Filter size={16} />
          {currentLine.label}
          <ChevronDown size={16} />
        </button>
      </div>

      {/* 노선도 캔버스 */}
      <div style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '40px 20px 100px 20px' }}>
        <div className="animate-fade-in" key={selectedLine} style={{ 
          position: 'relative', 
          width: '100%', 
          minHeight: `${currentLine.stations.length * 100 + 40}px`,
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: '24px', 
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
              {/* 노선 선 */}
              <div style={{ 
                position: 'absolute', left: '50px', top: '40px', bottom: '40px', 
                width: '8px', backgroundColor: currentLine.color, borderRadius: '4px' 
              }} />

              {/* 실시간 이동 열차 시각화 (고퀄리티 SVG) */}
              {trains.map(t => {
                const stationHeight = 100;
                const topOffset = 40;
                let yPos = topOffset + (t.position + (t.direction === 'down' ? t.progress : -t.progress)) * stationHeight;
                
                return (
                  <div key={t.id} style={{
                    position: 'absolute',
                    left: t.direction === 'down' ? '22px' : '62px',
                    top: `${yPos - 23}px`,
                    transition: 'top 1.2s linear',
                    zIndex: 20
                  }}>
                    <TrainMarker color={currentLine.color} direction={t.direction} />
                  </div>
                );
              })}
              
              {/* 역 마커 */}
              {currentLine.stations.map((st, i) => {
                const isSelected = selectedStation?.id === st.id;
                const transfers = getTransferLines(st.name, selectedLine);
                const isTransfer = transfers.length > 0;
                
                return (
                  <button key={st.id} 
                    onClick={() => handleStationClick(st, i)}
                    style={{
                      position: 'absolute', left: '42px', top: `${40 + i * 100}px`,
                      display: 'flex', alignItems: 'center', gap: '16px', width: 'calc(100% - 60px)', textAlign: 'left',
                      border: 'none', background: 'none', padding: 0, cursor: 'pointer'
                    }}
                  >
                    {/* 환승역이면 태극마크처럼 렌더링하거나 약간 크게 렌더링 */}
                    <div style={{
                      width: isTransfer ? '28px' : '24px', height: isTransfer ? '28px' : '24px', 
                      backgroundColor: 'white', 
                      border: `${isTransfer ? '6px' : '5px'} solid ${currentLine.color}`, 
                      borderRadius: '50%',
                      boxShadow: isSelected ? `0 0 0 6px ${currentLine.color}33` : (isTransfer ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'),
                      transition: 'all 0.2s',
                      marginLeft: isTransfer ? '-2px' : '0' // 중앙 정렬 보정
                    }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ 
                        fontWeight: isSelected || isTransfer ? 800 : 500, 
                        fontSize: isSelected ? '18px' : '16px',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        transition: 'all 0.2s'
                      }}>
                        {st.name}
                      </span>
                      
                      {/* 환승 가능 호선 뱃지 (작은 색상 원) */}
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
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

      {/* 호선 선택 필터 바텀 시트 */}
      {isFilterOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          alignItems: 'center'
        }} onClick={() => setIsFilterOpen(false)}>
          <div className="animate-slide-up glass-card" style={{
            width: '100%', maxWidth: '480px',
            borderBottomLeftRadius: '0', borderBottomRightRadius: '0',
            padding: '24px', paddingBottom: '120px',
            maxHeight: '80vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>노선 선택</h3>
              <button onClick={() => setIsFilterOpen(false)} style={{ color: 'var(--text-secondary)', padding: '4px' }}>닫기</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {Object.entries(linesData).map(([key, line]) => (
                <button
                  key={key}
                  onClick={() => handleLineSelect(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px', borderRadius: '16px',
                    backgroundColor: 'var(--bg-primary)',
                    border: `2px solid ${selectedLine === key ? line.color : 'transparent'}`,
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ 
                    minWidth: '32px', height: '32px', borderRadius: '16px', padding: '0 8px',
                    backgroundColor: line.color, color: 'white',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontWeight: 800, fontSize: '11px', whiteSpace: 'nowrap'
                  }}>
                    {line.name}
                  </div>
                  <span style={{ fontWeight: selectedLine === key ? 700 : 500, fontSize: '15px' }}>
                    {line.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 역 선택 시 바텀 시트 */}
      {selectedStation && (
        <div className="animate-slide-up glass-card" style={{
          position: 'fixed', bottom: '100px', left: 0, right: 0, maxWidth: '480px', margin: '0 auto',
          padding: '24px', zIndex: 50, maxHeight: '60vh', overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: selectedStation.color, 
                color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' 
              }}>
                {selectedStation.line}
              </div>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>{selectedStation.name}</h3>
            </div>
            <button onClick={() => setSelectedStation(null)} style={{ padding: '8px', color: 'var(--text-secondary)' }}>닫기</button>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
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
          
          <div style={{ marginBottom: '24px' }}>
            <MiniStationMap 
              stationName={selectedStation.name} 
              onExpand={() => setIsMapOpen(true)}
            />
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
                border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 600, fontSize: '15px'
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
                border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '15px'
              }}
            >
              도착지로 설정
            </button>
          </div>
        </div>
      )}
      
      {selectedStation && (
        <StationMapModal 
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          stationName={selectedStation.name}
        />
      )}
    </div>
  );
}
