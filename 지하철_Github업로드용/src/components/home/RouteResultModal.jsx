import { X, Clock, Map, Navigation, Train, Bath } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState, useEffect, useMemo } from 'react';
import { parseArrivalMsg, generateMockArrivalTime } from '../../utils/trainUtils';
import { fetchRealtimeArrivalData } from '../../hooks/useRealtimeArrival';

import { restroomData } from '../../data/restroomData';
import { linesData } from '../../data/stations';
import StationMapModal from '../common/StationMapModal';

const getRestroomStatus = (rawStationName) => {
  if (!rawStationName) return '위치 정보 없음';
  let stationName = rawStationName.replace(/역$/, ''); // '역' 제거
  if (stationName.includes('(')) stationName = stationName.split('(')[0]; // 괄호 제거
  
  // 노선 데이터(stations.js)에서 생성된 화장실 상태값을 먼저 찾음
  for (const line of Object.values(linesData)) {
    const station = line.stations.find(s => s.name === stationName);
    if (station && station.restroom) {
      if (station.restroom === 'both') return '개찰구 안/밖 모두';
      if (station.restroom === 'inside') return '개찰구 안';
      if (station.restroom === 'outside') return '개찰구 밖';
      if (station.restroom === 'none') return '위치 정보 없음';
      return station.restroom; // maybe string like '개찰구 안'
    }
  }

  // Fallback
  const status = restroomData[stationName];
  if (!status) return '위치 정보 없음';
  
  if (status.includes('both') || status.includes('내외')) return '개찰구 안/밖 모두';
  if (status.includes('inside') || status.includes('안')) return '개찰구 안';
  if (status.includes('outside') || status.includes('밖')) return '개찰구 밖';
  
  return status;
};

