import { X, MapPin, Star, Search } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState, useMemo } from 'react';
import { linesData } from '../../data/stations';

export default function BriefingStationSelectorBottomSheet({ 
  isOpen, 
  onClose, 
  favorites, 
  onSelectStation, 
  currentStation 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    const results = [];
    const seen = new Set();
    
    Object.keys(linesData).forEach(key => {
      const line = linesData[key];
      line.stations.forEach(station => {
        if (station.name.toLowerCase().includes(query)) {
          let groupLabel = line.label;
          // 1호선 지선들은 모두 '1호선'으로 묶어서 보여주기
          if (groupLabel.startsWith('1호선')) groupLabel = '1호선';

          const uniqueKey = `${station.name}_${groupLabel}`;
          if (!seen.has(uniqueKey)) {
            seen.add(uniqueKey);
            results.push({
              stationName: station.name,
              lineKey: key, // UI에서 숨겨진 실제 키 (예: '1' 또는 '1-sinchang')
              lineLabel: groupLabel, // UI 표시용
              lineColor: line.color,
              lat: 37.5665, lng: 126.9780 // mock coords
            });
          }
        }
      });
    });
    
    return results.slice(0, 20); // 최대 20개까지만 표시
  }, [searchQuery]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div 
        className="animate-fade-in"
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(2px)'
        }}
      />
      <div 
        className="animate-slide-up glass-card"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          borderBottomLeftRadius: '0', borderBottomRightRadius: '0',
          borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
          padding: '24px', zIndex: 1000,
          height: '80vh', overflowY: 'hidden', display: 'flex', flexDirection: 'column'
        }}
      >
        <div className="drag-handle" style={{ flexShrink: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>관심 역 설정</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* 검색창 */}
        <div style={{ position: 'relative', marginBottom: '20px', flexShrink: 0 }}>
          <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="지하철역 이름으로 검색" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '14px 16px 14px 44px', 
              backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: '12px', fontSize: '16px', color: 'var(--text-primary)', outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingBottom: '20px', flex: 1 }}>
          
          {/* 검색 결과가 있을 경우 검색 결과만 표시 */}
          {searchQuery.trim() !== '' ? (
            <>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>검색 결과</h3>
              {searchResults.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>검색 결과가 없습니다.</div>
              ) : (
                searchResults.map((st, idx) => (
                  <button
                    key={`${st.stationName}-${st.lineKey}-${idx}`}
                    onClick={() => { onSelectStation(st); setSearchQuery(''); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      borderRadius: '16px', textAlign: 'left', cursor: 'pointer'
                    }}
                  >
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '18px', backgroundColor: st.lineColor,
                      display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
                      fontWeight: 800, fontSize: '12px'
                    }}>
                      {st.lineLabel.replace('호선', '').replace('선', '')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{st.stationName}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{st.lineLabel}</div>
                    </div>
                  </button>
                ))
              )}
            </>
          ) : (
            <>
              {/* GPS 기반 역 사용 옵션 */}
              <button
                onClick={() => onSelectStation(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px', backgroundColor: 'var(--bg-secondary)',
                  border: !currentStation ? '2px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: '16px', textAlign: 'left', cursor: 'pointer'
                }}
              >
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--bg-primary)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--accent)'
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>현재 위치 기반 (자동)</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>GPS 위치에 따라 가장 가까운 역 표시</div>
                </div>
              </button>

              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} /> 즐겨찾기 목록
              </h3>

              {favorites.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  즐겨찾는 역이 없습니다.<br/>위 검색창에서 역을 검색해보세요.
                </div>
              ) : (
                favorites.map((st, idx) => {
                  const isSelected = currentStation && currentStation.stationName === st.stationName && currentStation.lineKey === st.lineKey;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectStation(st)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '16px', backgroundColor: 'var(--bg-secondary)',
                        border: isSelected ? `2px solid ${st.lineColor}` : '1px solid var(--border)',
                        borderRadius: '16px', textAlign: 'left', cursor: 'pointer'
                      }}
                    >
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '20px', backgroundColor: st.lineColor,
                        display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
                        fontWeight: 800, fontSize: '13px'
                      }}>
                        {st.lineLabel.replace('호선', '').replace('선', '')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{st.stationName}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{st.lineLabel}</div>
                      </div>
                    </button>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
