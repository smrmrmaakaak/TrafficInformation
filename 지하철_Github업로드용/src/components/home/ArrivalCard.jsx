import TrainCongestion from '../common/TrainCongestion';

export default function ArrivalCard({ data, lineColor }) {
  if (!data) return null;
  const isImminent = data.minutes <= 2;

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '4px', height: '40px', backgroundColor: lineColor, borderRadius: '2px' }}></div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{data.destination}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>{data.status}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: isImminent ? '#ff6b6b' : 'var(--text-primary)', fontWeight: 800, fontSize: '24px' }}>
            {data.minutes}분 후
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>실시간 칸별 혼잡도</span>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>추천: {data.recommended}</span>
        </div>
        <TrainCongestion congestions={data.congestions} />
      </div>
    </div>
  );
}
