import React, { useEffect, useRef, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { createPortal } from 'react-dom';
import useNaverMap from '../../hooks/useNaverMap';
import { DEMO_STATION_COORDS } from '../../hooks/useGeolocation';
import { linesData } from '../../data/stations';

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

export default function NearbyMapModal({ isOpen, onClose, userLocation }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const { isLoaded, error } = useNaverMap();
  const [nearbyStations, setNearbyStations] = useState([]);

  useEffect(() => {
    if (userLocation) {
      const withDistance = DEMO_STATION_COORDS.map(station => {
        const dist = getDistanceFromLatLonInM(userLocation.lat, userLocation.lng, station.lat, station.lng);
        return { ...station, distance: dist };
      }).sort((a, b) => a.distance - b.distance);
      setNearbyStations(withDistance);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isLoaded || !mapRef.current || !userLocation) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
        zoom: 15,
        mapDataControl: false,
        scaleControl: false,
      });
    } else {
      mapInstanceRef.current.setCenter(new window.naver.maps.LatLng(userLocation.lat, userLocation.lng));
      window.naver.maps.Event.trigger(mapInstanceRef.current, 'resize');
    }

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // User Location Marker (Blue Dot)
    const userMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(userLocation.lat, userLocation.lng),
      map: mapInstanceRef.current,
      icon: {
        content: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: rgba(0, 122, 255, 0.2); animation: pulse 2s infinite;"></div>
            <div style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background-color: #007AFF; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(0.5); opacity: 1; }
              100% { transform: scale(1.5); opacity: 0; }
            }
          </style>
        `,
        size: new window.naver.maps.Size(48, 48),
        anchor: new window.naver.maps.Point(24, 24),
      }
    });
    markersRef.current.push(userMarker);

    // Nearby Stations Markers
    nearbyStations.forEach(station => {
      const color = linesData[station.lineKey]?.color || '#999999';
      const distanceStr = station.distance < 1000 
        ? `${Math.round(station.distance)}m` 
        : `${(station.distance / 1000).toFixed(1)}km`;

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(station.lat, station.lng),
        map: mapInstanceRef.current,
        icon: {
          content: `
            <div style="display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
              <div style="background-color: white; border: 2px solid ${color}; padding: 4px 10px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; white-space: nowrap;">
                <span style="font-size: 13px; font-weight: 800; color: #333;">${station.name}</span>
                <span style="font-size: 11px; font-weight: 600; color: ${color};">${station.lineLabel} · ${distanceStr}</span>
              </div>
              <div style="width: 2px; height: 8px; background-color: ${color};"></div>
              <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; border: 2px solid white;"></div>
            </div>
          `,
          size: new window.naver.maps.Size(100, 60),
          anchor: new window.naver.maps.Point(50, 60),
        }
      });
      markersRef.current.push(marker);
    });

  }, [isOpen, isLoaded, userLocation, nearbyStations]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div 
        className="animate-fade-in"
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, backdropFilter: 'blur(2px)'
        }}
      />
      <div 
        className="animate-slide-up glass-card"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          borderBottomLeftRadius: '0', borderBottomRightRadius: '0',
          borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
          padding: 0, zIndex: 2001,
          height: '90vh', display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-primary)', zIndex: 1, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={24} color="var(--accent)" />
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>내 주변 역 찾기</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>
        
        {error ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            지도 로드 중 오류가 발생했습니다.
          </div>
        ) : !isLoaded ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            지도를 불러오는 중입니다...
          </div>
        ) : !userLocation ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            현재 위치를 확인할 수 없습니다. (위치 권한을 허용해주세요)
          </div>
        ) : (
          <div style={{ flex: 1, position: 'relative' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            
            {/* Info Overlay */}
            <div style={{ 
              position: 'absolute', bottom: '24px', left: '16px', right: '16px', 
              backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>가장 가까운 역</div>
              {nearbyStations.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', 
                    backgroundColor: linesData[nearbyStations[0].lineKey]?.color || 'gray',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 800
                  }}>
                    {linesData[nearbyStations[0].lineKey]?.shortLabel || nearbyStations[0].lineLabel}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{nearbyStations[0].name}역</div>
                  <div style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: 700, marginLeft: 'auto' }}>
                    {nearbyStations[0].distance < 1000 
                      ? `도보 약 ${Math.ceil(nearbyStations[0].distance / 67)}분` // 67m/min ~ 4km/h
                      : `${(nearbyStations[0].distance / 1000).toFixed(1)}km`}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
