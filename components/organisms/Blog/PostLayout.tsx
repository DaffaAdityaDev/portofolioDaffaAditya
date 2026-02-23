import React from 'react';
import Head from 'next/head';
import Navbar from '../Navbar';
import Footer from '../Footer';
import GridLine from '@/components/atoms/GridLine';
import { useTheme } from 'next-themes';
import { Card, CardBody, Button, Divider } from '@nextui-org/react';
import { motion } from 'framer-motion';

// --- Code Block Component ---
const CodeBlock = ({ children, className }: any) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);
  const codeRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopy = () => {
    if (codeRef.current) {
        const textToCopy = codeRef.current.innerText;
        navigator.clipboard.writeText(textToCopy);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="my-6 border border-neutral-800 bg-black rounded-sm relative group">
      <div className="flex items-center justify-between px-3 py-1 border-b border-neutral-800 bg-neutral-900/50 text-xs font-mono text-neutral-500">
        <span>CODE</span>
        <button 
          onClick={handleCopy}
          className="hover:text-white transition-colors uppercase"
        >
          {copySuccess ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono text-neutral-300">
        <code ref={codeRef} className={className}>
          {children}
        </code>
      </div>
    </div>
  );
};

// --- Custom Image Component ---
const CustomImage = ({ src, alt }: any) => (
  <div className="my-8 border border-neutral-800 bg-[#0a0a0a] p-2">
    <img
      src={src}
      alt={alt || ''}
      className="w-full h-auto"
      loading="lazy"
    />
    {alt && <div className="mt-2 text-center text-xs font-mono text-neutral-600 uppercase">{alt}</div>}
  </div>
);

export const components = {
    code: CodeBlock,
    img: CustomImage,
    Card,
    CardBody,
    Button,
    Divider,
    table: (props: any) => (
      <div className="overflow-x-auto my-6 border border-neutral-800">
        <table {...props} className="w-full text-left text-sm" />
      </div>
    ),
    h1: (props: any) => <h1 {...props} className="text-3xl font-black uppercase tracking-tight mt-12 mb-6 text-white" />,
    h2: (props: any) => <h2 {...props} className="text-2xl font-bold uppercase tracking-tight mt-10 mb-5 text-white border-l-2 border-red-500 pl-4" />,
    h3: (props: any) => <h3 {...props} className="text-xl font-bold uppercase mt-8 mb-4 text-white" />,
    p: (props: any) => <p {...props} className="mb-6 text-neutral-400 leading-relaxed max-w-3xl" />,
    ul: (props: any) => <ul {...props} className="list-disc list-inside mb-6 text-neutral-400 space-y-2" />,
    ol: (props: any) => <ol {...props} className="list-decimal list-inside mb-6 text-neutral-400 space-y-2" />,
    a: (props: any) => <a {...props} className="text-red-500 hover:text-red-400 uppercase font-mono text-sm border-b border-red-500/50 pb-0.5 transition-colors" />,
    blockquote: (props: any) => (
      <blockquote {...props} className="border-l-4 border-neutral-700 pl-6 italic my-8 text-neutral-500 font-serif text-lg" />
    ),
};

export default function PostLayoutV4({ meta, children }: { meta: any, children: React.ReactNode }) {
  if (!meta) return null;


  return (
    <React.Fragment>
      <Head>
        <title>{`${meta.title} | Daffa Aditya`}</title>
        <meta name="description" content={meta.description} />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        <Navbar />
        
        <main className="flex-1 relative pt-16">
          <GridLine className="top-0 opacity-30" />
          <GridLine vertical className="left-6 lg:left-20 opacity-30" />
          <GridLine vertical className="right-6 lg:right-20 opacity-30" />

          {/* Hero Section */}
          <div className="relative z-10 w-full flex flex-col items-center">
            {meta.image && (
              <div className="w-full h-[40vh] lg:h-[60vh] relative overflow-hidden border-b border-neutral-800">
                <img 
                  src={meta.image} 
                  alt={meta.title} 
                  className="w-full h-full object-cover opacity-60"
                  style={{ viewTransitionName: `blog-image-${meta.id}` }}
                />
                <div 
                  className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10" 
                />
              </div>
            )}
            
            <div className={`px-6 lg:px-20 pb-12 w-full max-w-6xl relative z-20 ${meta.image ? '-mt-32' : 'py-20'}`}>
              <div className="inline-block border border-neutral-800 bg-[#0a0a0a] px-3 py-1 mb-6 shadow-xl">
                 <span className="text-neutral-500 text-xs font-bold font-mono tracking-widest uppercase">
                    {meta.date ? new Date(meta.date).toLocaleDateString() : 'BLOG POST'}
                 </span>
              </div>
              
              <h1 
                className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.1] max-w-4xl"
                style={{ viewTransitionName: `blog-title-${meta.id}` }}
              >
                {meta.title}
              </h1>
              
              <div className="mt-8 flex items-center gap-4 text-xs font-mono text-neutral-500 uppercase">
                <span>By Daffa Aditya</span>
                <span>•</span>
                <span>{meta.timeToRead || '5'} min read</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 lg:px-20 relative z-10 grid lg:grid-cols-12 gap-12">
             <div className="lg:col-span-8 lg:col-start-3">
               <article>
                 {children}
               </article>
             </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </React.Fragment>
  );
}
