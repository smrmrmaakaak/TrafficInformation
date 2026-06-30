import { AlertTriangle, Clock, MapPin, RefreshCw, Map as MapIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import TrainCongestion from '../common/TrainCongestion';
import useRealtimeArrival from '../../hooks/useRealtimeArrival';
import { parseEtaMinutes } from '../../utils/trainUtils';
import StationMapModal from '../common/StationMapModal';

function getTrainLength(lineName) {
  if (!lineName) return 10;
  if (lineName.includes('1호선') || lineName.includes('2호선') || lineName.includes('3호선') || lineName.includes('4호선')) return 10;
  if (lineName.includes('5호선') || lineName.includes('6호선') || lineName.includes('7호선') || lineName.includes('경의중앙')) return 8;
  if (lineName.includes('8호선') || lineName.includes('9호선') || lineName.includes('수인분당') || lineName.includes('신분당') || lineName.includes('공항철도')) return 6;
  if (lineName.includes('신림') || lineName.includes('우이신설') || lineName.includes('김포골드') || lineName.includes('인천2호선')) return 2;
  return 10;
}

export default function BriefingCard({ nearestStation, isCustom, onChangeClick, isError }) {
  const stationName = nearestStation?.name || nearestStation?.stationName;
  const { arrivalInfo, loading: realtimeLoading } = useRealtimeArrival(stationName);
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [upCongestions, setUpCongestions] = useState([]);
  const [downCongestions, setDownCongestions] = useState([]);

  useEffect(() => {
    if (realtimeLoading) {
      setLoading(true);
      return;
    }
    
    // 기본 열차 량 계산
    const trainLength = getTrainLength(nearestStation?.lineName);
    const fallbackUp = Array(trainLength).fill('low');
    const fallbackDown = Array(trainLength).fill('low');
    
    if (arrivalInfo?.rawList && arrivalInfo.rawList.length > 0) {
      // SK OpenAPI를 통해 실시간 혼잡도 조회 시도
      const fetchCongestion = async () => {
        try {
          const skKey = import.meta.env.VITE_SK_API_KEY;
          if (!skKey) throw new Error('No SK API Key');
          
          let lineNum = (nearestStation?.lineName || '').replace(/[^0-9]/g, '');
          if (!lineNum) lineNum = (nearestStation?.lineName || '').includes('수인분당') ? 'K2' : '2';

          const upTrain = arrivalInfo.rawList.find(t => t.updnLine === '상행' || t.updnLine === '내선');
          const downTrain = arrivalInfo.rawList.find(t => t.updnLine === '하행' || t.updnLine === '외선');
          
          let upResult = fallbackUp;
          let downResult = fallbackDown;

          const fetchForTrain = async (train) => {
            if (!train || !train.statnId) return null;
            const stationCode = train.statnId.slice(-4);
            const res = await fetch(`/sk-api/puzzle/subway/congestion/rltm/trains/${lineNum}/stations/${stationCode}`, {
              headers: { 'appKey': skKey, 'Accept': 'application/json' }
            });
            if (!res.ok) return null;
            const data = await res.json();
            if (data?.success && data?.data?.congestionResult?.congestionCar) {
               const parts = data.data.congestionResult.congestionCar.split('|');
               return parts.map(p => {
                 const val = parseInt(p, 10);
                 if (val < 35) return 'low';
                 if (val < 70) return 'mid';
                 return 'high';
               });
            }
            return null;
          };

          if (upTrain) {
            const res = await fetchForTrain(upTrain);
            if (res) upResult = res;
          }
          if (downTrain) {
            const res = await fetchForTrain(downTrain);
            if (res) downResult = res;
          }

          setUpCongestions(upResult);
          setDownCongestions(downResult);
        } catch (e) {
          setUpCongestions(fallbackUp);
          setDownCongestions(fallbackDown);
        } finally {
          setLoading(false);
        }
      };
      fetchCongestion();
    } else {
      setUpCongestions(fallbackUp);
      setDownCongestions(fallbackDown);
      setLoading(false);
    }
  }, [realtimeLoading, arrivalInfo, nearestStation]);

  if (isError) {
    return (
      <div className="animate-slide-up" style={{ 
        padding: '20px', 
        marginBottom: '24px', 
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff3b30', fontWeight: 700, fontSize: '14px' }}>
            <MapPin size={16} /> GPS 위치 오류
          </div>
          {onChangeClick && (
            <button onClick={onChangeClick} style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 600 }}>
              직접 설정
            </button>
          )}
        </div>
        <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          위치를 찾을 수 없어 브리핑을 제공할 수 없습니다. 상단의 버튼을 눌러 관심 역을 선택해주세요.
        </p>
      </div>
    );
  }

  if (!nearestStation) return null;

  // 동적 혼잡도 로직은 상단의 useEffect(fetchCongestion)로 이동됨

  const hasUpTrain = arrivalInfo?.up && arrivalInfo.up !== '정보 없음' && arrivalInfo.up !== '열차 정보 없음' && arrivalInfo.up !== '정보 불러오기 실패' && !arrivalInfo.up.includes('운행종료');
  const hasDownTrain = arrivalInfo?.down && arrivalInfo.down !== '정보 없음' && arrivalInfo.down !== '열차 정보 없음' && arrivalInfo.down !== '정보 불러오기 실패' && !arrivalInfo.down.includes('운행종료');

  const isCongested = (hasUpTrain && upCongestions.filter(c => c === 'high').length >= 3) || 
                      (hasDownTrain && downCongestions.filter(c => c === 'high').length >= 3);

  let guideMessage = null;
  let guideType = 'normal';

  if (!isCustom && nearestStation.distanceMeters && (hasUpTrain || hasDownTrain)) {
    const walkingMinutes = Math.ceil(nearestStation.distanceMeters / 67); // 4km/h 기준
    const upEta = hasUpTrain ? parseEtaMinutes(arrivalInfo?.up) : null;
    const downEta = hasDownTrain ? parseEtaMinutes(arrivalInfo?.down) : null;
    
    const validEtas = [upEta, downEta].filter(eta => eta !== null);
    if (validEtas.length > 0) {
      const minEta = Math.min(...validEtas);
      if (walkingMinutes > minEta) {
        guideMessage = `도보 ${walkingMinutes}분 소요! 뛰어야 탈 수 있어요 🏃‍♂️💨`;
        guideType = 'urgent';
      } else if (walkingMinutes + 2 >= minEta) {
        guideMessage = `도보 ${walkingMinutes}분 소요! 빠른 걸음으로 가세요 🚶‍♂️`;
        guideType = 'warning';
      } else {
        guideMessage = `도보 ${walkingMinutes}분 소요! 여유 있게 걸어가세요 🚶`;
        guideType = 'safe';
      }
    }
  }

  return (
    <div className="animate-slide-up" style={{ 
      padding: '20px', 
      marginBottom: '24px', 
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderLeft: `4px solid ${nearestStation.lineColor}`,
      borderRadius: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>
          <MapPin size={14} /> {isCustom ? '관심 역 기준' : '현재 위치 기준'}
        </div>
        {onChangeClick && (
          <button onClick={onChangeClick} style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 600 }}>
            위치 변경
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            {stationName}역 실시간 열차
          </h3>
          {isCongested && (
            <span style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: 'rgba(255,59,48,0.1)', color: '#ff3b30', borderRadius: '4px', fontWeight: 600 }}>
              혼잡 주의
            </span>
          )}
        </div>
        <button onClick={() => setIsMapOpen(true)} style={{
          display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px',
          backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)',
          borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600,
          cursor: 'pointer'
        }}>
          <MapIcon size={14} /> 주변 지도
        </button>
      </div>
      
      <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--text-secondary)' }}>
        {(!hasUpTrain && !hasDownTrain) ? '현재 역에 접근 중인 열차가 없습니다.' : 
          isCongested ? '출근시간대 열차 혼잡도가 높습니다. 실시간 정보를 확인하세요.' : '현재 다가오는 열차는 비교적 여유로운 상태입니다.'}
      </p>

      {guideMessage && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '15px',
          backgroundColor: guideType === 'urgent' ? 'rgba(255, 59, 48, 0.1)' : guideType === 'warning' ? 'rgba(255, 149, 0, 0.1)' : 'rgba(52, 199, 89, 0.1)',
          color: guideType === 'urgent' ? '#ff3b30' : guideType === 'warning' ? '#ff9500' : '#34c759'
        }}>
          {guideType === 'urgent' ? <AlertTriangle size={18} /> : null}
          {guideMessage}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <RefreshCw size={16} className="animate-spin" /> 실시간 데이터 불러오는 중...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: hasUpTrain ? '8px' : '0' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>상행/내선</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--accent)" />
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{arrivalInfo?.up || '정보 없음'}</span>
              </div>
            </div>
            {hasUpTrain && <TrainCongestion congestions={upCongestions} />}
          </div>
          
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: hasDownTrain ? '8px' : '0' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>하행/외선</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--accent)" />
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{arrivalInfo?.down || '정보 없음'}</span>
              </div>
            </div>
            {hasDownTrain && <TrainCongestion congestions={downCongestions} />}
          </div>
        </div>
      )}

      {/* Naver Map Modal */}
      <StationMapModal 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        stationName={stationName}
      />
    </div>
  );
}
