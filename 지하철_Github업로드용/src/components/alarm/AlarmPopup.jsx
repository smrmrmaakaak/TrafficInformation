import { BellRing } from 'lucide-react';

export default function AlarmPopup({ activeAlarm, showPopup, endLineColor, closePopup }) {
  if (!showPopup || !activeAlarm) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(8px)'
    }}>
      <div className="animate-fade-in glass-card" style={{
        padding: '32px 24px', width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '40px', backgroundColor: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b',
          display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', animation: 'pulse 1.5s infinite'
        }}>
          <BellRing size={40} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>도착 2분 전입니다!</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
          <strong style={{ color: endLineColor }}>{activeAlarm.pathData.endStation}역</strong> 하차를 준비해 주세요.
        </p>
        <button onClick={closePopup} style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: endLineColor, color: 'white', fontWeight: 700, fontSize: '16px', border: 'none' }}>
          확인
        </button>
      </div>
    </div>
  );
}
