import { useState } from 'react';
import ProfileHeader from '../components/home/ProfileHeader';
import FavoriteStations from '../components/home/FavoriteStations';
import BriefingCard from '../components/home/BriefingCard';
import BriefingStationSelectorBottomSheet from '../components/home/BriefingStationSelectorBottomSheet';
import SettingsModal from '../components/SettingsModal';
import { useBriefingStation } from '../hooks/useBriefingStation';
import { useGeolocation } from '../hooks/useGeolocation';
import { getUserProfile, setUserProfileName } from '../utils/profile';

import { Search } from 'lucide-react';

import RouteSearchCard from '../components/home/RouteSearchCard';
import StationSearchBottomSheet from '../components/home/StationSearchBottomSheet';
import RouteResultModal from '../components/home/RouteResultModal';
import NearbyMapModal from '../components/home/NearbyMapModal';
import { findRoute } from '../utils/routing';

import { useHomeLayout } from '../hooks/useHomeLayout';

export default function HomeView({ theme, toggleTheme, setMockIndex, onNavigateToSearch, onNavigateToMap, favorites, toggleFavorite }) {
  const { location, nearestStation, error: locationError } = useGeolocation();
  const { briefingStation, setCustomBriefingStation } = useBriefingStation();
  const { layoutOrder, setLayoutOrder } = useHomeLayout();

  const [profile, setProfile] = useState(() => getUserProfile());
  const [showSettings, setShowSettings] = useState(false);
  const [showBriefingSelector, setShowBriefingSelector] = useState(false);
  const [showNearbyMap, setShowNearbyMap] = useState(false);

  // 경로 검색용 상태 (객체 저장)
  const [routeStart, setRouteStart] = useState(null);
  const [routeEnd, setRouteEnd] = useState(null);
  
  const [isSearchingStart, setIsSearchingStart] = useState(false);
  const [isSearchingEnd, setIsSearchingEnd] = useState(false);
  const [showRouteResult, setShowRouteResult] = useState(false);
  const [routeResultData, setRouteResultData] = useState(null);

  // 시간 설정 옵션
  const [timeMode, setTimeMode] = useState('now'); // 'now', 'departure', 'arrival'
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  
  // 요일 설정 옵션
  const [dayType, setDayType] = useState(() => {
    const day = new Date().getDay();
    return (day === 0 || day === 6) ? 'weekend' : 'weekday';
  });

  const displayStation = briefingStation || nearestStation;

  const handleEditNickname = () => {
    const newName = prompt("새 닉네임을 입력하세요:", profile.name);
    if (newName && newName.trim()) {
      const updated = setUserProfileName(newName.trim());
      setProfile(updated);
    }
  };

  const handleSwapRoute = () => {
    setRouteStart(routeEnd);
    setRouteEnd(routeStart);
  };

  const handleSearchRoute = () => {
    if (!routeStart || !routeEnd) {
      alert('출발역과 도착역을 모두 설정해주세요.');
      return;
    }
    
    if (routeStart.stationName === routeEnd.stationName) {
      alert('출발역과 도착역이 같습니다.');
      return;
    }

    const route = findRoute(routeStart.stationName, routeEnd.stationName);
    if (route) {
      // 주말일 경우 임의로 소요시간 10% 증가 (모의 데이터)
      if (dayType === 'weekend') {
        route.totalTime = Math.floor(route.totalTime * 1.1);
      }
      setRouteResultData(route);
      setShowRouteResult(true);
    } else {
      alert('경로를 찾을 수 없습니다.');
    }
  };

  const handleSelectStart = () => {
    setIsSearchingStart(true);
  };

  const handleSelectEnd = () => {
    setIsSearchingEnd(true);
  };

  const isMorning = true; 

  const components = {
    route: (
      <RouteSearchCard 
        key="route"
        startStation={routeStart}
        endStation={routeEnd}
        onStartClick={handleSelectStart}
        onEndClick={handleSelectEnd}
        onSwap={handleSwapRoute}
        onSearch={handleSearchRoute}
        timeMode={timeMode}
        setTimeMode={setTimeMode}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        dayType={dayType}
        setDayType={setDayType}
      />
    ),
    briefing: (isMorning && (displayStation || locationError)) ? (
      <BriefingCard 
        key="briefing"
        nearestStation={displayStation} 
        isCustom={!!briefingStation}
        isError={!displayStation && !!locationError}
        onChangeClick={() => setShowBriefingSelector(true)}
      />
    ) : null,
    favorites: (
      <FavoriteStations 
        key="favorites"
        favorites={favorites} 
        onAddClick={() => onNavigateToMap && onNavigateToMap(null)}
        onSelectStation={(st) => onNavigateToMap && onNavigateToMap(st)}
        onRemoveFavorite={toggleFavorite}
      />
    )
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '80px' }}>
      <ProfileHeader 
        profile={profile} 
        onOpenSettings={() => setShowSettings(true)}
      />
      
      <div style={{ padding: '0 20px', marginTop: '16px' }}>
        <button 
          onClick={() => setShowNearbyMap(true)}
          style={{
            width: '100%', padding: '16px', backgroundColor: 'var(--accent)', color: 'white',
            border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '20px' }}>🗺️</span> 내 주변 역 찾기
        </button>
      </div>
      
      <div style={{ padding: '16px 20px' }}>
        {layoutOrder.map(key => components[key])}
      </div>

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
          theme={theme}
          toggleTheme={toggleTheme}
          profile={profile}
          onEditNickname={handleEditNickname}
          setMockIndex={setMockIndex}
          layoutOrder={layoutOrder}
          setLayoutOrder={setLayoutOrder}
        />
      )}

      {isSearchingStart && (
        <StationSearchBottomSheet
          isOpen={true}
          onClose={() => setIsSearchingStart(false)}
          title="출발역 검색"
          onSelectStation={(st) => {
            setRouteStart(st);
            setIsSearchingStart(false);
          }}
        />
      )}

      {isSearchingEnd && (
        <StationSearchBottomSheet
          isOpen={true}
          onClose={() => setIsSearchingEnd(false)}
          title="도착역 검색"
          onSelectStation={(st) => {
            setRouteEnd(st);
            setIsSearchingEnd(false);
          }}
        />
      )}

      {showRouteResult && routeResultData && (
        <RouteResultModal 
          isOpen={true}
          onClose={() => setShowRouteResult(false)}
          routeData={routeResultData}
          startStation={routeStart}
          endStation={routeEnd}
          timeMode={timeMode}
          selectedTime={selectedTime}
        />
      )}

      <BriefingStationSelectorBottomSheet 
        isOpen={showBriefingSelector}
        onClose={() => setShowBriefingSelector(false)}
        favorites={favorites}
        currentStation={briefingStation}
        onSelectStation={(station) => {
          setCustomBriefingStation(station);
          setShowBriefingSelector(false);
        }}
      />

      <NearbyMapModal 
        isOpen={showNearbyMap}
        onClose={() => setShowNearbyMap(false)}
        userLocation={location}
      />
    </div>
  );
}
