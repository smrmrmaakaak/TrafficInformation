import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'subway_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites from local storage');
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const isFavorite = (station) => {
    return favorites.some(
      (f) => f.stationName === station.stationName && f.lineKey === station.lineKey
    );
  };

  const addFavorite = (station) => {
    if (!isFavorite(station)) {
      setFavorites([...favorites, station]);
    }
  };

  const removeFavorite = (station) => {
    setFavorites(
      favorites.filter(
        (f) => !(f.stationName === station.stationName && f.lineKey === station.lineKey)
      )
    );
  };

  const toggleFavorite = (station) => {
    if (isFavorite(station)) {
      removeFavorite(station);
    } else {
      addFavorite(station);
    }
  };

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
