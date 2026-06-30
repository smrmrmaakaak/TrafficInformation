import { useState, useEffect } from 'react';
import { Plus, X, TrainFront, Clock, AlertTriangle, RefreshCw, Star, Search, Pencil, Sun, Moon, Settings } from 'lucide-react';
import TrainCongestion from './TrainCongestion';
import StationPickerModal from './StationPickerModal';
import SettingsModal from './SettingsModal';
import { getUserProfile, setUserProfileName } from '../utils/profile';

export default function HomeView({ theme, toggleTheme, setMockIndex }) {
  const [favorites, setFavorites] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [pickerMode, setPickerMode] = useState(null); // 'favorite' | 'search' | null
  const [profile, setProfile] = useState(() => getUserProfile());
  const [showSettings, setShowSettings] = useState(false);

  // 가상 실시간 도착 정보 상태
  const [arrivalData, setArrivalData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 로컬 스토리지에서 즐겨찾기 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('subway_favorites');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFavorites(parsed);
      if (parsed.length > 0) {
        setSelectedStation(parsed[0]);
      }
    }
  }, []);

  // 즐겨찾기가 바뀔 때마다 로컬 스토리지 저장
  useEffect(() => {
    localStorage.setItem('subway_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 가상 실시간 도착 정보 생성 엔진 (선택된 역이 바뀔 때마다, 혹은 새로고침 시 작동)
  const generateMockArrivalData = (station) => {
    setIsRefreshing(true);
    
    // 호선별 실제 열차 칸 수(량) 매핑
    const getCarCount = (lineKey) => {
      switch(lineKey) {
        case '1': case '2': case '3': case '4': return 10;
        case '5': case '6': case '7': case 'gyeongui': case 'incheon1': return 8;
        case '8': case '9': case 'shin': case 'suin': case 'airport': return 6;
        case 'incheon2': return 2;
        default: return 10;
      }
    };
    
    // 약간의 딜레이를 주어 실제 API 통신처럼 보이게 함
    setTimeout(() => {
      const carCount = getCarCount(station.lineKey);
      const randomMinutes1 = Math.floor(Math.random() * 5) + 1;
      const randomMinutes2 = Math.floor(Math.random() * 8) + 3;
      
      const generateCongestions = () => Array.from({ length: carCount }, () => {
        const r = Math.random();
        if (r > 0.7) return 'high';
        if (r > 0.4) return 'mid';
        return 'low';
      });

      const findRecommendedCars = (congestions) => {
        const best = [];
        congestions.forEach((c, idx) => {
          if (c === 'low') best.push(idx + 1);
        });
        if (best.length === 0) {
           congestions.forEach((c, idx) => {
             if (c === 'mid') best.push(idx + 1);
           });
        }
        return best.slice(0, 2).join(', ') + '번 칸';
      };

      const upCongestions = generateCongestions();
      const downCongestions = generateCongestions();

      const mockData = {
        upbound: {
          destination: '상행/내선 방향',
          status: randomMinutes1 === 1 ? '전역 출발' : `${randomMinutes1 + 1} 정거장 전`,
          minutes: randomMinutes1,
          congestions: upCongestions,
          recommended: findRecommendedCars(upCongestions)
        },
        downbound: {
          destination: '하행/외선 방향',
          status: randomMinutes2 === 1 ? '전역 출발' : `${randomMinutes2 + 1} 정거장 전`,
          minutes: randomMinutes2,
          congestions: downCongestions,
          recommended: findRecommendedCars(downCongestions)
        }
      };
      
      setArrivalData(mockData);
      setIsRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    if (selectedStation) {
      generateMockArrivalData(selectedStation);
    } else {
      setArrivalData(null);
    }
  }, [selectedStation]);

  const handleSelectStation = (st) => {
    if (pickerMode === 'favorite') {
      // 즐겨찾기로 추가
      if (!favorites.find(f => f.stationName === st.stationName && f.lineKey === st.lineKey)) {
        const newFav = [...favorites, st];
        setFavorites(newFav);
      }
    }
    // 단순 검색이든 즐겨찾기 추가든 선택된 역으로 화면 업데이트
    setSelectedStation(st);
    setPickerMode(null);
  };

  const removeFavorite = (stToRemove, e) => {
    e.stopPropagation(); // 카드 클릭 이벤트(선택) 방지
    const newFav = favorites.filter(f => !(f.stationName === stToRemove.stationName && f.lineKey === stToRemove.lineKey));
    setFavorites(newFav);
    // 삭제한 역이 현재 선택된 역이라면 선택 해제 (또는 첫번째 즐겨찾기로)
    if (selectedStation && selectedStation.stationName === stToRemove.stationName && selectedStation.lineKey === stToRemove.lineKey) {
      setSelectedStation(newFav.length > 0 ? newFav[0] : null);
    }
  };

  const isCurrentFavorite = selectedStation && favorites.some(f => f.stationName === selectedStation.stationName && f.lineKey === selectedStation.lineKey);

  const toggleCurrentFavorite = () => {
    if (!selectedStation) return;
    if (isCurrentFavorite) {
      setFavorites(favorites.filter(f => !(f.stationName === selectedStation.stationName && f.lineKey === selectedStation.lineKey)));
    } else {
      setFavorites([...favorites, selectedStation]);
    }
  };

  const handleEditNickname = () => {
    const newName = window.prompt("새로운 닉네임을 입력해주세요:", profile.name);
    if (newName && newName.trim().length > 0) {
      const updated = setUserProfileName(newName.trim());
      setProfile(updated);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '40px' }}>
      
      {/* 닉네임 인사말 영역 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingTop: '10px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: 'var(--text-primary)', flex: '1 1 auto', minWidth: '150px' }}>
          반갑습니다,<br/>
          <span style={{ color: profile.color }}>{profile.name}</span>님! 👋
        </h1>
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button 
            onClick={() => setShowSettings(true)}
            className="glass-button"
            style={{ 
              width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center',
              color: 'var(--text-primary)'
            }}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {pickerMode && (
        <StationPickerModal 
          title={pickerMode === 'favorite' ? "즐겨찾기 추가" : "역 검색하기"}
          onClose={() => setPickerMode(null)}
          onSelect={handleSelectStation}
        />
      )}



      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={20} color="var(--accent)" fill="var(--accent)" /> 자주 가는 역
          </h2>
          <button 
            onClick={() => setPickerMode('favorite')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '4px', 
              background: 'none', border: 'none', color: 'var(--accent)', 
              fontWeight: 700, fontSize: '14px', padding: 0 
            }}
          >
            <Plus size={16} strokeWidth={3} /> 추가하기
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {favorites.length === 0 ? (
            <div onClick={() => setPickerMode('favorite')} style={{ 
              padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '2px dashed var(--border)', 
              borderRadius: '16px', width: '100%', textAlign: 'center', color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}>
              즐겨찾는 역을 추가하고 실시간 정보를 확인하세요!
            </div>
          ) : (
            favorites.map((st, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedStation(st)}
                style={{
                  padding: '16px', backgroundColor: 'var(--bg-secondary)',
                  border: selectedStation && selectedStation.stationName === st.stationName && selectedStation.lineKey === st.lineKey 
                    ? `2px solid ${st.lineColor}` 
                    : '2px solid transparent',
                  borderRadius: '16px', minWidth: '120px', textAlign: 'left',
                  boxShadow: 'var(--shadow-sm)', position: 'relative',
                  transition: 'all 0.2s',
                  outline: selectedStation && selectedStation.stationName === st.stationName && selectedStation.lineKey === st.lineKey ? `4px solid ${st.lineColor}20` : 'none'
                }}
              >
                {/* 삭제 버튼 */}
                <div 
                  onClick={(e) => removeFavorite(st, e)}
                  style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--text-secondary)', padding: '4px' }}
                >
                  <X size={16} />
                </div>
                <div style={{ 
                  display: 'inline-flex', padding: '2px 10px', borderRadius: '12px',
                  backgroundColor: st.lineColor, color: 'white', 
                  fontWeight: 800, fontSize: '11px', marginBottom: '10px',
                  whiteSpace: 'nowrap'
                }}>
                  {st.lineLabel.replace('호선', '').replace('선', '')}
                </div>
                <div style={{ fontWeight: 700, fontSize: '17px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.stationName}</div>
              </button>
            ))
          )}
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrainFront size={22} color="var(--text-primary)" /> 실시간 도착 정보
            </h2>
            {selectedStation && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <span style={{ color: selectedStation.lineColor }}>{selectedStation.lineLabel}</span> {selectedStation.stationName}역
                </p>
                <button 
                  onClick={toggleCurrentFavorite}
                  style={{
                    background: 'none', border: 'none', padding: '2px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', color: isCurrentFavorite ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  <Star size={16} fill={isCurrentFavorite ? "var(--accent)" : "none"} />
                </button>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="glass-button"
              onClick={() => setPickerMode('search')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '8px 12px', fontSize: '13px', fontWeight: 600,
                color: 'var(--text-primary)', whiteSpace: 'nowrap'
              }}
            >
              <Search size={14} /> 다른 역 검색
            </button>

            {selectedStation && (
              <button 
                className="glass-button"
                onClick={() => generateMockArrivalData(selectedStation)}
                disabled={isRefreshing}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', fontSize: '13px', fontWeight: 600,
                  color: 'var(--text-primary)', whiteSpace: 'nowrap'
                }}
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> 새로고침
              </button>
            )}
          </div>
        </div>
        
        {!selectedStation ? (
           <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
             <p style={{ margin: 0 }}>역을 검색하거나 즐겨찾기에서 선택해 주세요.</p>
             <button 
              className="glass-button"
              onClick={() => setPickerMode('search')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '12px 20px', fontSize: '15px', fontWeight: 700,
                color: 'var(--accent)'
              }}
             >
              <Search size={18} /> 역 검색하기
             </button>
           </div>
        ) : !arrivalData ? (
           <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border)' }}>
             실시간 정보를 불러오는 중입니다...
           </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 상행/내선 */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div style={{ width: '4px', height: '40px', backgroundColor: selectedStation.lineColor, borderRadius: '2px', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{arrivalData.upbound.destination}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{arrivalData.upbound.status}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: arrivalData.upbound.minutes <= 2 ? '#ff6b6b' : 'var(--text-primary)', fontWeight: 800, fontSize: '24px', whiteSpace: 'nowrap' }}>
                    {arrivalData.upbound.minutes}분 후
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>실시간 칸별 혼잡도</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>추천: {arrivalData.upbound.recommended}</span>
                </div>
                <TrainCongestion congestions={arrivalData.upbound.congestions} />
              </div>
            </div>

            {/* 하행/외선 */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div style={{ width: '4px', height: '40px', backgroundColor: selectedStation.lineColor, borderRadius: '2px', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{arrivalData.downbound.destination}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{arrivalData.downbound.status}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: arrivalData.downbound.minutes <= 2 ? '#ff6b6b' : 'var(--text-primary)', fontWeight: 800, fontSize: '24px', whiteSpace: 'nowrap' }}>
                    {arrivalData.downbound.minutes}분 후
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>실시간 칸별 혼잡도</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>추천: {arrivalData.downbound.recommended}</span>
                </div>
                <TrainCongestion congestions={arrivalData.downbound.congestions} />
              </div>
            </div>

            {/* 범례 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--congestion-low)' }} /> 여유
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--congestion-mid)' }} /> 보통
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--congestion-high)' }} /> 혼잡
              </div>
            </div>

          </div>
        )}
      </section>

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
          theme={theme}
          toggleTheme={toggleTheme}
          profile={profile}
          onEditNickname={handleEditNickname}
          setMockIndex={setMockIndex}
        />
      )}
    </div>
  );
}
