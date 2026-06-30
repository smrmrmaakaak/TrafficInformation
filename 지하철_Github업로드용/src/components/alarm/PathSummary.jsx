import { linesData } from '../../data/stations';

export default function PathSummary({ calculatedPath }) {
  if (!calculatedPath) return null;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>경로 요약</h3>
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '6px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
          총 {calculatedPath.totalTime}분 소요
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: linesData[calculatedPath.path[0].lineKey].color }}></div>
          <div style={{ fontWeight: 700 }}>{calculatedPath.startStation}역 승차 <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>({calculatedPath.startLineName})</span></div>
        </div>

        {calculatedPath.transfers.map((t, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: t.toColor, marginTop: '4px' }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{t.station}역 환승 <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px', fontWeight: 500 }}>{t.toLine}</span></div>
              {t.fastTransfer && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    에스컬레이터 {t.fastTransfer.escalator}
                  </span>
                  <span style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    엘리베이터 {t.fastTransfer.elevator}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: linesData[calculatedPath.path[calculatedPath.path.length-1].lineKey].color }}></div>
          <div style={{ fontWeight: 700 }}>{calculatedPath.endStation}역 하차 <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>({calculatedPath.endLineName})</span></div>
        </div>
      </div>
    </div>
  );
}
