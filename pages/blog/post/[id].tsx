import { getAllPostIds, getPostData } from "../../../lib/posts";
import Breadcrumb from "../../../components/Breadcrumb";
import styles from "../../../styles/blog.module.scss";
import Navbar from "../../../components/Navbar";
import Head from "next/head";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Import the theme you prefer
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
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
              { title: "Home", href: "/" },
              { title: "Blog", href: "/blog" },
              { title: postData.title, href: `/blog/post/${postData.id}` },
            ]}
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex max-h-[600px] w-full items-center justify-center overflow-hidden">
            <Image
              src={postData.image}
              priority
              alt="profile"
              width={900}
              height={500}
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={100}
              placeholder="blur"
              blurDataURL={postData.image}
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
  const language = className?.replace(/language-/, "");
  if (!language || !Prism.languages[language]) {
    console.error(`Unsupported language: ${language}`);
    return children; // Fallback to returning the raw code if language is not supported
  }
  // Check if children is defined before trimming
  const code = children ? children.trim() : ""; // Directly use children here if defined, otherwise use an empty string
  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language],
    language,
  );

  // Ensure className is applied correctly
  const codeClassName = className
    ? `language-${language} ${className}`
    : `language-${language}`;

  return (
    <pre className={codeClassName}>
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
};