export default function RouteResultModal({ isOpen, onClose, routeData, startStation, endStation, timeMode, selectedTime }) {
  const [arrivalTimes, setArrivalTimes] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapStation, setMapStation] = useState('');

  useEffect(() => {
    if (isOpen && routeData) {
      const fetchArrivals = async () => {
        const newArrivalTimes = {};
        // 병렬로 도착 정보 요청
        const promises = routeData.timeline.map(async (item, idx) => {
          if (item.type !== 'transfer_walk' && item.stations && item.stations.length > 0) {
            try {
              if (timeMode && timeMode !== 'now') {
                newArrivalTimes[idx] = generateMockArrivalTime(item.stations[0], selectedTime);
                return;
              }

              const data = await fetchRealtimeArrivalData(item.stations[0]);

              if (data && data.realtimeArrivalList && data.realtimeArrivalList.length > 0) {
                let matchedTrain = data.realtimeArrivalList.find(t => 
                  item.boundFor && t.trainLineNm.includes(item.boundFor)
                );
                
                if (!matchedTrain) matchedTrain = data.realtimeArrivalList[0];
                
                newArrivalTimes[idx] = parseArrivalMsg(matchedTrain.arvlMsg2);
              } else {
                newArrivalTimes[idx] = '정보 없음';
              }
            } catch (err) {
              console.error('Arrival fetch error:', err);
              newArrivalTimes[idx] = '조회 실패';
            }
          }
        });

        await Promise.all(promises);
        setArrivalTimes(newArrivalTimes);
      };

      fetchArrivals();
    }
  }, [isOpen, routeData]);

  // 시작/도착 시간 계산
  const computedTimes = useMemo(() => {
    if (!routeData) return null;
    let start, end;
    if (timeMode === 'now' || !timeMode) {
      start = new Date();
    } else {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      start = new Date();
      start.setHours(hours, minutes, 0, 0);
      if (timeMode === 'arrival') {
        start = new Date(start.getTime() - routeData.totalTime * 60000);
      }
    }
    end = new Date(start.getTime() + routeData.totalTime * 60000);

    const formatT = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return {
      start: formatT(start),
      end: formatT(end)
    };
  }, [routeData, timeMode, selectedTime]);

  if (!isOpen || !routeData) return null;

  return createPortal(
    <>
      <div 
        className="animate-fade-in"
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, backdropFilter: 'blur(2px)'
        }}
      />
      <div 
        className="animate-slide-up glass-card"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          borderBottomLeftRadius: '0', borderBottomRightRadius: '0',
          borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
          padding: '24px', zIndex: 1101,
          height: '85vh', overflowY: 'hidden', display: 'flex', flexDirection: 'column'
        }}
      >
        <div className="drag-handle" style={{ flexShrink: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>경로 안내</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '40px' }}>
          {/* Header Summary */}
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', 
            padding: '20px', marginBottom: '24px', border: '1px solid var(--border)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {startStation?.stationName}
                  <button onClick={() => { setMapStation(startStation?.stationName); setIsMapOpen(true); }} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0
                  }}>
                    <Map size={18} />
                  </button>
                </div>
                {arrivalTimes[0] && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                    <Train size={14} color="var(--accent)" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                      출발역: {arrivalTimes[0]}
                    </span>
                  </div>
                )}
              </div>
              <Navigation size={20} color="var(--text-secondary)" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => { setMapStation(endStation?.stationName); setIsMapOpen(true); }} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0
                  }}>
                    <Map size={18} />
                  </button>
                  {endStation?.stationName}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <Clock size={24} color="var(--accent)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>소요 시간</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)' }}>{routeData.totalTime}분</div>
              </div>
              <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <Map size={24} color="#EF7C1C" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>환승</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#EF7C1C' }}>{routeData.transferCount}회</div>
              </div>
            </div>
          </div>

          {computedTimes && (
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>출발 시간</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{computedTimes.start}</div>
              </div>
              <div style={{ padding: '0 16px' }}>
                <div style={{ width: '24px', height: '2px', backgroundColor: 'var(--border)' }}></div>
              </div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>도착 시간</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{computedTimes.end}</div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', paddingLeft: '8px' }}>상세 경로</h3>
          <div style={{ position: 'relative', paddingLeft: '16px' }}>
            {routeData.timeline.map((item, idx) => {
              if (item.type === 'transfer_walk') {
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', minHeight: '60px', position: 'relative' }}>
                    {/* 선 이어주기 */}
                    <div style={{ position: 'absolute', left: '-1px', top: '0', bottom: '0', width: '2px', borderLeft: '3px dotted var(--text-secondary)', marginLeft: '7px' }} />
                    <div style={{ 
                      width: '16px', height: '16px', borderRadius: '8px', 
                      backgroundColor: 'var(--bg-primary)', border: '4px solid var(--text-secondary)',
                      position: 'absolute', left: 0, zIndex: 2
                    }} />
                    <div style={{ marginLeft: '32px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span>🚶 {item.stationName} 환승 (약 {item.time}분)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '6px' }}>
                        <Bath size={14} color="var(--accent)" />
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          화장실: {getRestroomStatus(item.stationName)}
                        </span>
                      </div>
                      <button onClick={() => { setMapStation(item.stationName); setIsMapOpen(true); }} style={{
                        display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px',
                        backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)',
                        borderRadius: '6px', color: 'var(--text-primary)', fontSize: '11px', fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        <Map size={12} /> 주변 지도
                      </button>
                    </div>
                  </div>
                );
              }

              // Normal Line Segment
              const isLastNode = idx === routeData.timeline.length - 1;
              return (
                <div key={idx} style={{ position: 'relative', paddingBottom: '20px' }}>
                  {/* 노선 선 */}
                  <div style={{ 
                    position: 'absolute', left: '5px', top: '16px', 
                    bottom: isLastNode ? 'calc(100% - 16px)' : '-16px', // 마지막 노드면 아래로 뻗지 않음
                    width: '6px', backgroundColor: item.lineColor, zIndex: 1 
                  }} />

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ 
                      width: '16px', height: '16px', borderRadius: '8px', 
                      backgroundColor: 'white', border: `5px solid ${item.lineColor}`,
                      position: 'relative', zIndex: 2, marginTop: '2px'
                    }} />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '8px', backgroundColor: item.lineColor, 
                          color: 'white', fontSize: '12px', fontWeight: 800 
                        }}>
                          {item.lineLabel}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '16px' }}>{item.stations[0]}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '6px' }}>
                          <Bath size={14} color="var(--accent)" />
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            화장실: {getRestroomStatus(item.stations[0])}
                          </span>
                        </div>
                        {item.boundFor && (
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>({item.boundFor}행)</span>
                        )}
                        {/* 열차 도착 예정 시간 */}
                        {arrivalTimes[idx] !== undefined && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '6px', marginLeft: 'auto' }}>
                            <Train size={14} color="var(--accent)" />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                              {arrivalTimes[idx]}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {item.stations.length > 1 && (
                        <div style={{ 
                          color: 'var(--text-secondary)', fontSize: '14px', 
                          paddingLeft: '12px', borderLeft: '2px solid var(--border)', 
                          marginLeft: '14px', marginBottom: '8px', paddingBottom: '4px', paddingTop: '4px'
                        }}>
                          {item.stations.length - 1}개 역 이동 ({item.time}분)
                        </div>
                      )}
                      
                      {item.stations.length > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 800, fontSize: '16px' }}>{item.stations[item.stations.length - 1]}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '6px' }}>
                            <Bath size={14} color="var(--accent)" />
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              화장실: {getRestroomStatus(item.stations[item.stations.length - 1])}
                            </span>
                          </div>
                          {isLastNode && (
                            <span style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 700, backgroundColor: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '6px' }}>도착</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <StationMapModal 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        stationName={mapStation}
      />
    </>,
    document.body
  );
}
