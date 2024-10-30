import { getAllPostIds, getPostData } from '@/lib/posts';
import Breadcrumb from '../../../components/Breadcrumb';
import styles from '../../../styles/blog.module.scss';
import Navbar from '../../../components/Navbar/V2';
import Head from 'next/head';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-json';
import { MDXRemote } from 'next-mdx-remote';
import { Card, CardBody, Button, Divider } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { useTheme } from 'next-themes';

interface PostProps {
  postData: {
    title: string;
    description: string;
    contentHtml: string;
    image: string;
    id: string;
    mdxSource: any;
  };
}

interface CustomImageProps {
  src: string;
  alt: string;
}

interface CodeBlockProps {
  children: string;
  className?: string;
}

function Post({ postData }: PostProps) {
  return (
    <div className="min-h-screen text-foreground bg-background">
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={postData.description} />
        <meta property="og:title" content={postData.title} />
        <meta property="og:description" content={postData.description} />
        <meta property="og:image" content={postData.image} />
        <meta
          property="og:url"
          content={`https://yourwebsite.com/blog/${postData.id}`}
        />
        <meta property="og:type" content="article" />
        <link rel="icon" href="/svg/selflogo.svg" />
      </Head>
      <Navbar />
      <main className="max-w-[1024px] mx-auto px-4">
        <div className="mt-20">
          <Breadcrumb
            items={[
              { title: 'Home', href: '/' },
              { title: 'Blog', href: '/blog' },
              { title: postData.title, href: `/blog/post/${postData.id}` },
            ]}
          />
          
          <Card className="border-none bg-transparent shadow-none my-8">
            <CardBody className="p-0 overflow-visible">
              <div className="flex flex-col justify-center">
                <h1 className="mb-6 text-center text-4xl md:text-5xl font-bold tracking-tight">
                  {postData.title}
                </h1>
                <img
                  src={postData.image}
                  alt={postData.title}
                  className="w-full h-auto max-h-[600px] object-cover rounded-xl shadow-lg"
                  loading="lazy"
                />
              </div>
            </CardBody>
          </Card>

          <article className={styles.blogPost}>
            <MDXRemote
              {...postData.mdxSource}
              components={{
                code: CodeBlock,
                img: CustomImage,
                Card,
                CardBody,
                Button,
                Divider,
                table: (props) => (
                  <div className="overflow-x-auto">
                    <table {...props} />
                  </div>
                ),
                li: (props) => {
                  if (props.className?.includes('task-list-item')) {
                    return (
                      <li className="task-list-item">
                        {props.children}
                      </li>
                    );
                  }
                  return <li {...props} />;
                }
              }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const CustomImage = ({ src, alt }: CustomImageProps) => (
  <img
    src={src}
    alt={alt || ''}
    className="w-full h-auto my-4 rounded-lg object-contain"
    loading="lazy"
  />
);

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}

export default Post;

const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Extract file path and clean code
  const filePathMatch = children.match(/\/\*\s*filePath:\s*(.*?)\s*\*\//);
  const filePath = filePathMatch ? filePathMatch[1] : '';
  const code = children
    .replace(/\/\*\s*filePath:\s*(.*?)\s*\*\//, '')
    .replace(/^\{\s*\}/, '')
    .trim();

  // Define theme-specific syntax highlighting colors
  const syntaxTheme = {
    dark: {
      background: '#1d1f21',
      text: '#c5c8c6',
      comment: '#969896',
      keyword: '#b294bb',
      string: '#b5bd68',
      number: '#de935f',
      function: '#81a2be',
      operator: '#8abeb7',
      variable: '#cc6666'
    },
    light: {
      background: '#f5f5f5',
      text: '#1f2937',
      comment: '#6e7781',
      keyword: '#cf222e',
      string: '#0a3069',
      number: '#0550ae',
      function: '#8250df',
      operator: '#0550ae',
      variable: '#953800'
    }
  };

  const currentTheme = theme === 'dark' ? syntaxTheme.dark : syntaxTheme.light;

  // Add theme-specific styles to Prism
  useEffect(() => {
    if (isMounted) {
      const style = document.createElement('style');
      style.innerHTML = `
        .token.comment { color: ${currentTheme.comment} !important; }
        .token.keyword { color: ${currentTheme.keyword} !important; }
        .token.string { color: ${currentTheme.string} !important; }
        .token.number { color: ${currentTheme.number} !important; }
        .token.function { color: ${currentTheme.function} !important; }
        .token.operator { color: ${currentTheme.operator} !important; }
        .token.variable { color: ${currentTheme.variable} !important; }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [theme, isMounted]);

  if (!isMounted) {
    return (
      <div className="my-4">
        {filePath && (
          <div
            className={`
              text-sm mb-0 px-4 py-1 rounded-t-lg
              ${theme === 'dark' ? 'text-cyan-400 bg-[#1d1f21]' : 'text-cyan-600 bg-[#f5f5f5]'}
            `}
          >
            {filePath}
          </div>
        )}
        <pre 
          className={`
            p-4 overflow-x-auto
            ${theme === 'dark' ? 'bg-[#1d1f21]' : 'bg-[#f5f5f5]'}
            ${filePath ? 'rounded-t-none rounded-b-lg' : 'rounded-lg'}
          `}
        >
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  const language = className?.replace(/language-/, '') || 'text';

  return (
    <div className="my-4">
      {filePath && (
        <div
          className={`
            text-sm mb-0 px-4 py-1 rounded-t-lg
            ${theme === 'dark' ? 'text-cyan-400 bg-[#1d1f21]' : 'text-cyan-600 bg-[#f5f5f5]'}
          `}
        >
          {filePath}
        </div>
      )}
      <Divider className="my-0 bg-default-400 h-[2px]" />
      <div className="relative group">
        <pre 
          className={`
            p-4 overflow-x-auto
            ${theme === 'dark' ? 'bg-[#1d1f21]' : 'bg-[#f5f5f5]'}
            ${filePath ? 'rounded-t-none rounded-b-lg' : 'rounded-lg'}
          `}
        >
          <code
            className={language}
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                code,
                Prism.languages[language] || Prism.languages.text,
                language
              ),
            }}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopySuccess(true);
              setTimeout(() => setCopySuccess(false), 2000);
            }}
            className={`
              absolute right-2 top-2 opacity-0 group-hover:opacity-100
              transition-opacity px-2 py-1 rounded text-sm
              ${theme === 'dark' 
                ? 'bg-[#282a2e] text-gray-300 hover:bg-[#373b41]' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </pre>
      </div>
    </div>
  );
};
