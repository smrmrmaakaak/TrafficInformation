import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import useNaverMap from '../../hooks/useNaverMap';
import useRealtimeArrival from '../../hooks/useRealtimeArrival';
import { parseEtaMinutes } from '../../utils/trainUtils';

const R = 6378137;

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

export default function StationMapModal({ isOpen, onClose, stationName }) {
  const { isLoaded, error } = useNaverMap();
  const { arrivalInfo } = useRealtimeArrival(isOpen ? stationName : null);
  
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const stationMarker = useRef(null);
  const trainMarkers = useRef([]);
  const animFrame = useRef(null);
  
  const [geocodeError, setGeocodeError] = useState(false);
  const [stationCoords, setStationCoords] = useState(null);

  useEffect(() => {
    if (!isOpen || !isLoaded || !mapElement.current || !stationName) return;
    if (error) return;

    const query = stationName.endsWith('역') ? stationName : `${stationName}역`;
    window.naver.maps.Service.geocode({ query }, (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK || response.v2.meta.totalCount === 0) {
        setGeocodeError(true);
        setStationCoords({ lat: 37.5666805, lng: 126.9784147 });
        return;
      }
      setGeocodeError(false);
      const item = response.v2.addresses[0];
      setStationCoords({ lat: parseFloat(item.y), lng: parseFloat(item.x) });
    });
  }, [isOpen, isLoaded, stationName, error]);

  useEffect(() => {
    if (error) {
      console.error('Naver Maps API load error', error);
    }
  }, [error]);

  useEffect(() => {
    if (!isOpen) {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
      stationMarker.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !stationCoords || !isLoaded) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.naver.maps.Map(mapElement.current, {
        center: new window.naver.maps.LatLng(stationCoords.lat, stationCoords.lng),
        zoom: 15,
        minZoom: 10,
        logoControl: false,
        mapDataControl: false,
      });
    } else {
      mapInstance.current.setCenter(new window.naver.maps.LatLng(stationCoords.lat, stationCoords.lng));
      window.naver.maps.Event.trigger(mapInstance.current, 'resize');
    }

    if (!stationMarker.current) {
      stationMarker.current = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(stationCoords.lat, stationCoords.lng),
        map: mapInstance.current,
        icon: {
          content: `
            <div style="background: var(--accent); color: white; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; gap: 4px; transform: translate(-50%, -100%);">
              <span>${stationName}</span>
            </div>
          `,
          anchor: new window.naver.maps.Point(0, 0),
        },
      });
    } else {
      stationMarker.current.setPosition(new window.naver.maps.LatLng(stationCoords.lat, stationCoords.lng));
    }
  }, [isOpen, stationCoords, isLoaded, stationName]);

  // Train Markers Animation
  useEffect(() => {
    if (!isOpen || !mapInstance.current || !stationCoords || !arrivalInfo) return;

    const upEta = parseEtaMinutes(arrivalInfo?.up);
    const downEta = parseEtaMinutes(arrivalInfo?.down);

    // 열차 데이터 업데이트 로직 (기존 마커 재사용)
    const updateTrain = (type, color, eta, angle) => {
      if (eta === null) return;
      const targetDistance = eta * 250; // 1분당 250m
      
      let train = trainMarkers.current.find(t => t.type === type);
      if (!train) {
        // 새 마커 생성
        const pos = offsetLatLng(stationCoords.lat, stationCoords.lng, targetDistance, angle);
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(pos.lat, pos.lng),
          map: mapInstance.current,
          icon: {
            content: `
              <div style="background: white; border: 2px solid ${color}; padding: 6px 10px; border-radius: 16px; font-weight: bold; font-size: 12px; color: #333; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 6px; transform: translate(-50%, -50%); transition: background-color 0.3s;">
                <span style="font-size: 16px;">🚋</span> ${type} (${eta}분)
              </div>
            `,
            anchor: new window.naver.maps.Point(0, 0),
          }
        });
        train = { type, marker, currentDistance: targetDistance, angle };
        trainMarkers.current.push(train);
      } else {
        // 기존 마커 정보 및 거리 갱신
        train.marker.setIcon({
          content: `
            <div style="background: white; border: 2px solid ${color}; padding: 6px 10px; border-radius: 16px; font-weight: bold; font-size: 12px; color: #333; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 6px; transform: translate(-50%, -50%); transition: background-color 0.3s;">
              <span style="font-size: 16px;">🚋</span> ${type} (${eta}분)
            </div>
          `,
          anchor: new window.naver.maps.Point(0, 0),
        });
        
        if (Math.abs(train.currentDistance - targetDistance) > 300) {
          train.currentDistance = targetDistance;
        }
      }
    };

    updateTrain('상행', '#ff3b30', upEta, 225);
    updateTrain('하행', '#007AFF', downEta, 45);

    let lastTime = null;
    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      trainMarkers.current.forEach(t => {
        if (t.currentDistance > 10) {
          t.currentDistance -= 15 * delta; // 15m/s 속도로 움직임 과장
          const pos = offsetLatLng(stationCoords.lat, stationCoords.lng, Math.max(t.currentDistance, 10), t.angle);
          t.marker.setPosition(new window.naver.maps.LatLng(pos.lat, pos.lng));
        }
      });

      animFrame.current = requestAnimationFrame(animate);
    };
    
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
    animFrame.current = requestAnimationFrame(animate);

    return () => {
      // Cleanup happens when modal closes or station changes
    };
  }, [isOpen, arrivalInfo, stationCoords]);

  // Clean up on unmount or station change
  useEffect(() => {
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
      trainMarkers.current.forEach(m => m.marker.setMap(null));
      trainMarkers.current = [];
    };
  }, [isOpen, stationName]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '20px'
    }}>
      <div className="animate-slide-up glass-card" style={{
        width: '100%', maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{
          padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{stationName}역 주변 지도</h3>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'
          }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          {!isLoaded && !error && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>지도 불러오는 중...</p>
            </div>
          )}
          {error && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)'
            }}>
              <p style={{ color: '#ff6b6b' }}>지도 로드 실패. API 키를 확인해주세요.</p>
            </div>
          )}
          {geocodeError && (
            <div style={{
              position: 'absolute', top: 16, left: 16, right: 16, padding: '12px',
              backgroundColor: 'rgba(255,107,107,0.9)', color: 'white', borderRadius: '8px',
              zIndex: 10, fontSize: '14px', textAlign: 'center'
            }}>
              {stationName}역의 위치를 찾을 수 없어 기본 위치를 표시합니다.
            </div>
          )}
          
          <div ref={mapElement} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
