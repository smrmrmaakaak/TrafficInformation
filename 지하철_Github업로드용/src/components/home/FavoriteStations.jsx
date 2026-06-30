import { Plus, X, Star } from 'lucide-react';

export default function FavoriteStations({ favorites, selectedStation, onSelectStation, onAddClick, onRemoveFavorite }) {
  return (
    <section style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          즐겨찾는 역
        </h2>
        <button 
          onClick={onAddClick}
          style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '14px' }}
        >
          추가
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        {favorites.length === 0 ? (
          <div onClick={onAddClick} style={{ 
            padding: '24px', backgroundColor: 'var(--bg-secondary)', 
            textAlign: 'center', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: '14px'
          }}>
            즐겨찾는 역이 없습니다. 터치하여 추가하세요.
          </div>
        ) : (
          favorites.map((st, idx) => {
            const isSelected = selectedStation && selectedStation.stationName === st.stationName && selectedStation.lineKey === st.lineKey;
            return (
              <div 
                key={idx}
                onClick={() => onSelectStation(st)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '16px', 
                  backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  cursor: 'pointer', transition: 'background-color 0.2s'
                }}
              >
                <div style={{ 
                  width: '28px', height: '28px', borderRadius: '14px', 
                  backgroundColor: st.lineColor, color: '#fff', 
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontWeight: 700, fontSize: '12px', marginRight: '12px'
                }}>
                  {st.lineLabel.replace('호선', '').replace('선', '')}
                </div>
                <div style={{ flex: 1, fontWeight: 500, fontSize: '16px', color: 'var(--text-primary)' }}>
                  {st.stationName}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveFavorite(st); }}
                  style={{ color: 'var(--text-secondary)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
