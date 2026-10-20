import type { ComponentType } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import PostLayout from '@/features/Blog/PostLayout';
import type { PostId } from '@/features/Blog/constants';
import { getAllPostIds, getPostData } from '@/lib/posts';
import type { PostData, TocItem } from '@/types/blog';
import { buildPostToc } from '@/features/Blog/utils/postToc';

type PostModule = () => Promise<{ default: ComponentType }>;

interface PostContent {
  /** Rendered by the page. */
  Content: ComponentType;
  /** Rendered once by getStaticProps to build the table of contents. */
  load: PostModule;
}

/**
 * The body of every post in POSTS_DATA, keyed by its id: one entry per post, and `satisfies`
 * fails the build if an id is missing here or has no metadata.
 *
 * Each entry names the module twice on purpose. next/dynamic only preloads the chunk (and so
 * hydrates without a flash) when its import() is written inline, so `Content` cannot be built
 * from `load`, and a dynamic component exposes no loader to build `load` from either. Both
 * import() calls resolve to the same chunk, so `load` adds nothing to download in the browser.
 */
const POSTS = {
  'nextjs-16-turbopack-server-actions-cache-components': {
    Content: dynamic(() => import('@/features/Blog/posts/Nextjs16')),
    load: () => import('@/features/Blog/posts/Nextjs16'),
  },
  'scaling-ai-agents-as-a-service': {
    Content: dynamic(() => import('@/features/Blog/posts/EchoAgentService')),
    load: () => import('@/features/Blog/posts/EchoAgentService'),
  },
  'how-i-learned-to-learn': {
    Content: dynamic(() => import('@/features/Blog/posts/LearnHowToLearn')),
    load: () => import('@/features/Blog/posts/LearnHowToLearn'),
  },
  'solid-5-principles-that-make-your-codebase-easier-to-change': {
    Content: dynamic(() => import('@/features/Blog/posts/SolidPrinciples')),
    load: () => import('@/features/Blog/posts/SolidPrinciples'),
  },
  'nextjs-14-first-look': {
    Content: dynamic(() => import('@/features/Blog/posts/Nextjs14Improvement')),
    load: () => import('@/features/Blog/posts/Nextjs14Improvement'),
  },
  'static-site-generation-in-nextjs': {
    Content: dynamic(() => import('@/features/Blog/posts/SSGInDetail')),
    load: () => import('@/features/Blog/posts/SSGInDetail'),
  },
  'designing-a-distributed-video-streaming-system': {
    Content: dynamic(() => import('@/features/Blog/posts/VideoSharing')),
    load: () => import('@/features/Blog/posts/VideoSharing'),
  },
} satisfies Record<PostId, PostContent>;

/** Narrows the post itself, so the props can pass it on without copying it to retype `id`. */
const hasContent = (post: PostData): post is PostData & { id: PostId } => post.id in POSTS;

interface PostProps {
  post: PostData & { id: PostId };
  toc: TocItem[];
}

export default function Post({ post, toc }: PostProps) {
  const { Content } = POSTS[post.id];

  return (
    <PostLayout meta={post} toc={toc}>
      <Content />
    </PostLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getAllPostIds(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<PostProps, { id: string }> = async ({ params }) => {
  const post = params ? getPostData(params.id) : undefined;
  if (!post || !hasContent(post)) return { notFound: true };

  const toc = await buildPostToc((await POSTS[post.id].load()).default);

  return { props: { post, toc } };
};
