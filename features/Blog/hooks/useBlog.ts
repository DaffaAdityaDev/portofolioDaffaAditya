import { useState, useCallback } from 'react';
import { IBlogProps } from '@/components/ui/types';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const POSTS_PER_PAGE = 6;

export const useBlog = (initialPosts: IBlogProps[], totalPosts: number) => {
  const [posts, setPosts] = useState<IBlogProps[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const hasMore = posts.length < totalPosts;

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/posts?skip=${posts.length}&limit=${POSTS_PER_PAGE}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const newPosts = await response.json();
      if (!Array.isArray(newPosts) || newPosts.length === 0) return;

      setPosts(prev => [...prev, ...newPosts]);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  }, [posts.length, loading, hasMore]);

  useInfiniteScroll(loadMorePosts, hasMore, loading);

  return {
    posts,
    loading,
  };
};
