import dynamic from 'next/dynamic';
import { IBlogProps } from '@/types/blog';
import { getSortedPostsData } from '../../lib/posts';
import Head from 'next/head';

const BlogList = dynamic(() => import('@/features/Blog/BlogList'), { ssr: true });
const Footer = dynamic(() => import('@/components/Layout/Footer'), { ssr: true });

export async function getStaticProps() {
  const posts = getSortedPostsData();
  
  return {
    props: {
      posts,
    },
    revalidate: 3600
  };
}

const Blog = ({ posts }: { posts: IBlogProps[] }) => {
  return (
    <>
      <Head>
        <title>Blog | Daffa Aditya</title>
        <meta name="description" content="Engineering thoughts, tutorials, and insights by Daffa Aditya." />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        <main className="flex-1 pt-16">
           <BlogList posts={posts} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;

