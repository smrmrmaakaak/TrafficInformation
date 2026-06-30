import { useState, useEffect, useMemo } from 'react';
import { BellRing, MapPin, X, Check, Clock, ArrowRight, Shuffle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { linesData } from '../data/stations';
import { findShortestPath } from '../utils/pathfinder';
import StationPickerModal from './StationPickerModal';
import TrainCongestion from './common/TrainCongestion';
import AlarmSettingsModal from './alarm/AlarmSettingsModal';

export default function AlarmView({ initialStart, initialEnd, clearInitialStart, clearInitialEnd }) {
  const [isSetting, setIsSetting] = useState(false);
  
  // 출발지/도착지 상태 (객체 형태)
  const [startStationObj, setStartStationObj] = useState(null);
  const [endStationObj, setEndStationObj] = useState(null);

  // 시간 설정 상태
  const [timeMode, setTimeMode] = useState('now'); // 'now', 'departure', 'arrival'
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // 모달 제어 상태
  const [pickerType, setPickerType] = useState(null); // 'start' | 'end' | null

  // 상위(지도)에서 전달받은 연동 데이터 처리
  useEffect(() => {
    if (initialStart || initialEnd) {
      setIsSetting(true);
      if (initialStart) {
        setStartStationObj(initialStart);
        clearInitialStart();
      }
      if (initialEnd) {
        setEndStationObj(initialEnd);
        clearInitialEnd();
      }
    }
  }, [initialStart, initialEnd, clearInitialStart, clearInitialEnd]);
  
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!activeAlarm) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((activeAlarm.arrivalTime - now) / 1000);
      
      if (diff <= 0) {
        setRemainingSeconds(0);
        setActiveAlarm(null);
        clearInterval(interval);
        return;
      }

      setRemainingSeconds(diff);

      if (diff <= 120 && !activeAlarm.triggered) {
        setShowPopup(true);
        setActiveAlarm(prev => ({ ...prev, triggered: true }));

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("지하철 하차 알리미 🚇", {
            body: `${activeAlarm.pathData.endStation}역 도착 2분 전입니다! 하차를 준비해 주세요.`,
            requireInteraction: true,
            vibrate: [200, 100, 200]
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAlarm]);

  const calculatedPath = useMemo(() => {
    if (startStationObj && endStationObj) {
      return findShortestPath(startStationObj.lineKey, startStationObj.stationName, endStationObj.lineKey, endStationObj.stationName);
    }
    return null;
  }, [startStationObj, endStationObj]);

  const computedTimes = useMemo(() => {
    if (!calculatedPath) return null;
    let start, end;
    if (timeMode === 'now') {
      start = new Date();
    } else {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      start = new Date();
      start.setHours(hours, minutes, 0, 0);
      if (timeMode === 'arrival') {
        start = new Date(start.getTime() - calculatedPath.totalTime * 60000);
      }
    }
    end = new Date(start.getTime() + calculatedPath.totalTime * 60000);

    const formatT = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return {
      start: formatT(start),
      end: formatT(end)
    };
  }, [calculatedPath, timeMode, selectedTime]);

  const handleStartAlarm = () => {
    if (!startStationObj || !endStationObj) return;
    
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    } else if ("Notification" in window && Notification.permission === "denied") {
      alert("브라우저 알림 권한이 차단되어 있습니다. 설정에서 알림을 허용해 주셔야 백그라운드에서 알림을 받을 수 있습니다.");
    }
    
    if (!calculatedPath) {
      alert("경로를 찾을 수 없습니다.");
      return;
    }

    const arrivalTime = Date.now() + calculatedPath.totalTime * 60 * 1000; 
    
    setActiveAlarm({
      pathData: calculatedPath,
      arrivalTime,
      triggered: false
    });
    
    setIsSetting(false);
  };

  const cancelAlarm = () => setActiveAlarm(null);
  const closePopup = () => setShowPopup(false);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const endLineColor = activeAlarm ? linesData[activeAlarm.pathData.path[activeAlarm.pathData.path.length-1].lineKey].color : '#000';

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '40px', position: 'relative' }}>
      
      {/* 풀스크린 모달 렌더링 */}
      {pickerType && (
        <StationPickerModal 
          title={pickerType === 'start' ? '출발역 선택' : '도착역 선택'}
          onClose={() => setPickerType(null)}
          onSelect={(st) => {
            if (pickerType === 'start') setStartStationObj(st);
            else setEndStationObj(st);
            setPickerType(null);
          }}
        />
      )}

      <header style={{ marginBottom: '32px', paddingTop: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>길찾기 및 알람</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          목적지 경로를 확인하고 도착 2분 전 알람을 받아보세요.
        </p>
      </header>

      {/* 2분 전 알람 팝업 UI */}
      {showPopup && activeAlarm && (
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
      )}

      {/* 알람 설정 화면 */}
      {isSetting ? (
        <AlarmSettingsModal
          setIsSetting={setIsSetting}
          startStationObj={startStationObj}
          setStartStationObj={setStartStationObj}
          endStationObj={endStationObj}
          setEndStationObj={setEndStationObj}
          setPickerType={setPickerType}
          timeMode={timeMode}
          setTimeMode={setTimeMode}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          calculatedPath={calculatedPath}
          computedTimes={computedTimes}
          linesData={linesData}
          handleStartAlarm={handleStartAlarm}
        />
      ) : activeAlarm ? (
        /* 알람 진행 중 대시보드 */
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
                <button onClick={cancelAlarm} style={{ padding: '8px 16px', borderRadius: '12px', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.25)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>알람 취소</button>
              </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>승차 정보</h3>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: linesData[activeAlarm.pathData.path[0].lineKey].color }}></div>
                <div style={{ fontWeight: 700 }}>{activeAlarm.pathData.startStation}역 승차 <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>({activeAlarm.pathData.startLineName})</span></div>
              </div>
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>상행 - 2분 후 도착</div>
                    <TrainCongestion congestions={['low', 'low', 'mid', 'high', 'high', 'mid', 'low', 'low', 'mid', 'high']} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>하행 - 5분 후 도착</div>
                    <TrainCongestion congestions={['mid', 'high', 'high', 'high', 'high', 'mid', 'mid', 'low', 'low', 'low']} />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                        에스컬레이터 빠른하차: {t.fastTransfer.escalator}
                      </span>
                      <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                        엘리베이터: {t.fastTransfer.elevator}
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
      ) : (
        /* 알람 없을 때 기본 화면 */
        <button onClick={() => setIsSetting(true)} style={{
          width: '100%', padding: '24px', backgroundColor: 'var(--accent)', color: 'white',
          borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          gap: '16px', fontWeight: 700, fontSize: '18px', border: 'none', boxShadow: '0 10px 20px rgba(76, 110, 245, 0.3)',
          transition: 'transform 0.2s'
        }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '28px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MapPin size={28} />
          </div>
          출발지/도착지 검색하고 스마트 알람 켜기
        </button>
      )}
    </div>
  );
}
