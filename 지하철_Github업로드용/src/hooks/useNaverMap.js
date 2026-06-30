import { useState, useEffect } from 'react';

const SCRIPT_ID = 'naver-map-script';

export default function useNaverMap() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.naver && window.naver.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      const handleLoad = () => setIsLoaded(true);
      existingScript.addEventListener('load', handleLoad);
      return () => existingScript.removeEventListener('load', handleLoad);
    }

    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
    if (!clientId) {
      setError(new Error('네이버 지도 API 클라이언트 ID가 환경변수에 없습니다.'));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setError(new Error('네이버 지도 API 로드에 실패했습니다.'));
    };

    document.head.appendChild(script);
  }, []);

  return { isLoaded, error };
}
