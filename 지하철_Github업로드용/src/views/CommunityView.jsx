import { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { useCommunityPosts } from '../hooks/useCommunityPosts';
import PostCard from '../components/community/PostCard';
import RecommendModal from '../components/community/RecommendModal';

export default function CommunityView({ onSetAlarmTarget }) {
  const [showModal, setShowModal] = useState(false);
  const { posts, handleLike, submitRecommend } = useCommunityPosts();

  const handleSetAlarm = (stationObj) => {
    if (stationObj && onSetAlarmTarget) {
      onSetAlarmTarget('end', stationObj);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px', paddingBottom: '40px' }}>
      <header style={{ marginBottom: '24px', paddingTop: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={24} color="var(--accent)" /> 커뮤니티 핫플
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          다른 사람들이 공유한 요즘 뜨는 장소를 확인해 보세요!
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            아직 공유된 핫플이 없습니다.<br/>
            가장 먼저 추천해 보세요! 🤩
          </div>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              handleLike={handleLike} 
              handleSetAlarm={handleSetAlarm} 
            />
          ))
        )}
      </div>

      {/* 핫플 추천하기 FAB */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed', bottom: '100px', right: '20px',
          width: '60px', height: '60px', borderRadius: '30px',
          backgroundColor: 'var(--accent)', color: 'white',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)', border: 'none',
          zIndex: 40, cursor: 'pointer', transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Plus size={32} />
      </button>

      {/* 장소 추천 모달 */}
      <RecommendModal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        submitRecommend={submitRecommend} 
      />
    </div>
  );
}
