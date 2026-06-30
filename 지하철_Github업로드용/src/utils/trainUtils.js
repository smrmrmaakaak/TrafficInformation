/**
 * 지하철 노선명(예: "8호선", "수인분당선")을 받아 해당 노선의 열차 칸 수를 반환합니다.
 * @param {string} lineStr - 노선 이름
 * @returns {number} 열차 칸 수
 */
export const getCarCountByLine = (lineStr) => {
  const line = lineStr || '';
  if (line.includes('8') || line.includes('9') || line.includes('수인분당')) return 6;
  if (line.includes('5') || line.includes('6') || line.includes('7')) return 8;
  return 10;
};

/**
 * 실시간 공공 API 혼잡도 정보가 없을 때 사용할 가상 혼잡도 배열을 생성합니다.
 * @param {number} numCars - 열차 칸 수
 * @returns {string[]} 'low', 'mid', 'high' 문자열로 이루어진 배열
 */
export const generateMockCongestion = (numCars) => {
  const hour = new Date().getHours();
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);

  return Array(numCars).fill(0).map(() => {
    if (isRushHour) return Math.random() > 0.3 ? 'high' : 'mid';
    return Math.random() > 0.8 ? 'mid' : 'low';
  });
};

/**
 * 역 이름에서 괄호 등 불필요한 문자를 제거하고 API 조회용 이름으로 보정합니다.
 * @param {string} rawName - 원본 역 이름
 * @returns {string} 보정된 역 이름
 */
export const normalizeStationName = (rawName) => {
  let stationName = rawName;
  if (stationName === '서울역') stationName = '서울';
  if (stationName.includes('(')) stationName = stationName.split('(')[0];
  return stationName;
};

/**
 * "XX분 XX초 후" 같은 메시지에서 "XX분 후 도착"으로 변환합니다.
 * @param {string} rawMsg - 원본 메시지
 * @returns {string} 간략화된 메시지
 */
export const parseArrivalMsg = (rawMsg) => {
  if (!rawMsg) return '정보 없음';
  if (rawMsg.includes('초 후')) {
    const minMatch = rawMsg.match(/(\d+)분/);
    if (minMatch) {
      return `${minMatch[1]}분 후 도착`;
    }
  }
  return rawMsg;
};

/**
 * 실시간 도착 메시지에서 남은 시간(분)을 숫자로 추출합니다.
 * @param {string} rawMsg 
 * @returns {number|null} 남은 분 (숫자)
 */
export const parseEtaMinutes = (rawMsg) => {
  if (!rawMsg) return null;
  const minMatch = rawMsg.match(/(\d+)분/);
  if (minMatch) {
    return parseInt(minMatch[1], 10);
  }
  if (rawMsg.includes('곧 도착') || rawMsg.includes('전역 출발') || rawMsg.includes('전역 진입') || rawMsg.includes('전역 도착')) {
    return 1;
  }
  return null;
};

/**
 * 특정 역과 특정 시간에 대한 가상의 배차 간격을 생성합니다.
 * @param {string} stationName - 역 이름
 * @param {string} selectedTime - 선택된 시간 (HH:MM)
 * @returns {string} 가상 예상 도착 시간 메시지
 */
export const generateMockArrivalTime = (stationName, selectedTime) => {
  let hash = 0;
  const seed = stationName + selectedTime;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const mockMin = (Math.abs(hash) % 7) + 2; // 2~8분
  return `약 ${mockMin}분 후 도착`;
};
