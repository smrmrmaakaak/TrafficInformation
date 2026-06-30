import { Search } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { usePoiSearch } from '../hooks/usePoiSearch';
import PoiBottomSheet from '../components/search/PoiBottomSheet';
import useNaverMap from '../hooks/useNaverMap';

export default function SearchView({ onSetAlarmTarget, searchInputRef, isActive }) {
  const {
    query, setQuery, results, selectedPoi, handleSearch, handleSelectPoi, clearSelection, handleMapClick
  } = usePoiSearch();

  const { isLoaded, error } = useNaverMap();

  // If searchInputRef is not provided from parent, fallback to local ref (just in case)
  const localInputRef = useRef(null);
  const inputRef = searchInputRef || localInputRef;

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // 서울 시청 중심 좌표
  const centerPosition = { lat: 37.5665, lng: 126.9780 };

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !window.naver || !window.naver.maps || !mapRef.current) return;

    // 이미 생성된 맵 인스턴스가 있다면 리턴
    if (mapInstance.current) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(centerPosition.lat, centerPosition.lng),
      zoom: 13,
      zoomControl: false,
    });
    mapInstance.current = map;

    // 지도 빈 곳 클릭 시 핀 해제 및 커스텀 핀 추가
    let clickListener = null;
    if (window.naver.maps.Event) {
      clickListener = window.naver.maps.Event.addListener(map, 'click', (e) => {
        handleMapClick({ lat: e.coord.y, lng: e.coord.x });
      });
    }

    return () => {
      if (clickListener && window.naver && window.naver.maps && window.naver.maps.Event) {
        window.naver.maps.Event.removeListener(clickListener);
      }
      try {
        if (mapInstance.current) {
          mapInstance.current.destroy();
        }
      } catch (e) {
        console.error('Naver Map destroy error:', e);
      }
      mapInstance.current = null;
    };
  }, [isLoaded]); // isActive 제거: 탭 이동 시 지도를 파괴하지 않도록 함

  // 탭이 다시 활성화될 때 지도 크기 재계산 (display: none에서 block으로 바뀔 때 깨짐 방지)
  useEffect(() => {
    if (isActive && mapInstance.current) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }, [isActive]);

  // 마커 업데이트 로직
  useEffect(() => {
    if (!mapInstance.current || !window.naver || !window.naver.maps) return;

    // 기존 마커 모두 제거 함수
    const clearMarkers = () => {
      markersRef.current.forEach(marker => {
        if (window.naver && window.naver.maps && window.naver.maps.Event) {
          window.naver.maps.Event.clearListeners(marker, 'click');
        }
        marker.setMap(null);
      });
      markersRef.current = [];
    };

    clearMarkers();

    // 검색 결과(results) 마커 추가
    results.forEach(poi => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(poi.lat, poi.lng),
        map: mapInstance.current,
        icon: {
          content: `<div style="background-color: var(--accent); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
          anchor: new window.naver.maps.Point(12, 12),
        }
      });
      
      window.naver.maps.Event.addListener(marker, 'click', () => {
        handleSelectPoi(poi);
      });
      
      markersRef.current.push(marker);
    });

    // 사용자가 지도 빈 곳을 클릭하여 생성한 커스텀 마커 추가
    if (selectedPoi && selectedPoi.isCustom) {
      const customMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(selectedPoi.lat, selectedPoi.lng),
        map: mapInstance.current,
        icon: {
          content: `<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
          anchor: new window.naver.maps.Point(12, 12),
        }
      });
      markersRef.current.push(customMarker);
    }

    return () => {
      clearMarkers();
    };
  }, [results, selectedPoi, handleSelectPoi]);

  // selectedPoi 변경 시 지도를 부드럽게 이동시킴
  useEffect(() => {
    if (mapInstance.current && selectedPoi && window.naver) {
      mapInstance.current.morph(new window.naver.maps.LatLng(selectedPoi.lat, selectedPoi.lng), 15, { duration: 500 });
    }
  }, [selectedPoi]);

  return (
    <div className="animate-fade-in" style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* 상단 검색바 플로팅 UI */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', zIndex: 1000 }}>
        <form 
          onSubmit={handleSearch}
          className="glass-card"
          style={{ 
          display: 'flex', alignItems: 'center', 
          padding: '14px 16px', 
        }}>
          <Search size={22} color="var(--text-secondary)" style={{ marginRight: '10px' }} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="장소 검색 (예: 맛집, 홍대)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'none', outline: 'none', fontSize: '17px', color: 'var(--text-primary)', fontWeight: 500 }}
          />
          <button type="submit" style={{ background: 'var(--accent)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            검색
          </button>
        </form>
      </div>

      {/* 지도 영역 */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1, display: isActive ? 'block' : 'none' }}>
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </div>

      {/* 하단 바텀 시트 (장소 상세 및 지하철 정보) */}
      <PoiBottomSheet 
        selectedPoi={selectedPoi} 
        clearSelection={clearSelection} 
        onSetAlarmTarget={onSetAlarmTarget} 
      />
    </div>
  );
}
