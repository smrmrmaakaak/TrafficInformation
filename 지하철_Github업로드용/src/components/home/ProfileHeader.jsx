import { Settings } from 'lucide-react';

export default function ProfileHeader({ profile, onOpenSettings }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '56px', padding: '0 20px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
        홈
      </h1>
      <button 
        onClick={onOpenSettings}
        style={{ 
          padding: '8px', color: 'var(--text-primary)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}
      >
        <Settings size={24} />
      </button>
    </div>
  );
}
