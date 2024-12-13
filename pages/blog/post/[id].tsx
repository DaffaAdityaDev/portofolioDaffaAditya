import { getAllPostIds, getPostData, getSortedPostsData } from '@/lib/posts';
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
import type { PostData, CustomImageProps, CodeBlockProps } from '@/types/blog';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';

function Post({ postData }: PostData) {
  if (!postData) {
    return (
      
        <div className="min-h-screen text-foreground bg-background">
          <main className="max-w-[1024px] mx-auto px-4">
            <div className="mt-20">
              <h1>Post not found</h1>
            </div>
          </main>
          <Footer />
        </div>
     
    );
  }

  // Add structured data for blog post
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postData.title,
    description: postData.description,
    image: postData.image,
    datePublished: postData.date,
    author: {
      '@type': 'Person',
      name: 'Daffa Aditya Rahman',
      url: 'https://daffaaditya.id'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Daffa Aditya Rahman',
      logo: {
        '@type': 'ImageObject',
        url: 'https://daffaaditya.id/svg/selflogo.svg'
      }
    }
  };

  return (
    <>
     <Head>
          <title>{`${postData.title} | Daffa Aditya Blog`}</title>
          <meta name="description" content={postData.description} />
          
          {/* Open Graph tags for social sharing */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={postData.title} />
          <meta property="og:description" content={postData.description} />
          <meta property="og:image" content={postData.image} />
          <meta property="og:url" content={`https://daffaaditya.id/blog/${postData.id}`} />
          
          {/* Twitter Card tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={postData.title} />
          <meta name="twitter:description" content={postData.description} />
          <meta name="twitter:image" content={postData.image} />
          
          {/* Additional SEO tags */}
          <link rel="canonical" href={`https://daffaaditya.id/blog/${postData.id}`} />
          <meta name="author" content="Daffa Aditya Rahman" />
          <meta name="robots" content="index, follow" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
          />
        </Head>
    
      <div className="min-h-screen text-foreground bg-background">
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
                        <table {...props} role="grid" />
                      </div>
                    ),
                    li: (props) => {
                      if (props.className?.includes('task-list-item')) {
                        return (
                          <li className="task-list-item" role="listitem">
                            {props.children}
                          </li>
                        );
                      }
                      return <li {...props} role="listitem" />;
                    }
                  }}
                />
              </article>
            
          </div>
        </main>
        <Footer />
      </div>
  
    </>
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
  const posts = getSortedPostsData(5); // Only get latest 5 posts
  
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  return {
    paths,
    fallback: 'blocking' // Enable blocking fallback
  };
}

export async function getStaticProps({ params }: any) {
  try {
    const postData = await getPostData(params.id);
    
    return {
      props: {
        postData,
      },
      revalidate: 60 * 60, // Revalidate every hour
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
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

  // Use a default theme for initial server render
  const currentTheme = isMounted ? theme : 'light';
  
  const filePathClasses = `
    text-sm mb-0 px-4 py-1 rounded-t-lg
    ${currentTheme === 'dark' ? 'text-cyan-400 bg-[#1d1f21]' : 'text-cyan-600 bg-[#f5f5f5]'}
  `;

  const preClasses = `
    p-4 overflow-x-auto
    ${currentTheme === 'dark' ? 'bg-[#1d1f21]' : 'bg-[#f5f5f5]'}
    ${filePath ? 'rounded-t-none rounded-b-lg' : 'rounded-lg'}
  `;

  // Add this line to extract language from className
  const language = className?.replace(/language-/, '') || 'text';

  return (
    <div className="my-4">
      {filePath && (
        <div
          className={filePathClasses}
          role="heading"
          aria-level={6}
        >
          {filePath}
        </div>
      )}
      <Divider className="my-0 bg-default-400 h-[2px]" />
      <div className="relative group">
        <pre className={preClasses}>
          <code
            className={className?.replace(/language-/, '') || 'text'}
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
              ${currentTheme === 'dark' 
                ? 'bg-[#282a2e] text-gray-300 hover:bg-[#373b41]' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
            aria-label={copySuccess ? "Code copied" : "Copy code"}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </pre>
      </div>
    </div>
  );
};
