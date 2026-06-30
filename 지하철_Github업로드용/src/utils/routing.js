import { linesData } from '../data/stations';

// 그래프를 한 번만 생성하여 캐싱
let graph = null;

function buildGraph() {
  const g = {};
  const stationsByName = {};

  // 노드 및 동일 노선 내의 엣지 추가
  Object.keys(linesData).forEach(lineKey => {
    const stations = linesData[lineKey].stations;
    stations.forEach((st, idx) => {
      const nodeId = `${st.name}-${lineKey}`;
      if (!g[nodeId]) {
        g[nodeId] = { id: nodeId, name: st.name, lineKey: lineKey, edges: {} };
      }
      
      if (!stationsByName[st.name]) {
        stationsByName[st.name] = [];
      }
      stationsByName[st.name].push(nodeId);

      // 인접역 연결 (가중치 2분)
      if (idx > 0) {
        const prevId = `${stations[idx - 1].name}-${lineKey}`;
        g[nodeId].edges[prevId] = 2;
        g[prevId].edges[nodeId] = 2;
      }
    });
  });

  // 환승역 연결 (가중치 5분)
  Object.keys(stationsByName).forEach(name => {
    const nodeIds = stationsByName[name];
    if (nodeIds.length > 1) {
      for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
          g[nodeIds[i]].edges[nodeIds[j]] = 5;
          g[nodeIds[j]].edges[nodeIds[i]] = 5;
        }
      }
    }
  });

  return g;
}

export function findRoute(startStationName, endStationName) {
  if (!graph) graph = buildGraph();

  // 모든 노드 초기화
  const dist = {};
  const prev = {};
  const unvisited = new Set();

  Object.keys(graph).forEach(nodeId => {
    dist[nodeId] = Infinity;
    prev[nodeId] = null;
    unvisited.add(nodeId);
  });

  // 시작 역들에 거리 0 할당
  const startNodes = Object.keys(graph).filter(id => graph[id].name === startStationName);
  const endNodes = Object.keys(graph).filter(id => graph[id].name === endStationName);

  if (startNodes.length === 0 || endNodes.length === 0) {
    return null; // 역을 찾을 수 없음
  }

  startNodes.forEach(id => {
    dist[id] = 0;
  });

  // 다익스트라 (간단한 구현 - 우선순위 큐 없이 O(V^2))
  while (unvisited.size > 0) {
    let u = null;
    let minD = Infinity;

    unvisited.forEach(nodeId => {
      if (dist[nodeId] < minD) {
        minD = dist[nodeId];
        u = nodeId;
      }
    });

    if (u === null || minD === Infinity) break; // 더 이상 도달할 수 있는 노드가 없음
    if (endNodes.includes(u)) break; // 최단 도착지에 도달함

    unvisited.delete(u);

    const neighbors = graph[u].edges;
    Object.keys(neighbors).forEach(v => {
      if (unvisited.has(v)) {
        const alt = dist[u] + neighbors[v];
        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
        }
      }
    });
  }

  // 도착지들 중 가장 짧은 거리 찾기
  let bestEndNode = null;
  let minTotalTime = Infinity;
  endNodes.forEach(id => {
    if (dist[id] < minTotalTime) {
      minTotalTime = dist[id];
      bestEndNode = id;
    }
  });

  if (!bestEndNode || minTotalTime === Infinity) {
    return null; // 경로가 없음
  }

  // 경로 재구성
  const path = [];
  let curr = bestEndNode;
  while (curr !== null) {
    path.unshift(curr);
    curr = prev[curr];
  }

  // 결과 객체 만들기
  const routeSteps = [];
  let transferCount = 0;
  
  for (let i = 0; i < path.length; i++) {
    const node = graph[path[i]];
    const lineInfo = linesData[node.lineKey];
    
    // 이전 노드와 같은 역인데 노선이 다르면 환승
    if (i > 0 && graph[path[i-1]].name === node.name && graph[path[i-1]].lineKey !== node.lineKey) {
      transferCount++;
      routeSteps.push({
        type: 'transfer',
        stationName: node.name,
        fromLine: linesData[graph[path[i-1]].lineKey].label,
        toLine: lineInfo.label,
        time: 5,
        lineColor: lineInfo.color
      });
    } else {
      routeSteps.push({
        type: 'station',
        stationName: node.name,
        lineKey: node.lineKey,
        lineLabel: lineInfo.label,
        lineColor: lineInfo.color
      });
    }
  }

  // 더 읽기 쉬운 타임라인 형태로 요약
  const timeline = [];
  let currentSegment = {
    lineLabel: routeSteps[0].lineLabel,
    lineKey: routeSteps[0].lineKey,
    lineColor: routeSteps[0].lineColor,
    stations: [routeSteps[0].stationName],
    time: 0
  };

  for (let i = 1; i < routeSteps.length; i++) {
    const step = routeSteps[i];
    if (step.type === 'transfer') {
      timeline.push(currentSegment);
      timeline.push({ type: 'transfer_walk', time: step.time, stationName: step.stationName });
      currentSegment = {
        lineLabel: step.toLine,
        lineKey: routeSteps[i+1] ? routeSteps[i+1].lineKey : step.toLine, // transfer next node's lineKey
        lineColor: step.lineColor,
        stations: [step.stationName],
        time: 0
      };
    } else {
      if (!currentSegment.lineKey) currentSegment.lineKey = step.lineKey;
      currentSegment.stations.push(step.stationName);
      currentSegment.time += 2;
    }
  }
  timeline.push(currentSegment);

  // 방향(방면) 계산
  timeline.forEach(seg => {
    if (seg.type !== 'transfer_walk' && seg.stations.length > 1 && seg.lineKey && linesData[seg.lineKey]) {
      const lineStations = linesData[seg.lineKey].stations;
      const idx1 = lineStations.findIndex(s => s.name === seg.stations[0]);
      const idx2 = lineStations.findIndex(s => s.name === seg.stations[1]);
      if (idx1 !== -1 && idx2 !== -1) {
        if (idx1 < idx2) {
          seg.boundFor = lineStations[lineStations.length - 1].name;
        } else {
          seg.boundFor = lineStations[0].name;
        }
      }
    }
  });

  return {
    totalTime: minTotalTime,
    transferCount,
    timeline
  };
}
