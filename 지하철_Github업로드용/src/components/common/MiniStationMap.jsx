import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, MapPin } from 'lucide-react';
import useNaverMap from '../../hooks/useNaverMap';
import useRealtimeArrival from '../../hooks/useRealtimeArrival';
import { parseEtaMinutes } from '../../utils/trainUtils';

const R = 6378137; // Earth’s radius in meters

const offsetLatLng = (lat, lng, distanceMeters, bearingDegrees) => {
  const d = distanceMeters;
  const lat1 = (lat * Math.PI) / 180;
  const lng1 = (lng * Math.PI) / 180;
  const brng = (bearingDegrees * Math.PI) / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d / R) +
    Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng)
  );
  const lng2 = lng1 + Math.atan2(
    Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
    Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
  );

  return { lat: (lat2 * 180) / Math.PI, lng: (lng2 * 180) / Math.PI };
};

export default function MiniStationMap({ stationName, onExpand }) {
  const { isLoaded, error } = useNaverMap();
  const { arrivalInfo } = useRealtimeArrival(stationName);
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const stationMarker = useRef(null);
  const trainMarkers = useRef([]);
  const animFrame = useRef(null);
  
  const [geocodeError, setGeocodeError] = useState(false);
  const [stationCoords, setStationCoords] = useState(null);

  // Initialize Map
  useEffect(() => {
    if (!isLoaded || !mapElement.current || !stationName) return;
    if (error) return;

    const query = stationName.endsWith('역') ? stationName : `${stationName}역`;
    window.naver.maps.Service.geocode({ query }, (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK || response.v2.meta.totalCount === 0) {
        setGeocodeError(true);
        setStationCoords({ lat: 37.5666805, lng: 126.9784147 }); // Seoul City Hall fallback
        return;
      }
      setGeocodeError(false);
      const item = response.v2.addresses[0];
      setStationCoords({ lat: parseFloat(item.y), lng: parseFloat(item.x) });
    });
  }, [isLoaded, stationName, error]);

  // Render Map and Station Marker
  useEffect(() => {
    if (!stationCoords || !isLoaded) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.naver.maps.Map(mapElement.current, {
        center: new window.naver.maps.LatLng(stationCoords.lat, stationCoords.lng),
        zoom: 15,
        minZoom: 10,
        logoControl: false,
        mapDataControl: false,
        scaleControl: false,
      });
    } else {
      mapInstance.current.setCenter(new window.naver.maps.LatLng(stationCoords.lat, stationCoords.lng));
    }

    if (!stationMarker.current) {
      stationMarker.current = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(stationCoords.lat, stationCoords.lng),
        map: mapInstance.current,
        icon: {
          content: `
            <div style="background: var(--accent); color: white; padding: 4px 10px; border-radius: 16px; font-weight: bold; font-size: 13px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); border: 2px solid white; display: flex; align-items: center; gap: 4px; transform: translate(-50%, -100%);">
              <span>${stationName}</span>
            </div>
          `,
          anchor: new window.naver.maps.Point(0, 0),
        },
      });
    } else {
      stationMarker.current.setPosition(new window.naver.maps.LatLng(stationCoords.lat, stationCoords.lng));
    }
  }, [stationCoords, isLoaded, stationName]);

  // Handle Train Markers and Animation
  useEffect(() => {
    if (!mapInstance.current || !stationCoords || !arrivalInfo) return;

    const upEta = parseEtaMinutes(arrivalInfo?.up);
    const downEta = parseEtaMinutes(arrivalInfo?.down);

    // 열차 데이터 업데이트 로직 (기존 마커 재사용)
    const updateTrain = (type, color, eta, angle) => {
      if (eta === null) return;
      const targetDistance = eta * 250; // 1분당 250m (화면에 잘 보이도록 압축)
      
      let train = trainMarkers.current.find(t => t.type === type);
      if (!train) {
        // 새 마커 생성
        const pos = offsetLatLng(stationCoords.lat, stationCoords.lng, targetDistance, angle);
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(pos.lat, pos.lng),
          map: mapInstance.current,
          icon: {
            content: `
              <div style="background: white; border: 2px solid ${color}; padding: 4px 8px; border-radius: 12px; font-weight: bold; font-size: 11px; color: #333; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; transform: translate(-50%, -50%); transition: background-color 0.3s;">
                <span style="font-size: 14px;">🚋</span> ${type}
              </div>
            `,
            anchor: new window.naver.maps.Point(0, 0),
          }
        });
        train = { type, marker, currentDistance: targetDistance, angle };
        trainMarkers.current.push(train);
      } else {
        // 기존 마커 거리 갱신 (너무 차이나면 보정)
        if (Math.abs(train.currentDistance - targetDistance) > 300) {
          train.currentDistance = targetDistance;
        }
      }
    };

    updateTrain('상행', '#ff3b30', upEta, 225);
    updateTrain('하행', '#007AFF', downEta, 45);

    // Animation Loop
    let lastTime = null;
    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      trainMarkers.current.forEach(t => {
        if (t.currentDistance > 10) {
          // 시각적으로 움직임이 잘 보이도록 초당 약 15m 속도로 과장해서 이동
          t.currentDistance -= 15 * delta; 
          const pos = offsetLatLng(stationCoords.lat, stationCoords.lng, Math.max(t.currentDistance, 10), t.angle);
          t.marker.setPosition(new window.naver.maps.LatLng(pos.lat, pos.lng));
        }
      });

      animFrame.current = requestAnimationFrame(animate);
    };
    
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
    animFrame.current = requestAnimationFrame(animate);

    return () => {
      // 컴포넌트 언마운트나 역이 바뀔 때만 정리
    };
  }, [arrivalInfo, stationCoords]);

  // Clean up on unmount or station change
  useEffect(() => {
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
      trainMarkers.current.forEach(m => m.marker.setMap(null));
      trainMarkers.current = [];
    };
  }, [stationName]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', marginTop: '8px' }}>
      {error ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          지도 로드 중 오류가 발생했습니다.
        </div>
      ) : !isLoaded ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          지도를 불러오는 중입니다...
        </div>
      ) : (
        <>
          <div ref={mapElement} style={{ width: '100%', height: '100%' }} />
          {geocodeError && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', pointerEvents: 'none' }}>
              위치 정보를 찾을 수 없습니다.
            </div>
          )}
          {onExpand && (
            <button 
              onClick={onExpand}
              style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: 'white', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 10
              }}
            >
              <Maximize2 size={18} color="#333" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
