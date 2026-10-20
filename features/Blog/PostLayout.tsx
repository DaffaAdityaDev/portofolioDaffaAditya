import React, { useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import Seo from '@/components/Seo';
// Below the fold: static HTML, JS loaded as the page nears the bottom.
import Footer from '@/components/Layout/LazyFooter';
import GridLine from '@/components/ui/GridLine';
import Container from '@/components/ui/Container';
import BackLink from '@/components/ui/BackLink';
import PageTitle from '@/components/ui/PageTitle';
import DateComponent from '@/components/ui/Date';
import type { PostData, TocItem } from '@/types/blog';
import { siteConfig } from '@/config/metadata.config';
import { TocSheet, TocSidebar } from './components/TableOfContents';
import { BLOG_CATEGORY_LABELS, TOC_MIN_ITEMS } from './constants';
import { chipClasses } from '@/components/ui/chip';
import { useTableOfContents } from './hooks/useTableOfContents';

/** The hero fills the viewport width. */
const HERO_SIZES = '100vw';

/**
 * Every blog hero and banner is 1280px wide with a 640px copy next to it
 * (`hero.webp` and `hero-640.webp`). Other images get no srcset.
 */
const blogImageSrcSet = (src: string): string | undefined =>
  /^\/image\/blogs\/.+\.webp$/.test(src) ? `${src.replace(/\.webp$/, '-640.webp')} 640w, ${src} 1280w` : undefined;

interface PostLayoutProps {
  meta: PostData;
  /** Table of contents built at build time, so the TOC column is in the static HTML. */
  toc?: TocItem[];
  children: React.ReactNode;
}

export default function PostLayout({ meta, toc: initialToc, children }: PostLayoutProps) {
  const articleRef = useRef<HTMLElement>(null);
  const toc = useTableOfContents(articleRef, initialToc);
  const showToc = toc.items.length >= TOC_MIN_ITEMS;

  if (!meta) return null;

  const pageTitle = meta.seoTitle ?? meta.title;
  const heroImage = meta.heroImage ?? meta.image;
  const heroSrcSet = heroImage ? blogImageSrcSet(heroImage) : undefined;
  const path = `/blog/post/${meta.id}`;
  const shareImage = meta.ogImage ?? meta.image;

  return (
    <React.Fragment>
      <Seo
        path={path}
        title={pageTitle}
        description={meta.description}
        // og.jpg is cut to 1200x630; the 16:9 banner fallback has no fixed size to declare.
        image={meta.ogImage ? { src: meta.ogImage, width: 1200, height: 630 } : shareImage}
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
          dateModified: meta.updated ?? meta.date,
          url: `${siteConfig.url}${path}`,
          mainEntityOfPage: `${siteConfig.url}${path}`,
          author: { '@type': 'Person', name: siteConfig.title, url: siteConfig.url },
        }}
      />

      <div className="min-h-screen bg-background text-white font-sans selection:bg-red-600 selection:text-white flex flex-col">
        
        <main className="flex-1 relative pt-16">
          <GridLine className="top-0 opacity-30" />
          <GridLine vertical className="left-6 lg:left-20 opacity-30" />
          <GridLine vertical className="right-6 lg:right-20 opacity-30" />

          {/* Hero Section */}
          <div className="relative z-10 w-full flex flex-col items-center">
            {heroImage && (
              <div className="w-full h-[40vh] lg:h-[60vh] relative overflow-hidden border-b border-border">
                <img
                  src={heroImage}
                  srcSet={heroSrcSet}
                  sizes={heroSrcSet ? HERO_SIZES : undefined}
                  // Decorative: dimmed behind the h1, which already carries the title.
                  alt=""
                  width={1280}
                  height={720}
                  // React hoists a matching <link rel=preload imageSrcSet> into <head> for a high-priority <img>.
                  fetchPriority="high"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  style={{ viewTransitionName: `blog-image-${meta.id}` }}
                />
                <div 
                  className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent z-10"
                />
              </div>
            )}
            
            {/* px-6: the content clears the mobile GridLines (left-6/right-6). */}
            <Container className={cn('px-6 pb-12 max-w-6xl relative z-20', heroImage ? '-mt-32' : 'pt-20')}>
              <BackLink href="/blog" className="mb-6">
                All posts
              </BackLink>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {meta.category && (
                  <Link
                    href={`/blog?category=${meta.category}`}
                    className={chipClasses({ tone: 'accent', className: 'shadow-xl hover:bg-red-900/20 transition-colors' })}
                  >
                    {BLOG_CATEGORY_LABELS[meta.category]}
                  </Link>
                )}
                <div className={chipClasses({ className: 'shadow-xl' })}>
                  <DateComponent dateString={meta.date} />
                </div>
                {meta.updated && (
                  <div className={chipClasses({ className: 'shadow-xl' })}>
                    <span>
                      Updated <DateComponent dateString={meta.updated} />
                    </span>
                  </div>
                )}
              </div>
              
              <PageTitle size="lg" className="max-w-4xl md:text-5xl lg:text-6xl leading-[1.1]">
                <span className="block" style={{ viewTransitionName: `blog-title-${meta.id}` }}>{meta.title}</span>
              </PageTitle>
              
              <div className="mt-8 flex items-center gap-4 text-xs font-mono text-neutral-500 uppercase">
                <span>By Daffa Aditya</span>
                <span>•</span>
                <span>{meta.timeToRead} min read</span>
              </div>
            </Container>
          </div>

          {/* Content: full width between the GridLines, not the page measure. */}
          <Container className="px-6 max-w-none relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
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
          </Container>
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
export { PostLayout };
