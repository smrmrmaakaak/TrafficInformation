import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Map, MapPin, Search, Bell, Users, Settings2 } from 'lucide-react';
import HomeView from './views/HomeView';
import MapView from './views/MapView';
import AlarmView from './views/AlarmView';
import SearchView from './views/SearchView';
import CommunityView from './views/CommunityView';
import { useTheme } from './hooks/useTheme';
import { useGeolocation, DEMO_STATION_COORDS } from './hooks/useGeolocation';
import { useFavorites } from './hooks/useFavorites';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showMockSelector, setShowMockSelector] = useState(false);
  const searchInputRef = useRef(null);

  const handleTabClick = (tab) => {
    flushSync(() => {
      setActiveTab(tab);
    });
    
    if (tab === 'search' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // 노선도 -> 알람 연동 전역 상태
  const [alarmStartTarget, setAlarmStartTarget] = useState(null);
  const [alarmEndTarget, setAlarmEndTarget] = useState(null);
  
  // 즐겨찾기 -> 노선도 연동 전역 상태
  const [initialMapStation, setInitialMapStation] = useState(null);

  // GPS 위치 정보 가져오기
  const { nearestStation, setMockIndex } = useGeolocation();

  // 테마 상태 관리 (GPS 기반 다이내믹 컬러 연동)
  const { theme, toggleTheme } = useTheme(nearestStation?.lineColor);

  // 즐겨찾기 전역 상태
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const handleSetAlarmTarget = (type, stationObj) => {
    if (type === 'start') {
      setAlarmStartTarget(stationObj);
    } else {
      setAlarmEndTarget(stationObj);
    }
    setActiveTab('alarm');
  };

  const handleNavigateToMap = (station) => {
    setInitialMapStation(station);
    setActiveTab('map');
  };

  return (
    <>
      <main id="main-scroll-container" style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px', transition: 'background-color 0.5s', scrollbarGutter: 'stable' }}>
        {activeTab === 'home' && (
          <HomeView 
            theme={theme} 
            toggleTheme={toggleTheme} 
            setMockIndex={setMockIndex} 
            onNavigateToSearch={() => handleTabClick('search')}
            onNavigateToMap={handleNavigateToMap}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
        {activeTab === 'map' && (
          <MapView 
            onSetAlarmTarget={handleSetAlarmTarget} 
            initialStation={initialMapStation}
            clearInitialStation={() => setInitialMapStation(null)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}
        <div style={{ display: activeTab === 'search' ? 'block' : 'none', height: '100%' }}>
          <SearchView onSetAlarmTarget={handleSetAlarmTarget} searchInputRef={searchInputRef} isActive={activeTab === 'search'} />
        </div>
        {activeTab === 'community' && <CommunityView onSetAlarmTarget={handleSetAlarmTarget} />}
        {activeTab === 'alarm' && (
          <AlarmView 
            initialStart={alarmStartTarget} 
            initialEnd={alarmEndTarget} 
            clearInitialStart={() => setAlarmStartTarget(null)}
            clearInitialEnd={() => setAlarmEndTarget(null)}
          />
        )}
      </main>

      <nav className="glass-nav" style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '440px',
        borderRadius: '24px',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        zIndex: 100,
        boxShadow: 'var(--glass-shadow)',
        transition: 'background-color 0.5s'
      }}>
        <NavItem 
          icon={<MapPin size={24} />} 
          label="홈" 
          isActive={activeTab === 'home'} 
          onClick={() => handleTabClick('home')} 
        />
        <NavItem 
          icon={<Map size={24} />} 
          label="노선도" 
          isActive={activeTab === 'map'} 
          onClick={() => handleTabClick('map')} 
        />
        <NavItem 
          icon={<Search size={24} />} 
          label="검색" 
          isActive={activeTab === 'search'} 
          onClick={() => handleTabClick('search')} 
        />
        <NavItem 
          icon={<Users size={24} />} 
          label="커뮤니티" 
          isActive={activeTab === 'community'} 
          onClick={() => handleTabClick('community')} 
        />
        <NavItem 
          icon={<Bell size={24} />} 
          label="알람" 
          isActive={activeTab === 'alarm'} 
          onClick={() => handleTabClick('alarm')} 
        />
      </nav>
    </>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
        transition: 'color 0.3s ease',
      }}
    >
      {icon}
      <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 400 }}>{label}</span>
    </button>
  );
}

export default App;
