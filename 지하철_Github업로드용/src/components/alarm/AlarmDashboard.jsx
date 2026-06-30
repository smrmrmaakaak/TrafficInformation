import { MapPin } from 'lucide-react';

export default function AlarmDashboard({ activeAlarm, remainingSeconds, endLineColor, cancelAlarm, forceShowExitGuide }) {
  if (!activeAlarm) return null;

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div className="glass-card" style={{ padding: '24px', color: 'white', background: endLineColor }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ opacity: 0.8, fontSize: '14px' }}>최종 목적지</div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '4px 0' }}>{activeAlarm.pathData.endStation}역</h2>
              <div style={{ opacity: 0.9 }}>{activeAlarm.pathData.endLineName}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>
              {activeAlarm.pathData.totalTime}분 예상
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800 }}>{formatTime(remainingSeconds)}</div>
            <button className="glass-button" onClick={cancelAlarm} style={{ padding: '8px 16px', borderRadius: '12px', border: 'none' }}>알람 취소</button>
          </div>
      </div>

      {/* 데모를 위한 강제 도착 트리거 버튼 */}
      {forceShowExitGuide && (
        <button 
          onClick={forceShowExitGuide}
          style={{ 
            padding: '12px', backgroundColor: 'var(--bg-secondary)', color: 'var(--accent)', 
            border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 700, 
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' 
          }}
        >
          <MapPin size={18} /> 테스트: 강제 도착 (GPS 모의)
        </button>
      )}

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>환승 경로 요약</h3>
        {activeAlarm.pathData.transfers.map((t, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: t.toColor, marginTop: '4px' }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{t.station}역 환승 <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '4px', fontWeight: 500 }}>({t.toLine})</span></div>
              {t.fastTransfer && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    빠른하차: {t.fastTransfer.escalator}
                  </span>
                  <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    E/V: {t.fastTransfer.elevator}
                  </span>
                  <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border)', color: t.restroom === 'inside' || t.restroom === 'both' ? 'var(--accent)' : 'var(--text-primary)' }}>
                    화장실: {t.restroom === 'inside' ? '개찰구 안' : t.restroom === 'outside' ? '개찰구 밖' : t.restroom === 'both' ? '안/밖 모두' : '정보 없음'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: endLineColor }}></div>
          <div style={{ fontWeight: 700 }}>{activeAlarm.pathData.endStation}역 하차</div>
        </div>
      </div>
    </div>
  );
}
