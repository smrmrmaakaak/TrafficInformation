import { useState, useMemo } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { linesData } from '../data/stations';

// 모든 역 정보를 1차원 배열로 평탄화 (검색용)
const allStationsList = Object.entries(linesData).flatMap(([lineKey, lineData]) => 
  lineData.stations.map(st => ({
    lineKey,
    lineLabel: lineData.label,
    lineColor: lineData.color,
    stationName: st.name
  }))
);

export default function StationPickerModal({ onClose, onSelect, title }) {
  const [query, setQuery] = useState('');
  const [expandedLines, setExpandedLines] = useState({});

  const toggleLine = (lineKey) => {
    setExpandedLines(prev => ({ ...prev, [lineKey]: !prev[lineKey] }));
  };

  const filtered = useMemo(() => {
    if (!query) return [];
    const results = [];
    const seen = new Set();
    
    allStationsList.forEach(s => {
      if (s.stationName.includes(query) || s.lineLabel.includes(query)) {
        let groupLabel = s.lineLabel;
        if (groupLabel.startsWith('1호선')) groupLabel = '1호선';
        
        const uniqueKey = `${s.stationName}_${groupLabel}`;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          results.push({ ...s, lineLabel: groupLabel });
        }
      }
    });
    return results;
  }, [query]);

  const displayLines = useMemo(() => {
    // 1호선 지선들(1-sinchang 등)은 아코디언에서 제외하고 1호선 본선만 노출
    return Object.entries(linesData).filter(([key]) => !key.includes('-'));
  }, []);

  return (
    <div className="animate-slide-up" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'var(--bg-primary)', zIndex: 1000, 
      display: 'flex', flexDirection: 'column'
    }}>
      {/* 헤더 */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-primary)' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: 0, display: 'flex', alignItems: 'center' }}>
          <X size={28} />
        </button>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{title}</h2>
      </div>
      
      {/* 고정 검색바 */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border)', padding: '14px 16px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
          <Search size={22} color="var(--text-secondary)" style={{ marginRight: '10px' }} />
          <input 
            type="text" 
            placeholder="역 이름 검색 (예: 강남, 부평)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'none', outline: 'none', fontSize: '17px', color: 'var(--text-primary)', fontWeight: 500 }}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 0, display: 'flex', alignItems: 'center' }}>
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 리스트 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-primary)', paddingBottom: '100px' }}>
        {query ? (
          filtered.length > 0 ? (
            filtered.map((st, idx) => (
              <div 
                key={idx} 
                onClick={() => onSelect(st)}
                style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: st.lineColor }}></div>
                <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>{st.stationName}역</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>{st.lineLabel}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '16px' }}>
              '{query}' 검색 결과가 없습니다.
            </div>
          )
        ) : (
          displayLines.map(([key, data]) => {
            const isExpanded = expandedLines[key];
            return (
              <div key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                {/* 호선 아코디언 헤더 */}
                <button 
                  onClick={() => toggleLine(key)}
                  style={{ width: '100%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-primary)', border: 'none', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: data.color, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                    <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>{data.label}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={24} color="var(--text-secondary)" /> : <ChevronDown size={24} color="var(--text-secondary)" />}
                </button>
                
                {/* 호선 내부 미니 노선도 (세로형) */}
                {isExpanded && (
                  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 20px', position: 'relative' }}>
                    {/* 세로 연결 선 그리기 */}
                    <div style={{ position: 'absolute', left: '42px', top: '24px', bottom: '24px', width: '4px', backgroundColor: data.color, borderRadius: '2px' }}></div>
                    
                    {data.stations.map((st) => (
                      <div 
                        key={st.id} 
                        onClick={() => onSelect({ lineKey: key, lineLabel: data.label, lineColor: data.color, stationName: st.name })}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '16px',
                          padding: '12px 0', cursor: 'pointer', position: 'relative', zIndex: 1
                        }}
                      >
                        {/* 역 마커 (동그라미) */}
                        <div style={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', border: `4px solid ${data.color}`, zIndex: 2 }}></div>
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{st.name}역</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
