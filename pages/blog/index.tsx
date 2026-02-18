import React, { useState, useCallback } from 'react';
import { IBlogProps } from '@/components/atoms/types';
import { getSortedPostsData, getPostsCount } from '../../lib/posts';
import Head from 'next/head';
import BlogLayout from '@/components/organisms/Blog/BlogLayout';
import BlogList from '@/components/organisms/Blog/BlogList';
import Footer from '@/components/organisms/Footer';
import Navbar from '@/components/organisms/Navbar';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const POSTS_PER_PAGE = 6; 

export async function getStaticProps() {
  const initialPosts = getSortedPostsData(POSTS_PER_PAGE);
  const totalPosts = getPostsCount();
  
  return {
    props: {
      initialPosts,
      totalPosts,
    },
    revalidate: 3600
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

  return (
    <>
      <Head>
        <title>Blog | Daffa Aditya</title>
        <meta name="description" content="Engineering thoughts, tutorials, and insights by Daffa Aditya." />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-16">
           <BlogList posts={posts} />
           
           {loading && (
             <div className="flex justify-center py-8 bg-[#0a0a0a]">
               <div className="w-6 h-6 border-2 border-neutral-700 border-t-white rounded-full animate-spin"></div>
             </div>
           )}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Blog;
