import BlogList from '@/features/Blog/BlogList';
import type { PostSummary } from '@/types/blog';
import { getSortedPostsData } from '@/lib/posts';
import Seo from '@/components/Seo';
// Below the fold: static HTML, JS loaded as the page nears the bottom.
import Footer from '@/components/Layout/LazyFooter';
import { siteConfig } from '@/config/metadata.config';

export async function getStaticProps() {
  // Only what the list renders goes into the page data.
  const posts: PostSummary[] = getSortedPostsData().map(
    ({ id, category, image, title, description, date, updated, timeToRead }) => ({
      id,
      category,
      image,
      title,
      description,
      date,
      // getStaticProps cannot serialize undefined.
      ...(updated && { updated }),
      timeToRead,
    }),
  );

  return {
    props: {
      posts,
    },
  };
}

export interface BlogPageProps {
  posts: PostSummary[];
}

const BLOG_DESCRIPTION = 'Engineering thoughts, tutorials, and insights by Daffa Aditya.';

const Blog: React.FC<BlogPageProps> = ({ posts }) => {
  return (
    <>
      <Seo
        path="/blog"
        title="Blog"
        description={BLOG_DESCRIPTION}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: `Blog | ${siteConfig.name}`,
          description: BLOG_DESCRIPTION,
          url: `${siteConfig.url}/blog`,
          author: { '@type': 'Person', name: siteConfig.title, url: siteConfig.url },
          blogPost: posts.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            url: `${siteConfig.url}/blog/post/${post.id}`,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
          })),
        }}
      />

      <div className="min-h-screen bg-background text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        <main className="flex-1 pt-16 relative z-10 bg-background">
           <BlogList posts={posts} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;

