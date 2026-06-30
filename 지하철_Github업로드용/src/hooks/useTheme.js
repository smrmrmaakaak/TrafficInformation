import { useState, useEffect } from 'react';

export function useTheme(dynamicColor = null) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // 다이내믹 테마: 현재 위치 기반 테마 색상 덮어쓰기
  useEffect(() => {
    const root = document.documentElement;
    if (dynamicColor) {
      root.style.setProperty('--accent', dynamicColor);
      root.style.setProperty('--accent-hover', `${dynamicColor}dd`);
    } else {
      // 리셋
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-hover');
    }
  }, [dynamicColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
