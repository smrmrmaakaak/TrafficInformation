import { DoorOpen, ArrowRight, X } from 'lucide-react';

export default function ExitGuidePopup({ activeAlarm, showExitGuide, endLineColor, closeExitGuide }) {
  if (!showExitGuide || !activeAlarm) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(8px)'
    }}>
      <div className="animate-slide-up glass-card" style={{
        padding: '32px 24px', width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative'
      }}>
        <button onClick={closeExitGuide} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
          <X size={24} />
        </button>

        <div style={{ 
          width: '70px', height: '70px', borderRadius: '35px', backgroundColor: `${endLineColor}20`, color: endLineColor,
          display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'
        }}>
          <DoorOpen size={36} />
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', textAlign: 'center', color: 'var(--text-primary)' }}>목적지에 도착했습니다!</h2>
        
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '16px', width: '100%', marginBottom: '24px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px 0', textAlign: 'center' }}>
            <strong style={{ color: endLineColor }}>{activeAlarm.pathData.endStation}역</strong> 하차
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
            <span>빠른 하차: <strong>3-1</strong>번 문</span>
            <ArrowRight size={16} />
            <span>가장 가까운 <strong>9번 출구</strong></span>
          </div>
        </div>

        <button onClick={closeExitGuide} style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: endLineColor, color: 'white', fontWeight: 700, fontSize: '16px', border: 'none' }}>
          안내 종료
        </button>
      </div>
    </div>
  );
}
