import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import Seo from '@/components/Seo';
import GridLine from '@/components/ui/GridLine';
import DateComponent from '@/components/ui/Date';
import type { BlogPostMeta, TocItem } from '@/types/blog';
import { siteConfig } from '@/config/metadata.config';
import { TocSheet, TocSidebar } from './components/TableOfContents';
import { BLOG_CATEGORY_LABELS, TOC_MIN_ITEMS } from './constants';
import { useTableOfContents } from './hooks/useTableOfContents';

const Footer = dynamic(() => import('@/components/Layout/Footer'), { ssr: true });

// --- Empty MDX Components Stub to prevent import breakages ---
export const components = {};

/** The hero fills the viewport width. */
const HERO_SIZES = '100vw';

/**
 * Every blog hero and banner is 1280px wide with a 640px copy next to it
 * (`hero.webp` and `hero-640.webp`). Other images get no srcset.
 */
const blogImageSrcSet = (src: string): string | undefined =>
  /^\/image\/blogs\/.+\.webp$/.test(src) ? `${src.replace(/\.webp$/, '-640.webp')} 640w, ${src} 1280w` : undefined;

interface PostLayoutProps {
  meta: BlogPostMeta;
  /** Table of contents built at build time, so the TOC column is in the static HTML. */
  toc?: TocItem[];
  children: React.ReactNode;
}

export default function PostLayoutV4({ meta, toc: initialToc, children }: PostLayoutProps) {
  const articleRef = useRef<HTMLElement>(null);
  const toc = useTableOfContents(articleRef, initialToc);
  const showToc = toc.items.length >= TOC_MIN_ITEMS;

  if (!meta) return null;

  const pageTitle = `${meta.title} | Daffa Aditya`;
  const heroImage = meta.heroImage ?? meta.image;
  const heroSrcSet = heroImage ? blogImageSrcSet(heroImage) : undefined;
  const path = meta.id ? `/blog/post/${meta.id}` : '/blog';
  const shareImage = meta.ogImage ?? meta.image ?? siteConfig.ogImage;

  return (
    <React.Fragment>
      <Seo
        path={path}
        title={pageTitle}
        description={meta.description}
        image={shareImage}
        type="article"
        publishedTime={meta.date}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: meta.title,
          description: meta.description,
          // Crawlers need absolute URLs.
          image: `${siteConfig.url}${shareImage}`,
          datePublished: meta.date,
          url: `${siteConfig.url}${path}`,
          mainEntityOfPage: `${siteConfig.url}${path}`,
          author: { '@type': 'Person', name: siteConfig.title, url: siteConfig.url },
        }}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        
        <main className="flex-1 relative pt-16">
          <GridLine className="top-0 opacity-30" />
          <GridLine vertical className="left-6 lg:left-20 opacity-30" />
          <GridLine vertical className="right-6 lg:right-20 opacity-30" />

          {/* Hero Section */}
          <div className="relative z-10 w-full flex flex-col items-center">
            {heroImage && (
              <div className="w-full h-[40vh] lg:h-[60vh] relative overflow-hidden border-b border-neutral-800">
                <img
                  src={heroImage}
                  srcSet={heroSrcSet}
                  sizes={heroSrcSet ? HERO_SIZES : undefined}
                  alt={meta.title}
                  width={1280}
                  height={720}
                  // React hoists a matching <link rel=preload imageSrcSet> into <head> for a high-priority <img>.
                  fetchPriority="high"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  style={meta.id ? { viewTransitionName: `blog-image-${meta.id}` } : undefined}
                />
                <div 
                  className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10"
                />
              </div>
            )}
            
            <div className={`px-6 lg:px-20 pb-12 w-full max-w-6xl relative z-20 ${heroImage ? '-mt-32' : 'py-20'}`}>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {meta.category && (
                  <Link
                    href={`/blog?category=${meta.category}`}
                    className="inline-block border border-red-900/50 bg-red-900/10 px-3 py-1 shadow-xl text-red-500 text-xs font-bold font-mono tracking-widest uppercase hover:bg-red-900/20 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-500"
                  >
                    {BLOG_CATEGORY_LABELS[meta.category]}
                  </Link>
                )}
                <div className="inline-block border border-neutral-800 bg-[#0a0a0a] px-3 py-1 shadow-xl">
                  <span className="text-neutral-500 text-xs font-bold font-mono tracking-widest uppercase">
                    {meta.date ? <DateComponent dateString={meta.date} /> : 'BLOG POST'}
                  </span>
                </div>
              </div>
              
              <h1 
                className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.1] max-w-4xl"
                style={meta.id ? { viewTransitionName: `blog-title-${meta.id}` } : undefined}
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
          <div className="px-6 lg:px-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className={cn('min-w-0 lg:col-span-8 lg:col-start-3', showToc && 'xl:col-start-2')}>
               <article ref={articleRef}>
                 {children}
               </article>
             </div>
             {showToc && (
               <aside className="hidden xl:col-span-3 xl:block">
                 <TocSidebar items={toc.items} activeId={toc.activeId} onSelect={toc.jumpTo} />
               </aside>
             )}
          </div>
        </main>
        
        {showToc && (
          <div className="xl:hidden">
            <TocSheet items={toc.items} activeId={toc.activeId} onSelect={toc.jumpTo} />
          </div>
        )}

        <Footer />
      </div>
    </React.Fragment>
  );
}
export { PostLayoutV4 as PostLayout };
