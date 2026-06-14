import { GetStaticProps, GetStaticPaths } from 'next';
import { PostLayout as PostLayoutV4 } from '@/features/Blog';
import { getAllPostIds, getPostData } from '@/lib/posts';
import dynamic from 'next/dynamic';

// Map blog post slugs to their dynamically loaded React component
const MAPPED_POSTS: Record<string, React.ComponentType> = {
  'LearnHowToLearn': dynamic(() => import('@/features/Blog/posts/LearnHowToLearn')),
  'solid-5-pirinciples-that-can-improve-you-codebase': dynamic(() => import('@/features/Blog/posts/SolidPrinciples')),
  'SSGInDetail': dynamic(() => import('@/features/Blog/posts/SSGInDetail')),
  'videoSharing': dynamic(() => import('@/features/Blog/posts/VideoSharing')),
  'nextjs14Improvement': dynamic(() => import('@/features/Blog/posts/Nextjs14Improvement')),
};

export default function Post({ id, meta }: any) {
  const PostContent = MAPPED_POSTS[id];

  return (
    <PostLayoutV4 meta={meta}>
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

  return {
    props: {
      id,
      meta,
    },
  };
};
