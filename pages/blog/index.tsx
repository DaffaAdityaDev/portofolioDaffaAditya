import dynamic from 'next/dynamic';
import { IBlogProps } from '@/components/ui/types';
import { getSortedPostsData, getPostsCount } from '../../lib/posts';
import Head from 'next/head';
import { BlogList, useBlog } from '@/features/Blog';

const Footer = dynamic(() => import('@/components/Layout/Footer'), { ssr: true });

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
  const { posts, loading } = useBlog(initialPosts, totalPosts);

  return (
    <>
      <Head>
        <title>Blog | Daffa Aditya</title>
        <meta name="description" content="Engineering thoughts, tutorials, and insights by Daffa Aditya." />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        
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

