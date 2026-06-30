import { useState, useEffect } from 'react';
import { getUserProfile } from '../utils/profile';

const INITIAL_MOCK_POSTS = [];

export function useCommunityPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 강제 초기화: 더미 데이터가 끈질기게 남아있는 캐시/스토리지를 완벽히 비우기 위해 추가
    if (!localStorage.getItem('community_force_cleared_v2')) {
      localStorage.removeItem('community_posts');
      localStorage.setItem('community_force_cleared_v2', 'true');
    }

    const saved = localStorage.getItem('community_posts');
    if (saved) {
      const parsed = JSON.parse(saved);
      const realPosts = parsed.filter(p => !String(p.id).startsWith('mock-'));
      setPosts(realPosts);
    } else {
      setPosts([]);
    }
  }, []);

  const handleLike = (id) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        if (p.isLiked) {
          // 이미 좋아요를 누른 상태라면 취소
          return { ...p, likes: p.likes - 1, isLiked: false };
        } else {
          // 좋아요를 누르지 않은 상태라면 추가
          return { ...p, likes: p.likes + 1, isLiked: true };
        }
      }
      return p;
    }));
  };

  const submitRecommend = (poi) => {
    const profile = getUserProfile();
    const newPost = {
      id: 'post-' + Date.now(),
      author: profile.name,
      avatar: profile.color,
      poi: poi,
      likes: 0,
      time: '방금 전'
    };
    const saved = localStorage.getItem('community_posts');
    const parsed = saved ? JSON.parse(saved) : [];
    const newSaved = [newPost, ...parsed];
    localStorage.setItem('community_posts', JSON.stringify(newSaved));
    setPosts([newPost, ...posts]);
  };

  return { posts, handleLike, submitRecommend };
}
