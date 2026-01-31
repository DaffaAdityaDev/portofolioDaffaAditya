import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import PostLayout, { components } from './layout';
import { serialize } from 'next-mdx-remote/serialize';
import rehypePrism from 'rehype-prism-plus';

const postsDirectory = path.join(process.cwd(), 'posts');
const cacheDirectory = path.join(process.cwd(), 'posts', '.cache');

export default function Post({ mdxSource, meta }: any) {
  return (
    <PostLayout meta={meta}>
      <MDXRemote {...mdxSource} components={components} />
    </PostLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
    // Return empty paths to ensure O(1) build time.
    // All pages will be generated on-demand (ISR).
    return {
        paths: [],
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const id = params?.id as string;
    const fullPath = path.join(postsDirectory, `${id}.md`);

    if (!fs.existsSync(fullPath)) {
        return { notFound: true };
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    const meta = {
        id,
        ...data,
        date: data.date ? new Date(data.date).toISOString() : null,
    };

    // Try to read from cache first
    const cacheFile = path.join(cacheDirectory, `${id}.json`);
    let mdxSource;

    if (fs.existsSync(cacheFile)) {
        try {
            mdxSource = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        } catch (e) {
            console.warn(`Failed to read cache for ${id}`, e);
        }
    }

    // Fallback: Serialize on the fly (e.g. if cache missing or dev mode)
    if (!mdxSource) {
        // console.log(`Cache miss for ${id}, serializing...`);
        // We define the same options as the generation script to ensure consistency
        const { content } = matter(fileContents);
        mdxSource = await serialize(content, {
            mdxOptions: {
                rehypePlugins: [rehypePrism as any],
                development: false,
            },
        });
    }

    return {
        props: {
            mdxSource,
            meta,
        },
        revalidate: false, // Cache forever until next build/deploy? Or use a long revalidate.
    };
};
