import { useState, useCallback } from 'react';

export function useArrivalData() {
  const [arrivalData, setArrivalData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getCarCount = (lineKey) => {
    switch(lineKey) {
      case '1': case '2': case '3': case '4': return 10;
      case '5': case '6': case '7': case 'gyeongui': case 'incheon1': return 8;
      case '8': case '9': case 'shin': case 'suin': case 'airport': return 6;
      case 'incheon2': return 2;
      default: return 10;
    }
  };

  const generateMockArrivalData = useCallback((station) => {
    if (!station) {
      setArrivalData(null);
      return;
    }
    
    setIsRefreshing(true);
    
    setTimeout(() => {
      const carCount = getCarCount(station.lineKey);
      const randomMinutes1 = Math.floor(Math.random() * 5) + 1;
      const randomMinutes2 = Math.floor(Math.random() * 8) + 3;
      
      const generateCongestions = () => Array.from({ length: carCount }, () => {
        const r = Math.random();
        if (r > 0.7) return 'high';
        if (r > 0.4) return 'mid';
        return 'low';
      });

      const findRecommendedCars = (congestions) => {
        const best = [];
        congestions.forEach((c, idx) => {
          if (c === 'low') best.push(idx + 1);
        });
        if (best.length === 0) {
           congestions.forEach((c, idx) => {
             if (c === 'mid') best.push(idx + 1);
           });
        }
        return best.slice(0, 2).join(', ') + '번 칸';
      };

      const upCongestions = generateCongestions();
      const downCongestions = generateCongestions();

      const mockData = {
        upbound: {
          destination: '상행/내선 방향',
          status: randomMinutes1 === 1 ? '전역 출발' : `${randomMinutes1 + 1} 정거장 전`,
          minutes: randomMinutes1,
          congestions: upCongestions,
          recommended: findRecommendedCars(upCongestions)
        },
        downbound: {
          destination: '하행/외선 방향',
          status: randomMinutes2 === 1 ? '전역 출발' : `${randomMinutes2 + 1} 정거장 전`,
          minutes: randomMinutes2,
          congestions: downCongestions,
          recommended: findRecommendedCars(downCongestions)
        }
      };
      
      setArrivalData(mockData);
      setIsRefreshing(false);
    }, 600);
  }, []);

  const clearArrivalData = useCallback(() => {
    setArrivalData(null);
  }, []);

  return {
    arrivalData,
    isRefreshing,
    generateMockArrivalData,
    clearArrivalData,
  };
}
