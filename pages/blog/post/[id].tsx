import { GetStaticProps, GetStaticPaths } from 'next';
import PostLayoutV4 from '@/features/Blog/PostLayout';
import { getAllPostIds, getPostData } from '@/lib/posts';
import dynamic from 'next/dynamic';
import type { BlogPostMeta, TocItem } from '@/types/blog';
import { buildPostToc } from '@/features/Blog/utils/postToc';

// Map blog post slugs to their dynamically loaded React component
const MAPPED_POSTS: Record<string, React.ComponentType> = {
  'LearnHowToLearn': dynamic(() => import('@/features/Blog/posts/LearnHowToLearn')),
  'solid-5-principles-that-can-improve-your-codebase': dynamic(() => import('@/features/Blog/posts/SolidPrinciples')),
  'SSGInDetail': dynamic(() => import('@/features/Blog/posts/SSGInDetail')),
  'videoSharing': dynamic(() => import('@/features/Blog/posts/VideoSharing')),
  'nextjs14Improvement': dynamic(() => import('@/features/Blog/posts/Nextjs14Improvement')),
};

// The same modules for getStaticProps, which renders each post once to build its table of
// contents. Kept apart from MAPPED_POSTS because next/dynamic needs the import() inline to
// preload the chunk; only getStaticProps uses this, so it stays out of the browser bundle.
const POST_MODULES: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'LearnHowToLearn': () => import('@/features/Blog/posts/LearnHowToLearn'),
  'solid-5-principles-that-can-improve-your-codebase': () => import('@/features/Blog/posts/SolidPrinciples'),
  'SSGInDetail': () => import('@/features/Blog/posts/SSGInDetail'),
  'videoSharing': () => import('@/features/Blog/posts/VideoSharing'),
  'nextjs14Improvement': () => import('@/features/Blog/posts/Nextjs14Improvement'),
};

interface PostProps {
  id: string;
  meta: BlogPostMeta;
  toc: TocItem[];
}

export default function Post({ id, meta, toc }: PostProps) {
  const PostContent = MAPPED_POSTS[id];

  return (
    <PostLayoutV4 meta={{ ...meta, id }} toc={toc}>
      {PostContent ? (
        <PostContent />
      ) : (
        <p className="text-neutral-500 font-mono text-sm uppercase py-20 text-center">
          Post component is coming soon.
        </p>
      )}
    </PostLayoutV4>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string);
  const { id, ...meta } = postData;
  const load = POST_MODULES[id];
  const toc = load ? await buildPostToc((await load()).default) : [];

  return {
    props: {
      id,
      meta,
      toc,
    },
  };
};
