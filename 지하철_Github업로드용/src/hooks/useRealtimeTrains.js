import { useState, useEffect } from 'react';
import { linesData } from '../data/stations';

export function useRealtimeTrains(currentLineKey, layoutStations) {
  const [trains, setTrains] = useState([]);
  const currentLine = linesData[currentLineKey];

  useEffect(() => {
    if (!currentLine || !layoutStations) return;

    const fetchRealtimeTrains = async () => {
      try {
        const apiKey = import.meta.env.VITE_SEOUL_API_KEY || 'sample';
        let lineName = currentLine.label; // 예: '1호선', '수인분당선'
        if (lineName.includes('(')) {
          lineName = lineName.split('(')[0]; // '1호선(신창)' -> '1호선'
        }
        
        // 샘플 키는 한 번에 5개까지만 조회 가능, 정식 키는 100개까지 조회
        const endIndex = apiKey === 'sample' ? 5 : 100;
        const url = `/api/subway/${apiKey}/json/realtimePosition/0/${endIndex}/${encodeURIComponent(lineName)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.realtimePositionList) {
          const newTrains = data.realtimePositionList.map((train, index) => {
            // 역 이름 매칭
            let statnNm = train.statnNm;
            if (statnNm === '서울') statnNm = '서울역';
            if (statnNm === '총신대입구(이수)') statnNm = '총신대입구(이수)';
            
            const stNode = layoutStations.find(s => 
              s.name === statnNm || s.name.includes(statnNm) || statnNm.includes(s.name)
            );
            
            if (!stNode) return null; // 지도(통합 레이아웃)에 없는 역이면 무시
            
            // updnLine: '0'(상행/내선), '1'(하행/외선)
            const direction = train.updnLine === '1' ? 'down' : 'up';
            // trainSttus: '0'(진입), '1'(도착), '2'(출발)
            const progress = train.trainSttus === '2' ? 0.5 : 0;
            
            return {
              id: `${train.trainNo}-${index}`,
              direction,
              x: stNode.x,
              y: stNode.y,
              progress
            };
          }).filter(Boolean);
          
          setTrains(newTrains);
        } else {
          setTrains([]);
        }
      } catch (error) {
        console.error("Failed to fetch train positions", error);
      }
    };

    fetchRealtimeTrains();
    const interval = setInterval(fetchRealtimeTrains, 15000);
    return () => clearInterval(interval);
  }, [currentLine, layoutStations]);

  return { trains };
}
