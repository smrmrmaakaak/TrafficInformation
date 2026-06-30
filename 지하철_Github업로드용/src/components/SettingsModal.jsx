import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Sun, Moon, MapPin, ArrowUp, ArrowDown } from 'lucide-react';
import { DEMO_STATION_COORDS } from '../hooks/useGeolocation';

export default function SettingsModal({ onClose, theme, toggleTheme, profile, onEditNickname, setMockIndex, layoutOrder, setLayoutOrder }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 380); // CSS 애니메이션 시간(0.4s)과 비슷하게 맞춤
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newOrder = [...layoutOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setLayoutOrder(newOrder);
  };

  const moveDown = (index) => {
    if (index === layoutOrder.length - 1) return;
    const newOrder = [...layoutOrder];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    setLayoutOrder(newOrder);
  };

  return createPortal(
    <div 
      className={isClosing ? "animate-fade-out" : "animate-fade-in"}
      style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px',
      backdropFilter: 'blur(4px)'
    }} onClick={handleClose}>
      <div className={`glass-card ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`} style={{
        width: '100%', maxWidth: '400px', padding: '24px',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex', flexDirection: 'column', gap: '24px',
        maxHeight: '90vh', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>설정</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        {/* 프로필 설정 */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>프로필 설정</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: profile.color, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                <User size={20} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>{profile.name}</div>
            </div>
            <button className="glass-button" onClick={onEditNickname} style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 600 }}>
              변경하기
            </button>
          </div>
        </div>

        {/* 디스플레이 설정 */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>화면 설정</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-primary)' }}>
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>테마 모드</div>
            </div>
            <button className="glass-button" onClick={toggleTheme} style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 600 }}>
              {theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}
            </button>
          </div>
        </div>

        {/* 홈 화면 UI 배치 설정 */}
        {layoutOrder && setLayoutOrder && (
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>홈 화면 위젯 배치</h3>
            <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border)', padding: '8px' }}>
              {layoutOrder.map((key, index) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: index < layoutOrder.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>
                    {key === 'route' ? '경로 검색 카드' : key === 'briefing' ? '스마트 출퇴근 브리핑' : '즐겨찾는 역 목록'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      style={{ padding: '6px', backgroundColor: index === 0 ? 'transparent' : 'var(--bg-secondary)', borderRadius: '8px', color: index === 0 ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: index === 0 ? 0.3 : 1, transition: 'all 0.2s', border: 'none', cursor: index === 0 ? 'default' : 'pointer' }}
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button 
                      onClick={() => moveDown(index)}
                      disabled={index === layoutOrder.length - 1}
                      style={{ padding: '6px', backgroundColor: index === layoutOrder.length - 1 ? 'transparent' : 'var(--bg-secondary)', borderRadius: '8px', color: index === layoutOrder.length - 1 ? 'var(--text-secondary)' : 'var(--text-primary)', opacity: index === layoutOrder.length - 1 ? 0.3 : 1, transition: 'all 0.2s', border: 'none', cursor: index === layoutOrder.length - 1 ? 'default' : 'pointer' }}
                    >
                      <ArrowDown size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GPS 시뮬레이터 */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>GPS 시뮬레이터 (개발/테스트)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className="glass-button"
              onClick={() => { setMockIndex(-1); handleClose(); }} 
              style={{ padding: '16px', fontSize: '14px', borderRadius: '16px', backgroundColor: 'var(--bg-primary)', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <MapPin size={18} color="var(--text-secondary)" /> 실제 내 위치 (브라우저 GPS)
            </button>
            {DEMO_STATION_COORDS.map((st, idx) => (
              <button 
                key={idx} 
                className="glass-button"
                onClick={() => { setMockIndex(idx); handleClose(); }}
                style={{ padding: '16px', fontSize: '14px', borderRadius: '16px', backgroundColor: 'var(--bg-primary)', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: st.lineKey === '2' ? '#00A84D' : st.lineKey === '1' ? '#0052A4' : st.lineKey === 'incheon2' ? '#ED8B00' : '#996CAC' }}></div>
                {st.name}역 인근으로 위장
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
