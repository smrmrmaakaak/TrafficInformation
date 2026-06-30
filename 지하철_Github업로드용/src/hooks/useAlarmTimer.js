import { useState, useEffect } from 'react';

// 두 위경도 사이의 거리를 계산하는 하버사인 공식 (m 단위)
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

const DEST_COORDS = {
  '강남': { lat: 37.4979, lng: 127.0276 },
  '홍대입구': { lat: 37.5568, lng: 126.9237 },
  '서울역': { lat: 37.5559, lng: 126.9723 },
  '여의도': { lat: 37.5215, lng: 126.9243 },
};

export function useAlarmTimer(location) {
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showExitGuide, setShowExitGuide] = useState(false);

  useEffect(() => {
    if (!activeAlarm) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((activeAlarm.arrivalTime - now) / 1000);
      
      if (diff <= 0) {
        setRemainingSeconds(0);
        setActiveAlarm(null);
        clearInterval(interval);
        return;
      }

      setRemainingSeconds(diff);

      if (diff <= 120 && !activeAlarm.timeTriggered) {
        triggerNotification();
        setActiveAlarm(prev => ({ ...prev, timeTriggered: true }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAlarm]);

  useEffect(() => {
    if (!activeAlarm || !location) return;

    const destName = activeAlarm.pathData.endStation;
    const destCoords = DEST_COORDS[destName];

    if (destCoords && !activeAlarm.gpsTriggered) {
      const dist = getDistanceFromLatLonInM(location.lat, location.lng, destCoords.lat, destCoords.lng);
      
      if (dist <= 500) {
        setShowExitGuide(true);
        setActiveAlarm(prev => ({ ...prev, gpsTriggered: true }));
        
        if (!activeAlarm.timeTriggered) {
          triggerNotification();
          setActiveAlarm(prev => ({ ...prev, timeTriggered: true }));
        }
      }
    }
  }, [activeAlarm, location]);

  const triggerNotification = () => {
    setShowPopup(true);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("지하철 하차 알리미 🚇", {
        body: `${activeAlarm.pathData.endStation}역 도착 2분 전이거나 인접했습니다! 하차를 준비해 주세요.`,
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
    }
  };

  const startAlarm = (pathData) => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    } else if ("Notification" in window && Notification.permission === "denied") {
      alert("브라우저 알림 권한이 차단되어 있습니다. 설정에서 알림을 허용해 주셔야 백그라운드에서 알림을 받을 수 있습니다.");
    }

    const arrivalTime = Date.now() + pathData.totalTime * 60 * 1000; 
    
    setActiveAlarm({
      pathData,
      arrivalTime,
      timeTriggered: false,
      gpsTriggered: false
    });
  };

  const cancelAlarm = () => setActiveAlarm(null);
  const closePopup = () => setShowPopup(false);
  const closeExitGuide = () => setShowExitGuide(false);

  // 테스트 전용 헬퍼
  const forceShowExitGuide = () => {
    setShowExitGuide(true);
    triggerNotification();
  };

  return {
    activeAlarm,
    remainingSeconds,
    showPopup,
    showExitGuide,
    startAlarm,
    cancelAlarm,
    closePopup,
    closeExitGuide,
    forceShowExitGuide
  };
}
