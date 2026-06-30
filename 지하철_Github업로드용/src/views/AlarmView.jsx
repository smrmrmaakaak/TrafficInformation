import { useState, useEffect, useMemo } from 'react';
import { MapPin, X, Check, Search, Navigation } from 'lucide-react';
import { linesData } from '../data/stations';
import { findShortestPath } from '../utils/pathfinder';
import StationPickerModal from '../components/common/StationPickerModal';
import { useAlarmTimer } from '../hooks/useAlarmTimer';
import { useGeolocation } from '../hooks/useGeolocation';
import PathSummary from '../components/alarm/PathSummary';
import AlarmDashboard from '../components/alarm/AlarmDashboard';
import AlarmPopup from '../components/alarm/AlarmPopup';
import ExitGuidePopup from '../components/alarm/ExitGuidePopup';

export default function AlarmView({ initialStart, initialEnd, clearInitialStart, clearInitialEnd }) {
  const [isSetting, setIsSetting] = useState(false);
  
  const [startStationObj, setStartStationObj] = useState(null);
  const [endStationObj, setEndStationObj] = useState(null);
  const [pickerType, setPickerType] = useState(null);

  const { location, nearestStation, isTracking } = useGeolocation();

  const { 
    activeAlarm, remainingSeconds, showPopup, showExitGuide, 
    startAlarm, cancelAlarm, closePopup, closeExitGuide, forceShowExitGuide
  } = useAlarmTimer(location);

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

  useEffect(() => {
    if (isSetting && !startStationObj && nearestStation) {
      setStartStationObj({
        lineKey: nearestStation.lineKey,
        lineLabel: nearestStation.lineLabel,
        lineColor: nearestStation.lineColor,
        stationName: nearestStation.name
      });
    }
  }, [isSetting, startStationObj, nearestStation]);
  
  const calculatedPath = useMemo(() => {
    if (startStationObj && endStationObj) {
      const result = findShortestPath(startStationObj.lineKey, startStationObj.stationName, endStationObj.lineKey, endStationObj.stationName);
      if (result && result.totalTime !== Infinity) return result;
    }
    return null;
  }, [startStationObj, endStationObj]);

  const handleStartAlarm = () => {
    if (!startStationObj || !endStationObj) return;
    if (!calculatedPath) {
      alert("경로를 찾을 수 없습니다.");
      return;
    }
    startAlarm(calculatedPath);
    setIsSetting(false);
  };

  const endLineColor = activeAlarm ? linesData[activeAlarm.pathData.path[activeAlarm.pathData.path.length-1].lineKey].color : (endStationObj ? endStationObj.lineColor : '#000');

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '40px', position: 'relative' }}>
      
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
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={24} color={isTracking ? "var(--accent)" : "var(--text-secondary)"} />
          길찾기 및 스마트 알람
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          GPS가 목적지 도착을 감지하고 하차 알림을 보내줍니다.
        </p>
      </header>

      <AlarmPopup 
        activeAlarm={activeAlarm} 
        showPopup={showPopup} 
        endLineColor={endLineColor} 
        closePopup={closePopup} 
      />
      <ExitGuidePopup
        activeAlarm={activeAlarm}
        showExitGuide={showExitGuide}
        endLineColor={endLineColor}
        closeExitGuide={closeExitGuide}
      />

      {isSetting ? (
        <div className="animate-fade-in">
          <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>경로 검색</h2>
            <button onClick={() => { setIsSetting(false); setStartStationObj(null); setEndStationObj(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 0 }}>
              <X size={28} />
            </button>
          </div>

          <div className="glass-card" style={{ position: 'relative', marginBottom: '32px' }}>
            <div 
              onClick={() => setPickerType('start')}
              style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--bg-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                <MapPin size={20} color={startStationObj ? startStationObj.lineColor : '#64748b'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  출발지 {startStationObj && nearestStation?.name === startStationObj.stationName && <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>(현재 위치 기반 자동설정)</span>}
                </div>
                {startStationObj ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800 }}>{startStationObj.stationName}역</span>
                    <span style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: startStationObj.lineColor, color: 'white', borderRadius: '4px' }}>{startStationObj.lineLabel}</span>
                  </div>
                ) : <span style={{ color: 'var(--text-secondary)' }}>출발역을 선택하세요</span>}
              </div>
              <Search size={20} color="var(--text-secondary)" />
            </div>

            <div 
              onClick={() => setPickerType('end')}
              style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderTop: '1px solid var(--glass-border)' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--bg-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                <MapPin size={20} color={endStationObj ? endStationObj.lineColor : '#64748b'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>도착지</div>
                {endStationObj ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800 }}>{endStationObj.stationName}역</span>
                    <span style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: endStationObj.lineColor, color: 'white', borderRadius: '4px' }}>{endStationObj.lineLabel}</span>
                  </div>
                ) : <span style={{ color: 'var(--text-secondary)' }}>도착역을 선택하세요</span>}
              </div>
              <Search size={20} color="var(--text-secondary)" />
            </div>
          </div>

          <PathSummary calculatedPath={calculatedPath} />

          <button 
            className="glass-button"
            onClick={handleStartAlarm}
            disabled={!startStationObj || !endStationObj}
            style={{
              width: '100%', padding: '18px', borderRadius: '16px',
              backgroundColor: startStationObj && endStationObj ? endLineColor : 'var(--border)',
              color: 'white', fontWeight: 800, fontSize: '16px', border: 'none',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
            }}
          >
            <Check size={20} /> 알람 켜기
          </button>
        </div>
      ) : activeAlarm ? (
        <AlarmDashboard 
          activeAlarm={activeAlarm} 
          remainingSeconds={remainingSeconds} 
          endLineColor={endLineColor} 
          cancelAlarm={cancelAlarm} 
          forceShowExitGuide={forceShowExitGuide}
        />
      ) : (
        <button onClick={() => setIsSetting(true)} style={{
          width: '100%', padding: '24px', backgroundColor: 'var(--accent)', color: 'white',
          borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          gap: '16px', fontWeight: 700, fontSize: '18px', border: 'none', boxShadow: '0 10px 20px rgba(76, 110, 245, 0.3)',
          transition: 'transform 0.2s'
        }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '28px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Navigation size={28} />
          </div>
          내 위치 기반 스마트 알람 켜기
        </button>
      )}
    </div>
  );
}
