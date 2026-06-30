import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module 환경에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '7046594c62726c6131376465414b69';
const URL = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/StationAdresTelno/1/1000/`;

async function fetchPhoneData() {
  console.log(`📡 공공데이터 포털에 역사 전화번호 정보를 요청 중입니다...`);
  
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.RESULT && data.RESULT.CODE === 'ERROR-500') {
      console.error('❌ 서버 오류 (ERROR-500): 발급받은 인증키가 아직 서버에 동기화되지 않았거나 서버 점검 중입니다.');
      return;
    }

    if (!data.StationAdresTelno || !data.StationAdresTelno.row) {
      console.error('❌ 데이터를 찾을 수 없습니다:', data);
      return;
    }

    const rows = data.StationAdresTelno.row;
    console.log(`✅ 총 ${rows.length}개의 전화번호 데이터를 성공적으로 가져왔습니다.`);

    const phoneMapping = {};
    
    rows.forEach(row => {
      let stationName = row.SBWY_STNS_NM;
      if (stationName === '서울') stationName = '서울역';
      if (stationName.includes('(')) stationName = stationName.split('(')[0];
      
      let lineName = row.SBWY_ROUT_LN; // "1호선", "2호선" 등
      const phone = row.TELNO; 
      
      if (stationName && phone && lineName) {
        phoneMapping[`${stationName}_${lineName}`] = phone;
        // 하위 호환성을 위해 역 이름만으로도 첫 번째 발견된 번호를 저장 (단, 이미 저장된게 없을 때만)
        if (!phoneMapping[stationName]) {
          phoneMapping[stationName] = phone;
        }
      }
    });

    const fileContent = `// 공공데이터 API에서 자동 생성된 역사 전화번호 데이터입니다.\n// 생성일: ${new Date().toLocaleString()}\n\nexport const phoneData = ${JSON.stringify(phoneMapping, null, 2)};\n`;

    const outputPath = path.join(__dirname, '../data/phoneData.js');
    fs.writeFileSync(outputPath, fileContent, 'utf-8');

    console.log(`🎉 데이터 변환 및 저장 완료! 파일 위치: ${outputPath}`);

  } catch (error) {
    console.error('❌ API 요청 중 오류가 발생했습니다:', error);
  }
}

fetchPhoneData();
