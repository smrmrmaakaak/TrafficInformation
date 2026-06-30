import { linesData } from '../../data/stations';

export default function LineFilterBottomSheet({ isFilterOpen, setIsFilterOpen, selectedLine, handleLineSelect }) {
  if (!isFilterOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 60,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      alignItems: 'center'
    }} onClick={() => setIsFilterOpen(false)}>
      <div className="animate-slide-up glass-card" style={{
        width: '100%', maxWidth: '480px',
        borderBottomLeftRadius: '0', borderBottomRightRadius: '0',
        borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
        padding: '24px', paddingBottom: '120px',
        maxHeight: '80vh', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        <div className="drag-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>노선 선택</h3>
          <button onClick={() => setIsFilterOpen(false)} style={{ color: 'var(--text-secondary)', padding: '4px', background: 'none', border: 'none' }}>닫기</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
          {(() => {
            const entries = Object.entries(linesData);
            const line1Group = entries.filter(e => e[0] === '1');
            const otherLines = entries.filter(e => e[0] !== '1' && !e[0].startsWith('1-') && !e[0].includes('-express'));
            return [...line1Group, ...otherLines];
          })().map(([key, line]) => (
            <button
              key={key}
              onClick={() => handleLineSelect(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 8px', borderRadius: '12px',
                backgroundColor: 'var(--bg-primary)',
                border: `2px solid ${selectedLine === key ? line.color : 'transparent'}`,
                textAlign: 'left',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                minWidth: '28px', height: '28px', borderRadius: '14px', padding: '0 6px',
                backgroundColor: line.color, color: 'white',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontWeight: 800, fontSize: '11px', whiteSpace: 'nowrap'
              }}>
                {line.name}
              </div>
              <span style={{ fontWeight: selectedLine === key ? 700 : 500, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {line.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
