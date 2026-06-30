import { linesData } from '../data/stations';

// 그래프 생성 함수
function buildGraph() {
  const graph = {};

  // 1. 호선 내 역 연결 (1역당 2분 소요)
  Object.keys(linesData).forEach(lineKey => {
    const stations = linesData[lineKey].stations;
    for (let i = 0; i < stations.length; i++) {
      const currentStation = stations[i].name;
      const nodeId = `${lineKey}_${currentStation}`;
      
      if (!graph[nodeId]) graph[nodeId] = [];

      // 다음 역
      if (i < stations.length - 1) {
        const nextStation = stations[i + 1].name;
        const weight = lineKey.includes('-express') ? 3 : 2;
        graph[nodeId].push({ target: `${lineKey}_${nextStation}`, weight, type: 'move' });
      }
      // 이전 역
      if (i > 0) {
        const prevStation = stations[i - 1].name;
        const weight = lineKey.includes('-express') ? 3 : 2;
        graph[nodeId].push({ target: `${lineKey}_${prevStation}`, weight, type: 'move' });
      }
    }
  });

  // 2. 환승역 연결 (이름이 같은 역들끼리, 환승 페널티 5분)
  const stationNameToLines = {};
  
  Object.keys(linesData).forEach(lineKey => {
    linesData[lineKey].stations.forEach(st => {
      if (!stationNameToLines[st.name]) {
        stationNameToLines[st.name] = [];
      }
      stationNameToLines[st.name].push(lineKey);
    });
  });

  // 이름이 같은 역이 여러 호선에 존재하면 환승 간선 추가
  Object.keys(stationNameToLines).forEach(stationName => {
    const lines = stationNameToLines[stationName];
    if (lines.length > 1) {
      for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines.length; j++) {
          if (i !== j) {
            const fromNode = `${lines[i]}_${stationName}`;
            const toNode = `${lines[j]}_${stationName}`;
            
            let weight = 5;
            
            const isSameLineGroup = (l1, l2) => {
              if (l1.startsWith('1') && l2.startsWith('1') && !l1.includes('incheon') && !l2.includes('incheon')) return true;
              if (l1.startsWith('4') && l2.startsWith('4')) return true;
              if (l1.startsWith('9') && l2.startsWith('9')) return true;
              if (l1.startsWith('suin') && l2.startsWith('suin')) return true;
              if (l1.startsWith('gyeongui') && l2.startsWith('gyeongui')) return true;
              return false;
            };

            // 본선-지선-급행 간 이동은 동일 승강장(또는 바로 옆)이므로 페널티 0분
            if (isSameLineGroup(lines[i], lines[j])) {
              weight = 0;
            }
            
            graph[fromNode].push({ target: toNode, weight: weight, type: 'transfer' });
          }
        }
      }
    }
  });

  return graph;
}

const subwayGraph = buildGraph();

// 다익스트라 최단 경로 탐색 알고리즘
export function findShortestPath(startLine, startStation, endLine, endStation) {
  const startNode = `${startLine}_${startStation}`;
  const endNode = `${endLine}_${endStation}`;

  if (!subwayGraph[startNode] || !subwayGraph[endNode]) {
    return null;
  }

  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(subwayGraph));

  // 초기화
  Object.keys(subwayGraph).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[startNode] = 0;

  while (unvisited.size > 0) {
    // 가장 가까운 노드 찾기
    let currentNode = null;
    let minDistance = Infinity;
    unvisited.forEach(node => {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        currentNode = node;
      }
    });

    if (currentNode === null || distances[currentNode] === Infinity) {
      break; // 갈 수 있는 경로 없음
    }

    if (currentNode === endNode) {
      break; // 목적지 도착
    }

    unvisited.delete(currentNode);

    // 이웃 노드 업데이트
    subwayGraph[currentNode].forEach(neighbor => {
      if (unvisited.has(neighbor.target)) {
        const newDist = distances[currentNode] + neighbor.weight;
        if (newDist < distances[neighbor.target]) {
          distances[neighbor.target] = newDist;
          previous[neighbor.target] = { node: currentNode, type: neighbor.type };
        }
      }
    });
  }

  // 경로 추적
  const path = [];
  let curr = endNode;
  
  if (previous[curr] !== undefined || curr === startNode) {
    while (curr !== null) {
      const line = curr.split('_')[0];
      const station = curr.split('_')[1];
      const prevData = previous[curr];
      
      path.unshift({
        lineKey: line,
        stationName: station,
        lineName: linesData[line].label,
        type: prevData ? prevData.type : 'start'
      });
      
      curr = prevData ? prevData.node : null;
    }
  }

  // 경로 최적화: 출발역에서 바로 환승하는 경우 (예: 9호선 선택 후 9호선 급행으로 바로 환승), 사실상 처음부터 해당 노선 탑승과 동일
  while (path.length >= 2 && path[1].type === 'transfer' && path[0].stationName === path[1].stationName) {
    path[0].lineKey = path[1].lineKey;
    path[0].lineName = path[1].lineName;
    path.splice(1, 1);
  }

  // 경로 최적화: 도착역에서 바로 환승하는 경우 (예: 9호선 급행 하차 후 9호선으로 환승하여 종료), 하차 직전 불필요한 환승 제거
  while (path.length >= 2 && path[path.length - 1].type === 'transfer' && path[path.length - 2].stationName === path[path.length - 1].stationName) {
    path.pop();
  }

  // 환승 요약 정보 생성
  const transfers = path.filter(p => p.type === 'transfer').map(p => {
    // 임의의 빠른 환승 위치 생성 (역 이름 기반 해시)
    let hash = 0;
    for (let i = 0; i < p.stationName.length; i++) {
      hash = p.stationName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const escCar = Math.abs(hash % 10) + 1;
    const escDoor = Math.abs((hash * 3) % 4) + 1;
    const evCar = Math.abs((hash * 7) % 10) + 1;
    const evDoor = Math.abs((hash * 11) % 4) + 1;

    const targetStation = linesData[p.lineKey].stations.find(s => s.name === p.stationName);
    const restroom = targetStation ? targetStation.restroom : 'unknown';

    return {
      station: p.stationName,
      toLine: p.lineName,
      toColor: linesData[p.lineKey].color,
      restroom: restroom,
      fastTransfer: {
        escalator: `${escCar}-${escDoor}`,
        elevator: `${evCar}-${evDoor}`
      }
    };
  });

  return {
    path,
    transfers,
    totalTime: distances[endNode], // 분 단위
    startStation,
    endStation,
    startLineName: linesData[startLine].label,
    endLineName: linesData[endLine].label
  };
}
