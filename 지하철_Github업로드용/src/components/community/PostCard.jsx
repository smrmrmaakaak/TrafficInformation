import { Heart, Share2, MapPin, ArrowRight } from 'lucide-react';

export default function PostCard({ post, handleLike, handleSetAlarm }) {
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: post.avatar, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '16px' }}>
          {post.author.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>{post.author}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{post.time}</div>
        </div>
      </div>

      <p style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>
        {post.content || "이 장소를 추천합니다! 👍"}
      </p>

      {post.poi && (
        <div style={{ backgroundColor: 'var(--glass-bg)', borderRadius: '16px', border: `1px solid ${post.poi.nearestStation.color}40`, overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'white', backgroundColor: post.poi.nearestStation.color, padding: '4px 8px', borderRadius: '6px', marginBottom: '8px', display: 'inline-block' }}>
              {post.poi.category}
            </span>
            <h3 style={{ margin: '4px 0', fontSize: '18px', fontWeight: 800 }}>{post.poi.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <MapPin size={14} /> {post.poi.address}
            </div>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                minWidth: '32px', height: '24px', borderRadius: '12px', padding: '0 8px',
                backgroundColor: post.poi.nearestStation.color, color: 'white',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontWeight: 800, fontSize: '11px', whiteSpace: 'nowrap'
              }}>
                {post.poi.nearestStation.lineLabel.replace('호선','').replace('선','')}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.poi.nearestStation.stationName}역 (도보 {post.poi.nearestStation.walkingMinutes}분)</span>
            </div>
            <button 
              onClick={() => handleSetAlarm(post.poi.nearestStation)}
              style={{ background: 'none', border: 'none', color: post.poi.nearestStation.color, fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0, cursor: 'pointer' }}
            >
              이 역으로 알람 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <button 
          onClick={() => handleLike(post.id)}
          style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', color: post.isLiked ? '#ff6b6b' : 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
        >
          <Heart size={20} fill={post.isLiked ? "#ff6b6b" : "none"} /> {post.likes}
        </button>
        <button style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          <Share2 size={20} /> 공유
        </button>
      </div>
    </div>
  );
}
