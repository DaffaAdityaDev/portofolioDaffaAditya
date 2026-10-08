import dynamic from 'next/dynamic';
import BlogList from '@/features/Blog/BlogList';
import type { IBlogProps } from '@/types/blog';
import { getSortedPostsData } from '@/lib/posts';
import Seo from '@/components/Seo';
import { siteConfig } from '@/config/metadata.config';

const Footer = dynamic(() => import('@/components/Layout/Footer'), { ssr: true });

export async function getStaticProps() {
  const posts = getSortedPostsData();
  
  return {
    props: {
      posts,
    },
  };
}

export interface BlogPageProps {
  posts: IBlogProps[];
}

const BLOG_DESCRIPTION = 'Engineering thoughts, tutorials, and insights by Daffa Aditya.';

const Blog: React.FC<BlogPageProps> = ({ posts }) => {
  return (
    <>
      <Seo
        path="/blog"
        title="Blog | Daffa Aditya"
        description={BLOG_DESCRIPTION}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Blog | Daffa Aditya',
          description: BLOG_DESCRIPTION,
          url: `${siteConfig.url}/blog`,
          author: { '@type': 'Person', name: siteConfig.title, url: siteConfig.url },
          blogPost: posts.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            url: `${siteConfig.url}/blog/post/${post.id}`,
            datePublished: post.date,
          })),
        }}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        <main className="flex-1 pt-16 relative z-10 bg-[#0a0a0a]">
           <BlogList posts={posts} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;

