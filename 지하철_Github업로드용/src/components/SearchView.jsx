import { useState } from 'react';
import { Search, MapPin, Map as MapIcon, Navigation, Info, ArrowRight, Share2, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getUserProfile } from '../utils/profile';

// Leaflet 기본 마커 아이콘 설정 (리액트 환경에서 마커 이미지가 안 나오는 버그 해결)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 가상 장소 데이터 (핫플 및 인근 지하철역 매핑)
const MOCK_POIS = [
  { id: 1, name: '강남스타일 맛집', category: '맛집', address: '강남구 테헤란로 123', lat: 37.498, lng: 127.027, nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '강남', color: '#3bc44a', walkingMinutes: 3 } },
  { id: 2, name: '홍대 감성 카페', category: '카페', address: '마포구 홍익로 45', lat: 37.556, lng: 126.923, nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '홍대입구', color: '#3bc44a', walkingMinutes: 5 } },
  { id: 3, name: '성수동 브런치', category: '맛집', address: '성동구 연무장길 7', lat: 37.544, lng: 127.056, nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '성수', color: '#3bc44a', walkingMinutes: 4 } },
  { id: 4, name: '이태원 루프탑 펍', category: '술집', address: '용산구 이태원로 200', lat: 37.534, lng: 126.994, nearestStation: { lineKey: '6', lineLabel: '6호선', stationName: '이태원', color: '#c55c1d', walkingMinutes: 2 } },
  { id: 5, name: '종로 노포 식당', category: '맛집', address: '종로구 종로 100', lat: 37.570, lng: 126.990, nearestStation: { lineKey: '1', lineLabel: '1호선', stationName: '종로3가', color: '#0052a4', walkingMinutes: 1 } },
  { id: 6, name: '여의도 더현대', category: '쇼핑', address: '영등포구 여의대로 108', lat: 37.525, lng: 126.928, nearestStation: { lineKey: '5', lineLabel: '5호선', stationName: '여의나루', color: '#996cac', walkingMinutes: 6 } },
  { id: 7, name: '합정 힙한 식당', category: '맛집', address: '마포구 양화로 60', lat: 37.549, lng: 126.913, nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '합정', color: '#3bc44a', walkingMinutes: 3 } },
];

// 지도의 중심점을 마커 위치로 부드럽게 이동시키는 컴포넌트
function MapRecenter({ lat, lng }) {
  const map = useMap();
  if (lat && lng) {
    map.flyTo([lat, lng], 15, { duration: 1.5 });
  }
  return null;
}

// 지도 빈 곳 클릭 시 핀 해제
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

export default function SearchView({ onSetAlarmTarget }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(MOCK_POIS); // 처음부터 모든 마커 표시
  const [selectedPoi, setSelectedPoi] = useState(null);

  // 서울 시청 중심 좌표
  const centerPosition = [37.5665, 126.9780];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults(MOCK_POIS);
      setSelectedPoi(null);
      return;
    }

    // 모의 데이터에서 이름이나 카테고리, 주소로 필터링
    const filtered = MOCK_POIS.filter(poi => 
      poi.name.includes(query) || 
      poi.category.includes(query) || 
      poi.address.includes(query)
    );
    setResults(filtered);
    
    // 검색 결과가 있으면 첫 번째 결과를 자동으로 선택
    if (filtered.length > 0) {
      setSelectedPoi(filtered[0]);
    } else {
      setSelectedPoi(null);
    }
  };

  const handleSelectPoi = (poi) => {
    setSelectedPoi(poi);
  };

  const handleSetAlarm = () => {
    if (selectedPoi && selectedPoi.nearestStation) {
      // App.jsx의 onSetAlarmTarget 함수를 호출하여 목적지 알람을 설정
      onSetAlarmTarget('end', selectedPoi.nearestStation);
    }
  };

  const handleShare = () => {
    if (!selectedPoi) return;
    const comment = window.prompt(`[${selectedPoi.name}]을(를) 커뮤니티에 공유합니다.\n추천하는 이유를 짧게 적어주세요!`);
    
    if (comment) {
      const profile = getUserProfile();

      const newPost = {
        id: 'post-' + Date.now(),
        author: profile.name,
        avatar: profile.color,
        content: comment,
        poi: selectedPoi,
        likes: 0,
        time: '방금 전'
      };

      const saved = localStorage.getItem('community_posts');
      const posts = saved ? JSON.parse(saved) : [];
      localStorage.setItem('community_posts', JSON.stringify([newPost, ...posts]));
      
      alert(`[${profile.name}] 닉네임으로 공유되었습니다!\n하단 [커뮤니티] 탭에서 확인해 보세요.`);
    }
  };

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
            type="text" 
            placeholder="장소 검색 (예: 맛집, 홍대)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'none', outline: 'none', fontSize: '17px', color: 'var(--text-primary)', fontWeight: 500 }}
          />
          <button type="submit" style={{ background: 'var(--accent)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '10px', fontWeight: 600, fontSize: '13px' }}>
            검색
          </button>
        </form>
      </div>

      {/* 지도 영역 */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <MapContainer center={centerPosition} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {selectedPoi && <MapRecenter lat={selectedPoi.lat} lng={selectedPoi.lng} />}
          
          <MapClickHandler onMapClick={() => setSelectedPoi(null)} />

          {results.map(poi => (
            <Marker 
              key={poi.id} 
              position={[poi.lat, poi.lng]} 
              eventHandlers={{
                click: () => handleSelectPoi(poi),
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* 하단 바텀 시트 (장소 상세 및 지하철 정보) */}
      <div 
        style={{ 
          position: 'absolute', bottom: '100px', left: 0, right: 0, zIndex: 1000, 
          padding: '20px', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: selectedPoi ? 'translateY(0)' : 'translateY(150%)'
        }}
      >
        {selectedPoi && (
          <div className="glass-card" style={{ 
            padding: '24px', 
            position: 'relative'
          }}>
            {/* 닫기 버튼 */}
            <button 
              onClick={() => setSelectedPoi(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '4px' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingRight: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', backgroundColor: 'var(--accent)20', padding: '4px 8px', borderRadius: '8px', marginBottom: '8px', display: 'inline-block' }}>
                  {selectedPoi.category}
                </span>
                <h2 style={{ margin: '4px 0', fontSize: '22px', fontWeight: 800 }}>{selectedPoi.name}</h2>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  {selectedPoi.address}
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Info size={16} color="var(--text-secondary)" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>인근 가장 가까운 지하철역</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ minWidth: '32px', height: '32px', borderRadius: '16px', padding: '0 8px', backgroundColor: selectedPoi.nearestStation.color, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {selectedPoi.nearestStation.lineLabel.replace('호선', '').replace('선', '')}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>{selectedPoi.nearestStation.stationName}역</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: selectedPoi.nearestStation.color, fontWeight: 600 }}>도보 약 {selectedPoi.nearestStation.walkingMinutes}분 거리</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleShare}
                style={{
                  flex: '0 0 60px', padding: '16px 0', borderRadius: '16px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
                  border: '1px solid var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Share2 size={20} />
              </button>
              <button 
                onClick={handleSetAlarm}
                style={{
                  flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: selectedPoi.nearestStation.color, color: 'white',
                  fontWeight: 700, fontSize: '16px', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                  boxShadow: `0 4px 12px ${selectedPoi.nearestStation.color}40`
                }}
              >
                이 역으로 알람 맞추기 <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
