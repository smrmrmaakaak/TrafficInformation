import { ArrowUpDown, Search } from 'lucide-react';

export default function RouteSearchCard({ startStation, endStation, onStartClick, onEndClick, onSwap, onSearch, timeMode, setTimeMode, selectedTime, setSelectedTime, dayType, setDayType }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)', padding: '16px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: '16px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '44px' }}>
          <button 
            onClick={onStartClick}
            style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', width: '100%', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', marginRight: '12px', width: '30px', textAlign: 'left' }}>출발</span>
            <span style={{ fontSize: '16px', fontWeight: startStation ? 600 : 400, color: startStation ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {startStation ? (
                <>
                  <span style={{ backgroundColor: startStation.lineColor, color: 'white', padding: '2px 6px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>{startStation.lineLabel.replace('호선','').replace('선','')}</span>
                  {startStation.stationName}
                </>
              ) : '출발역을 선택하세요'}
            </span>
          </button>
          
          <button 
            onClick={onEndClick}
            style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', width: '100%', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff3b30', marginRight: '12px', width: '30px', textAlign: 'left' }}>도착</span>
            <span style={{ fontSize: '16px', fontWeight: endStation ? 600 : 400, color: endStation ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {endStation ? (
                <>
                  <span style={{ backgroundColor: endStation.lineColor, color: 'white', padding: '2px 6px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>{endStation.lineLabel.replace('호선','').replace('선','')}</span>
                  {endStation.stationName}
                </>
              ) : '도착역을 선택하세요'}
            </span>
          </button>
        </div>

        <button 
          onClick={onSwap}
          style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-primary)', zIndex: 10, cursor: 'pointer', transition: 'transform 0.2s' }}
        >
          <ArrowUpDown size={18} />
        </button>
      </div>

      {/* 출발/도착 시간 설정 */}
      <div style={{ padding: '0 0 16px 0', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 요일 선택 */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: dayType === 'weekday' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <input type="radio" name="dayType" value="weekday" checked={dayType === 'weekday'} onChange={() => setDayType('weekday')} style={{ accentColor: 'var(--accent)' }} /> 평일
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: dayType === 'weekend' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <input type="radio" name="dayType" value="weekend" checked={dayType === 'weekend'} onChange={() => setDayType('weekend')} style={{ accentColor: 'var(--accent)' }} /> 주말·공휴일
            </label>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: timeMode === 'now' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <input type="radio" name="timeMode_home" value="now" checked={timeMode === 'now'} onChange={() => setTimeMode('now')} style={{ accentColor: 'var(--accent)' }} /> 현재 시간
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: timeMode === 'departure' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <input type="radio" name="timeMode_home" value="departure" checked={timeMode === 'departure'} onChange={() => setTimeMode('departure')} style={{ accentColor: 'var(--accent)' }} /> 출발 기준
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: timeMode === 'arrival' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <input type="radio" name="timeMode_home" value="arrival" checked={timeMode === 'arrival'} onChange={() => setTimeMode('arrival')} style={{ accentColor: 'var(--accent)' }} /> 도착 기준
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

      <button 
        onClick={onSearch}
        style={{ width: '100%', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
      >
        <Search size={18} /> 경로 검색
      </button>
    </div>
  );
}
