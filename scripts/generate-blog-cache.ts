import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypePrism from 'rehype-prism-plus';

const postsDirectory = path.join(process.cwd(), 'posts');
const cacheDirectory = path.join(process.cwd(), 'posts', '.cache');

async function generateCache() {
  console.log('🔄 Generating MDX Cache (JSON)...');

  if (!fs.existsSync(cacheDirectory)) {
    fs.mkdirSync(cacheDirectory, { recursive: true });
  }

  const fileNames = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));

  for (const fileName of fileNames) {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    console.log(`Processing: ${id}`);
    
    // Serialize MDX using next-mdx-remote
    // This allows us to use <MDXRemote /> in the dynamic page
    const mdxSource = await serialize(content, {
        mdxOptions: {
            rehypePlugins: [rehypePrism as any],
            development: false,
        },
    });

    const cacheFile = path.join(cacheDirectory, `${id}.json`);
    fs.writeFileSync(cacheFile, JSON.stringify(mdxSource));
    console.log(`✅ Cached: ${id}`);
  }

  console.log('✨ All posts cached!');
}

generateCache().catch(console.error);
