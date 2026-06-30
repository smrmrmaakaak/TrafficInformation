import { useState } from 'react';

const MOCK_POIS = [
  { id: 1, name: '강남스타일 맛집', category: '맛집', address: '강남구 테헤란로 123', lat: 37.498, lng: 127.027, nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '강남', color: '#3bc44a', walkingMinutes: 3 } },
  { id: 2, name: '홍대 감성 카페', category: '카페', address: '마포구 홍익로 45', lat: 37.556, lng: 126.923, nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '홍대입구', color: '#3bc44a', walkingMinutes: 5 } },
  { id: 3, name: '성수동 브런치', category: '맛집', address: '성동구 연무장길 7', lat: 37.544, lng: 127.056, nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '성수', color: '#3bc44a', walkingMinutes: 4 } },
  { id: 4, name: '이태원 루프탑 펍', category: '술집', address: '용산구 이태원로 200', lat: 37.534, lng: 126.994, nearestStation: { lineKey: '6', lineLabel: '6호선', stationName: '이태원', color: '#c55c1d', walkingMinutes: 2 } },
  { id: 5, name: '종로 노포 식당', category: '맛집', address: '종로구 종로 100', lat: 37.570, lng: 126.990, nearestStation: { lineKey: '1', lineLabel: '1호선', stationName: '종로3가', color: '#0052a4', walkingMinutes: 1 } },
  { id: 6, name: '여의도 더현대', category: '쇼핑', address: '영등포구 여의대로 108', lat: 37.525, lng: 126.928, nearestStation: { lineKey: '5', lineLabel: '5호선', stationName: '여의나루', color: '#996cac', walkingMinutes: 6 } },
  { id: 7, name: '합정 힙한 식당', category: '맛집', address: '마포구 양화로 60', lat: 37.549, lng: 126.913, nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '합정', color: '#3bc44a', walkingMinutes: 3 } },
];

export function usePoiSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(MOCK_POIS);
  const [selectedPoi, setSelectedPoi] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults(MOCK_POIS);
      setSelectedPoi(null);
      return;
    }

    const filtered = MOCK_POIS.filter(poi => 
      poi.name.includes(query) || 
      poi.category.includes(query) || 
      poi.address.includes(query)
    );
    setResults(filtered);
    
    if (filtered.length > 0) {
      setSelectedPoi(filtered[0]);
    } else {
      setSelectedPoi(null);
    }
  };

  const handleSelectPoi = (poi) => setSelectedPoi(poi);
  const clearSelection = () => setSelectedPoi(null);

  const handleMapClick = (e) => {
    // If it's a Leaflet event, it has e.latlng. Otherwise fallback to e itself if it's already latlng.
    const latlng = e.latlng || e;
    if (!latlng || !latlng.lat) return;

    const customPoi = {
      id: 'custom-' + Date.now(),
      name: '선택한 위치',
      category: '주변 탐색',
      address: '지도에서 선택한 위치',
      lat: latlng.lat,
      lng: latlng.lng,
      nearestStation: { lineKey: '2', lineLabel: '2호선', stationName: '강남', color: '#3bc44a', walkingMinutes: Math.floor(Math.random() * 10) + 1 },
      isCustom: true,
      nearbyPlaces: [
        { name: '근처 유명한 맛집', type: '맛집', distance: '120m' },
        { name: '분위기 좋은 카페', type: '카페', distance: '250m' },
        { name: '동네 빵집', type: '베이커리', distance: '400m' }
      ]
    };
    setSelectedPoi(customPoi);
  };

  return {
    query,
    setQuery,
    results,
    selectedPoi,
    handleSearch,
    handleSelectPoi,
    clearSelection,
    handleMapClick,
  };
}
