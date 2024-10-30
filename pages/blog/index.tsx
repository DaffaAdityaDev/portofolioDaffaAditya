import React, { useState, useCallback } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import BlogCard from '../../components/Blog/BlogCard';
import Navbar from '../../components/Navbar/V2';
import { getSortedPostsData, getPostsCount } from '../../lib/posts';
import { IBlogProps } from '../../components/types';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import Footer from '@/components/Footer';

const POSTS_PER_PAGE = 4; // Increased for better UX

export async function getStaticProps() {
  const initialPosts = getSortedPostsData(POSTS_PER_PAGE);
  const totalPosts = getPostsCount();
  
  return {
    props: {
      initialPosts,
      totalPosts,
    },
  };
}

const Blog = ({ 
  initialPosts, 
  totalPosts 
}: { 
  initialPosts: IBlogProps[],
  totalPosts: number 
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMore = posts.length < totalPosts;

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/posts?skip=${posts.length}&limit=${POSTS_PER_PAGE}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newPosts = await response.json();
      
      if (!Array.isArray(newPosts) || newPosts.length === 0) {
        if (posts.length < totalPosts) {
          throw new Error('Received invalid data from server');
        }
        return;
      }

      setPosts(prev => [...prev, ...newPosts]);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [posts.length, loading, hasMore, totalPosts]);

  // Use the infinite scroll hook with error handling
  useInfiniteScroll(loadMorePosts, hasMore, loading);

  return (
    <div className="min-h-screen bg-content1">
      <Navbar />

      <div className="relative mx-auto w-5/6 pt-28">
        <Card className="mx-auto w-fit bg-content2">
          <CardBody className="text-center py-2">
            <h2 className="text-2xl font-bold text-foreground">Featured Posts</h2>
            <p className="text-foreground-500">Stay Informed with our featured Posts</p>
          </CardBody>
        </Card>
      </div>

      <div className="mx-auto w-5/6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post: IBlogProps) => (
            <BlogCard
              key={post.id}
              {...post}
            />
          ))}
        </div>
        
        {loading && (
          <div className="flex justify-center mt-8">
            <Button
              isLoading
              className="bg-primary text-white"
            >
              Loading more posts...
            </Button>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center mt-8 gap-2">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={() => loadMorePosts()}
              className="bg-primary text-white"
            >
              Retry
            </Button>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-8 text-foreground-500">
            No more posts to load
          </div>
        )}
      </div>
      <div className='mt-10'>
        <Footer />
      </div>
      
    </div>
  );
};

export default Blog;
