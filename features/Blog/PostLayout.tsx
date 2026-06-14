import React from 'react';
import Head from 'next/head';
import Footer from '@/components/Layout/Footer';
import GridLine from '@/components/ui/GridLine';
import Image from 'next/image';
import { Card, CardBody, Button, Divider } from '@heroui/react';

// --- Empty MDX Components Stub to prevent import breakages ---
export const components = {};

export default function PostLayoutV4({ meta, children }: { meta: any, children: React.ReactNode }) {
  if (!meta) return null;

  return (
    <React.Fragment>
      <Head>
        <title>{`${meta.title} | Daffa Aditya`}</title>
        <meta name="description" content={meta.description} />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        
        <main className="flex-1 relative pt-16">
          <GridLine className="top-0 opacity-30" />
          <GridLine vertical className="left-6 lg:left-20 opacity-30" />
          <GridLine vertical className="right-6 lg:right-20 opacity-30" />

          {/* Hero Section */}
          <div className="relative z-10 w-full flex flex-col items-center">
            {meta.image && (
              <div className="w-full h-[40vh] lg:h-[60vh] relative overflow-hidden border-b border-neutral-800">
                <Image 
                  src={meta.image} 
                  alt={meta.title} 
                  fill
                  priority
                  className="object-cover opacity-60"
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
export { PostLayoutV4 as PostLayout };
