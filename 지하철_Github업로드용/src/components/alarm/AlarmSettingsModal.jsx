import { X, MapPin, Search, Clock, ArrowRight, Check } from 'lucide-react';
import TrainCongestion from '../common/TrainCongestion';

export default function AlarmSettingsModal({
  setIsSetting,
  startStationObj, setStartStationObj,
  endStationObj, setEndStationObj,
  setPickerType,
  timeMode, setTimeMode,
  selectedTime, setSelectedTime,
  calculatedPath, computedTimes, linesData,
  handleStartAlarm
}) {
  const endLineColor = endStationObj ? endStationObj.lineColor : 'var(--border)';

  return (
    <div className="animate-fade-in">
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>경로 검색</h2>
        <button onClick={() => { setIsSetting(false); setStartStationObj(null); setEndStationObj(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: 0 }}>
          <X size={28} />
        </button>
      </div>

      <div className="glass-card" style={{ position: 'relative', marginBottom: '32px' }}>
        {/* 출발역 선택 버튼 */}
        <div 
          onClick={() => setPickerType('start')}
          style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--bg-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
            <MapPin size={20} color={startStationObj ? startStationObj.lineColor : '#64748b'} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>출발지</div>
            {startStationObj ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800 }}>{startStationObj.stationName}역</span>
                  <span style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: startStationObj.lineColor, color: 'white', borderRadius: '4px' }}>{startStationObj.lineLabel}</span>
                </div>
                {/* 임시 혼잡도 바 삭제 혹은 실시간 데이터로 교체 가능 (현재는 유지) */}
              </div>
            ) : <span style={{ color: 'var(--text-secondary)' }}>출발역을 선택하세요</span>}
          </div>
          <Search size={20} color="var(--text-secondary)" />
        </div>

        {/* 도착역 선택 버튼 */}
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

        {/* 출발/도착 시간 설정 */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--bg-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
            <Clock size={20} color="var(--text-secondary)" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: timeMode === 'now' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <input type="radio" name="timeMode" value="now" checked={timeMode === 'now'} onChange={() => setTimeMode('now')} style={{ accentColor: 'var(--accent)' }} /> 현재 시간
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: timeMode === 'departure' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <input type="radio" name="timeMode" value="departure" checked={timeMode === 'departure'} onChange={() => setTimeMode('departure')} style={{ accentColor: 'var(--accent)' }} /> 출발 기준
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: timeMode === 'arrival' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <input type="radio" name="timeMode" value="arrival" checked={timeMode === 'arrival'} onChange={() => setTimeMode('arrival')} style={{ accentColor: 'var(--accent)' }} /> 도착 기준
              </label>
            </div>
            {timeMode !== 'now' && (
              <input 
                type="time" 
                value={selectedTime} 
                onChange={(e) => setSelectedTime(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '16px', fontFamily: 'inherit' }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 예상 경로 미리보기 */}
      {calculatedPath && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>경로 요약</h3>
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '6px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              총 {calculatedPath.totalTime}분 소요
            </div>
          </div>

          {computedTimes && (
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>출발 시간</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{computedTimes.start}</div>
              </div>
              <div style={{ padding: '0 16px' }}>
                <ArrowRight size={24} color="var(--text-secondary)" />
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>도착 시간</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{computedTimes.end}</div>
              </div>
            </div>
          )}
          
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
                      <span style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border)', color: t.restroom === 'inside' || t.restroom === 'both' ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        화장실: {t.restroom === 'inside' ? '개찰구 안' : t.restroom === 'outside' ? '개찰구 밖' : t.restroom === 'both' ? '안/밖 모두' : '정보 없음'}
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
      )}

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
  );
}
