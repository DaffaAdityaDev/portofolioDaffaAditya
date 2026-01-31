import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import PostLayoutV4, { components } from '../../../components/V4/Blog/PostLayout';
import { getAllPostIds, getPostData } from '../../../lib/posts';

export default function Post({ mdxSource, meta }: any) {
  return (
    <PostLayoutV4 meta={meta}>
      <MDXRemote {...mdxSource} components={components} />
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
  const { mdxSource, ...meta } = postData;

  return {
    props: {
      mdxSource,
      meta,
    },
  };
};
