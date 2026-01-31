import React from 'react';
import Head from 'next/head';
import Navbar from '../../../components/Navbar/V2';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';
import styles from '../../../styles/blog.module.scss';
import { Card, CardBody, Button, Divider } from '@nextui-org/react';
import { useTheme } from 'next-themes';

// --- Code Block Component ---
// (We can export this if needed, or keep local)
const CodeBlock = ({ children, className }: any) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);
  const { theme } = useTheme();
  const codeRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentTheme = isMounted ? theme : 'light';

  const preClasses = `
    p-4 overflow-x-auto
    ${currentTheme === 'dark' ? 'bg-[#1d1f21]' : 'bg-[#f5f5f5]'}
    rounded-lg
  `;

  const handleCopy = () => {
    if (codeRef.current) {
        const textToCopy = codeRef.current.innerText;
        navigator.clipboard.writeText(textToCopy);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="my-4">
      <div className="relative group">
        <pre className={preClasses}>
          <code ref={codeRef} className={className}>
            {children}
          </code>
          <button
            onClick={handleCopy}
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

// --- Custom Image Component ---
const CustomImage = ({ src, alt }: any) => (
    <img
      src={src}
      alt={alt || ''}
      className="w-full h-auto my-4 rounded-lg object-contain"
      loading="lazy"
    />
);


export const components = {
    code: CodeBlock,
    img: CustomImage,
    Card,
    CardBody,
    Button,
    Divider,
    table: (props: any) => (
      <div className="overflow-x-auto">
        <table {...props} role="grid" />
      </div>
    ),
};


export default function PostLayout({ meta, children }: { meta: any, children: React.ReactNode }) {
  if (!meta) return null;

  return (
    <>
      <Head>
        <title>{`${meta.title} | Daffa Aditya Blog`}</title>
        <meta name="description" content={meta.description} />
        {/* Open Graph tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={`https://daffaaditya.id/blog/post/${meta.id}`} />
      </Head>

      <div className="min-h-screen text-foreground bg-background">
        <main className="max-w-[1024px] mx-auto px-4">
          <div className="mt-20">
            <Breadcrumb
              items={[
                { title: 'Home', href: '/' },
                { title: 'Blog', href: '/blog' },
                { title: meta.title, href: `/blog/post/${meta.id}` },
              ]}
            />
            
            <Card className="border-none bg-transparent shadow-none my-8">
              <CardBody className="p-0 overflow-visible">
                <div className="flex flex-col justify-center">
                  <h1 className="mb-6 text-center text-4xl md:text-5xl font-bold tracking-tight">
                    {meta.title}
                  </h1>
                  <img
                    src={meta.image}
                    alt={meta.title}
                    className="w-full h-auto max-h-[600px] object-cover rounded-xl shadow-lg"
                    loading="lazy"
                  />
                </div>
              </CardBody>
            </Card>

            <article className={styles.blogPost}>
                {children}
            </article>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
