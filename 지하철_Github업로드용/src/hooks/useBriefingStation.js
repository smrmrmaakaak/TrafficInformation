import { useState, useEffect } from 'react';

const BRIEFING_KEY = 'subway_briefing_station';

export function useBriefingStation() {
  const [briefingStation, setBriefingStation] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(BRIEFING_KEY);
    if (saved) {
      try {
        setBriefingStation(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse briefing station from local storage');
      }
    }
  }, []);

  const setCustomBriefingStation = (station) => {
    setBriefingStation(station);
    if (station) {
      localStorage.setItem(BRIEFING_KEY, JSON.stringify(station));
    } else {
      localStorage.removeItem(BRIEFING_KEY);
    }
  };

  return { briefingStation, setCustomBriefingStation };
}
