import { getAllPostIds, getPostData } from '../../../lib/posts';
import Breadcrumb from '../../../components/Breadcrumb';
import styles from '../../../styles/blog.module.scss';
import Navbar from '../../../components/Navbar';
import Head from 'next/head';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Import the theme you prefer
import 'prismjs/components/prism-json';
import { MDXRemote } from 'next-mdx-remote';
import Image from 'next/image';
import React, { useState } from 'react';
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

// Your page component here
function Post({ postData }: PostProps) {
  return (
    <div className="grid grid-cols-12 text-white">
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
      <div className="col-span-10 col-start-2">
        <Navbar />
        <div className="my-4">
          <Breadcrumb
            items={[
              { title: 'Home', href: '/' },
              { title: 'Blog', href: '/blog' },
              { title: postData.title, href: `/blog/post/${postData.id}` },
            ]}
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex max-h-[600px] w-full items-center justify-center overflow-hidden">
            <img
              src={postData.image}
              // priority
              alt="profile"
              // width={900}
              // height={600}
              // fill
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              // quality={100}
              // placeholder="blur"
              // blurDataURL={postData.image}
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="mt-6 text-center text-4xl font-bold">
            {postData.title}
          </h1>
        </div>
        {/* <div
          className={styles.blogPost}
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        /> */}
        <div className={styles.blogPost}>
          <MDXRemote
            {...postData.mdxSource}
            components={{ code: CodeBlock, img: CustomImage }}
          />
        </div>
      </div>
    </div>
  );
}

const CustomImage = ({ src, alt }: CustomImageProps) => (
  <Image
    src={src}
    alt={alt}
    width={900}
    height={500}
    loading="lazy"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    quality={80}
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

const CodeBlock = ({ children, className }: any) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const language = className?.replace(/language-/, '');
  if (!language || !Prism.languages[language]) {
    console.error(`Unsupported language: ${language}`);
    return children; // Fallback to returning the raw code if language is not supported
  }

  // Extract file path from the children if it's a comment
  const filePathMatch = children.match(/{.*?filePath: (.*?)\*\/}/);
  const filePath = filePathMatch ? filePathMatch[1] : null;

  // Check if children is defined before trimming
  const code = children.replace(/{.*?filePath: (.*?)}/, '').trim(); // Directly use children here if defined, otherwise use an empty string
  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language],
    language,
  );

  // Ensure className is applied correctly
  const codeClassName = className
    ? `language-${language} ${className}`
    : `language-${language}`;

  const programmingLanguage = language.toUpperCase();

  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = code;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };

  return (
    <div className="rounded-md border-l-[1px] border-r-[1px] border-t-[1px] border-gray-700">
      <div className="flex flex-wrap-reverse justify-between text-sm">
        <div className="rounded-md bg-slate-900 p-2 text-white">
          &gt;_ {programmingLanguage}
        </div>
        {filePath && (
          <div className="rounded-md bg-slate-900 p-2 text-white">
            {filePath}
          </div>
        )}
      </div>
      <pre className={codeClassName}>
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />

        <div className="">
          <button
            className="absolute bottom-0 right-0 m-1 rounded-md p-2 hover:bg-gray-700"
            onClick={copyToClipboard}
          >
            <div className="relative h-6 w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className={`bi bi-clipboard  absolute left-0 top-0 h-full w-full transition-transform duration-700 ${
                  copySuccess ? 'scale-150 opacity-100' : 'scale-0 opacity-0'
                }`}
                viewBox="0 0 16 16"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className={`bi bi-clipboard absolute left-0 top-0 h-full w-full transition-transform duration-700 ${
                  copySuccess ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                }`}
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                />
              </svg>
            </div>
          </button>
        </div>
      </pre>
    </div>
  );
};
