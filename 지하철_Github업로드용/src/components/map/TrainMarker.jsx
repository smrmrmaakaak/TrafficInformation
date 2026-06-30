export default function TrainMarker({ color, direction }) {
  return (
    <div style={{
      transform: direction === 'down' ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s',
      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <svg width="24" height="46" viewBox="0 0 24 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`body-${color.replace('#','')}`} x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="20%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="80%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="glass-sleek" x1="0" y1="0" x2="24" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#020617" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <path d="M 6 3 C 10 -1, 14 -1, 18 3 L 22 15 L 22 42 C 22 43, 21 44, 20 44 L 4 44 C 3 44, 2 43, 2 42 L 2 15 Z" fill={`url(#body-${color.replace('#','')})`} stroke="#475569" strokeWidth="0.5" />
        <rect x="2.5" y="18" width="1" height="24" fill={color} opacity="0.8" />
        <rect x="20.5" y="18" width="1" height="24" fill={color} opacity="0.8" />
        <path d="M 6.5 4 C 10 0.5, 14 0.5, 17.5 4 L 21.5 15 C 21.5 17, 12 18, 12 18 C 12 18, 2.5 17, 2.5 15 Z" fill="url(#glass-sleek)" />
        <path d="M 7.5 3 C 10 1, 14 1, 16.5 3 L 17.5 4 C 14 2, 10 2, 6.5 4 Z" fill={color} />
        <rect x="9" y="24" width="6" height="16" rx="3" fill="#64748b" opacity="0.4" />
        <path d="M 4 13 L 6 9.5 L 7 9.5 L 5 13 Z" fill="#ffffff" />
        <path d="M 20 13 L 18 9.5 L 17 9.5 L 19 13 Z" fill="#ffffff" />
        <path d="M 4.5 12.5 L 6.5 10" stroke="#fef08a" strokeWidth="1" />
        <path d="M 19.5 12.5 L 17.5 10" stroke="#fef08a" strokeWidth="1" />
      </svg>
    </div>
  );
}
