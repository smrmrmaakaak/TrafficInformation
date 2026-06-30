import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { linesData } from '../data/stations';

export const DEMO_STATION_COORDS = [
  { lineKey: 'incheon2', lineLabel: '인천 2호선', name: '검단사거리', lat: 37.6027, lng: 126.6555 },
  { lineKey: '2', lineLabel: '2호선', name: '강남', lat: 37.4979, lng: 127.0276 },
  { lineKey: '2', lineLabel: '2호선', name: '홍대입구', lat: 37.5568, lng: 126.9237 },
  { lineKey: '1', lineLabel: '1호선', name: '서울역', lat: 37.5559, lng: 126.9723 },
  { lineKey: '5', lineLabel: '5호선', name: '여의도', lat: 37.5215, lng: 126.9243 },
];

function getDistanceFromLatLonInM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // 테스트 모드 제어 (사용자가 강제로 위치 변경 가능하게)
  const [mockIndex, setMockIndex] = useState(-1);

  useEffect(() => {
    // 모의 위치가 설정되어 있으면 앱/브라우저 GPS 무시
    if (mockIndex >= 0) {
      const mockStation = DEMO_STATION_COORDS[mockIndex];
      setLocation({ lat: mockStation.lat, lng: mockStation.lng });
      setNearestStation({
        ...mockStation,
        lineColor: linesData[mockStation.lineKey].color,
        distanceMeters: 0
      });
      return;
    }

    let watcherId = null;

    const startWatching = async () => {
      try {
        // 권한 확인 및 요청 (네이티브에서 동작)
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location !== 'granted') {
          const request = await Geolocation.requestPermissions();
          if (request.location !== 'granted') {
            throw new Error('Location permission denied');
          }
        }

        watcherId = await Geolocation.watchPosition(
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
          (position, err) => {
            if (err) {
              handleError(err);
              return;
            }
            if (position) {
              setIsTracking(true);
              const currentLat = position.coords.latitude;
              const currentLng = position.coords.longitude;
              setLocation({ lat: currentLat, lng: currentLng });

              let minDistance = Infinity;
              let closest = null;

              DEMO_STATION_COORDS.forEach(station => {
                const dist = getDistanceFromLatLonInM(currentLat, currentLng, station.lat, station.lng);
                if (dist < minDistance) {
                  minDistance = dist;
                  closest = station;
                }
              });

              if (closest) {
                const lineData = linesData[closest.lineKey];
                setNearestStation({
                  ...closest,
                  lineColor: lineData ? lineData.color : '#000',
                  distanceMeters: Math.round(minDistance)
                });
              }
            }
          }
        );
      } catch (err) {
        handleError(err);
      }
    };

    const handleError = (err) => {
      console.warn("Geolocation Error:", err);
      setError(err.message || 'Error occurred');
      setNearestStation(null);
    };

    startWatching();

    return () => {
      if (watcherId !== null) {
        Geolocation.clearWatch({ id: watcherId });
      }
    };
  }, [mockIndex]);

  return { location, nearestStation, error, isTracking, setMockIndex };
}
