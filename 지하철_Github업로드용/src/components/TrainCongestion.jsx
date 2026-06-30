export default function TrainCongestion({ congestions }) {
  // congestions는 'low', 'mid', 'high' 문자열 배열 (예: 10량 열차면 10개)
  
  const getCongestionColor = (level) => {
    switch(level) {
      case 'low': return 'var(--congestion-low)';
      case 'mid': return 'var(--congestion-mid)';
      case 'high': return 'var(--congestion-high)';
      default: return 'var(--border)';
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      width: '100%',
      overflowX: 'auto',
      padding: '10px 0',
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none' // IE/Edge
    }}>
      {/* Chrome, Safari, Opera 용 scrollbar 숨기기 */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {congestions.map((level, index) => (
        <div key={index} style={{
          flex: '0 0 auto',
          width: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}>
          {/* 열차 칸 시각화 */}
          <div style={{
            width: '100%',
            height: '24px',
            backgroundColor: getCongestionColor(level),
            borderRadius: '4px',
            position: 'relative',
            opacity: 0.9,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {/* 문 표시 (장식) */}
            <div style={{
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              left: '4px',
              width: '6px',
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: '1px'
            }} />
            <div style={{
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              right: '4px',
              width: '6px',
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: '1px'
            }} />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}
