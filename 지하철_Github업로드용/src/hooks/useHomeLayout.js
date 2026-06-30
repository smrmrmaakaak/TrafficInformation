import { useState, useEffect } from 'react';

const DEFAULT_LAYOUT = ['route', 'briefing', 'favorites'];

export function useHomeLayout() {
  const [layoutOrder, setLayoutOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('home_layout');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse home layout from local storage', e);
    }
    return DEFAULT_LAYOUT;
  });

  useEffect(() => {
    localStorage.setItem('home_layout', JSON.stringify(layoutOrder));
  }, [layoutOrder]);

  return { layoutOrder, setLayoutOrder };
}
