import { MapPin, Info, Share2, ArrowRight, X } from 'lucide-react';
import { getUserProfile } from '../../utils/profile';

export default function PoiBottomSheet({ selectedPoi, clearSelection, onSetAlarmTarget }) {
  if (!selectedPoi) return null;

  const handleSetAlarm = () => {
    if (selectedPoi && selectedPoi.nearestStation) {
      onSetAlarmTarget('end', selectedPoi.nearestStation);
    }
  };

  const handleShare = () => {
    const comment = window.prompt(`[${selectedPoi.name}]을(를) 커뮤니티에 공유합니다.\n추천하는 이유를 짧게 적어주세요!`);
    
    if (comment) {
      const profile = getUserProfile();

      const newPost = {
        id: 'post-' + Date.now(),
        author: profile.name,
        avatar: profile.color,
        content: comment,
        poi: selectedPoi,
        likes: 0,
        time: '방금 전'
      };

      const saved = localStorage.getItem('community_posts');
      const posts = saved ? JSON.parse(saved) : [];
      localStorage.setItem('community_posts', JSON.stringify([newPost, ...posts]));
      
      alert(`[${profile.name}] 닉네임으로 공유되었습니다!\n하단 [커뮤니티] 탭에서 확인해 보세요.`);
    }
  };

  return (
    <div 
      style={{ 
        position: 'absolute', bottom: '100px', left: 0, right: 0, zIndex: 1000, 
        padding: '20px', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: selectedPoi ? 'translateY(0)' : 'translateY(150%)'
      }}
    >
      <div className="glass-card" style={{ padding: '24px', position: 'relative', borderRadius: '32px' }}>
        <div className="drag-handle" />
        <button 
          onClick={clearSelection}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '4px', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingRight: '24px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', backgroundColor: 'var(--accent)20', padding: '4px 8px', borderRadius: '8px', marginBottom: '8px', display: 'inline-block' }}>
              {selectedPoi.category}
            </span>
            <h2 style={{ margin: '4px 0', fontSize: '22px', fontWeight: 800 }}>{selectedPoi.name}</h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
              <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {selectedPoi.address}
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Info size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>인근 가장 가까운 지하철역</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ minWidth: '32px', height: '32px', borderRadius: '16px', padding: '0 8px', backgroundColor: selectedPoi.nearestStation.color, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '12px', whiteSpace: 'nowrap' }}>
                {selectedPoi.nearestStation.lineLabel.replace('호선', '').replace('선', '')}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>{selectedPoi.nearestStation.stationName}역</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: selectedPoi.nearestStation.color, fontWeight: 600 }}>도보 약 {selectedPoi.nearestStation.walkingMinutes}분 거리</p>
              </div>
            </div>
          </div>
        </div>

        {selectedPoi.isCustom && selectedPoi.nearbyPlaces && (
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              🍳 이 근처 먹거리 추천
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedPoi.nearbyPlaces.map((place, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'var(--accent)20', color: 'var(--accent)', borderRadius: '6px', fontWeight: 700 }}>{place.type}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{place.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{place.distance}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleShare}
            style={{
              flex: '0 0 60px', padding: '16px 0', borderRadius: '16px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)',
              border: '1px solid var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer'
            }}
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={handleSetAlarm}
            style={{
              flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: selectedPoi.nearestStation.color, color: 'white',
              fontWeight: 700, fontSize: '16px', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              boxShadow: `0 4px 12px ${selectedPoi.nearestStation.color}40`, cursor: 'pointer'
            }}
          >
            이 역으로 알람 맞추기 <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
