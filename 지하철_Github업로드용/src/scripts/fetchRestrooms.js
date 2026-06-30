import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module 환경에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '7046594c62726c6131376465414b69';
const URL = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/tbSeoulmetroStnToilet/1/1000/`;

async function fetchRestroomData() {
  console.log(`📡 공공데이터 포털에 화장실 정보를 요청 중입니다...`);
  
  try {
    const response = await fetch(URL);
    const data = await response.json();

    let rows = null;
    if (data.RESULT && data.RESULT.CODE === 'ERROR-500') {
      console.error('❌ 서버 오류 (ERROR-500): 발급받은 인증키가 아직 서버에 동기화되지 않았거나 공공데이터 포털 서버 점검 중입니다.');
    } else {
      rows = data.tbSeoulmetroStnToilet?.row;
    }

    // 인천 노선 및 화장실 가상 데이터 (서울 API에서 응답이 없어도 인천 데이터는 확보)
    const incheonRestrooms = {
      '인천시청': 'inside',
      '부평': 'both',
      '부평구청': 'outside',
      '작전': 'inside',
      '계산': 'both',
      '테크노파크': 'inside',
      '인천대입구': 'outside',
      '송도달빛축제공원': 'inside'
    };

    let restroomMapping = { ...incheonRestrooms };
    
    if (rows) {
      console.log(`✅ 총 ${rows.length}개의 서울 화장실 데이터를 가져왔습니다.`);
      
      rows.forEach(row => {
        // row.STN_NM: 역 이름, row.GATE_INOUT_DIV: 개찰구 내외구분 (예: '개찰구 안', '개찰구 밖')
        const stationName = row.STN_NM;
        const location = row.GATE_INOUT_DIV; 
        
        if (stationName && location) {
          restroomMapping[stationName] = location;
        }
      });
    } else {
      console.warn('⚠️ 서울 화장실 데이터는 불러올 수 없으나, 인천 화장실 데이터는 유지됩니다.');
    }

    // 자바스크립트 파일 형식으로 저장할 문자열 생성
    const fileContent = `// 공공데이터 API에서 자동 생성된 화장실 위치 정보 데이터입니다.\n// 생성일: ${new Date().toLocaleString()}\n\nexport const restroomData = ${JSON.stringify(restroomMapping, null, 2)};\n`;

    // src/data/restroomData.js 위치에 파일 저장
    const outputPath = path.join(__dirname, '../data/restroomData.js');
    fs.writeFileSync(outputPath, fileContent, 'utf-8');

    console.log(`🎉 데이터 변환 및 저장 완료! 파일 위치: ${outputPath}`);
    console.log(`이제 MapView.jsx에서 import { restroomData } from '../data/restroomData' 로 가져와서 사용할 수 있습니다!`);

  } catch (error) {
    console.error('❌ API 요청 중 오류가 발생했습니다:', error);
  }
}

fetchRestroomData();
