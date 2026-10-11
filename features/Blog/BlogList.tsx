import React from 'react';
import { useRouter } from 'next/router';
import { m, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion';
import BlogCard from './BlogCard';
import type { BlogCategory, IBlogProps } from '@/types/blog';
import GridLine from '@/components/ui/GridLine';
import { BLOG_CATEGORIES } from './constants';
import { SPRING_SNAPPY } from '@/constant/animations';

interface BlogListProps {
  posts: IBlogProps[];
}

type CategoryFilter = BlogCategory | 'all';

const isCategory = (value: unknown): value is BlogCategory =>
  BLOG_CATEGORIES.some(({ id }) => id === value);

const BlogList = ({ posts }: BlogListProps) => {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  // The filter lives in the URL (?category=tech), so a filtered list can be shared.
  const active: CategoryFilter = isCategory(router.query.category) ? router.query.category : 'all';
  const visible = React.useMemo(() => {
    return active === 'all' ? posts : posts.filter((post) => post.category === active);
  }, [posts, active]);

  const filters = React.useMemo<{ id: CategoryFilter; label: string; count: number }[]>(() => {
    return [
      { id: 'all', label: 'All', count: posts.length },
      ...BLOG_CATEGORIES.map(({ id, label }) => ({
        id,
        label,
        count: posts.filter((post) => post.category === id).length,
      })),
    ];
  }, [posts]);

  const select = (id: CategoryFilter) => {
    const query = id === 'all' ? {} : { category: id };
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
  };

  return (
    <LayoutGroup id="blog-filter-group">
      <section className="relative py-20 px-6 lg:px-20 min-h-screen bg-[#0a0a0a]">
        {/* Grid Lines */}
        <GridLine className="top-0 opacity-30" />
        <GridLine vertical className="left-6 lg:left-20 opacity-30" />
        <GridLine vertical className="right-6 lg:right-20 opacity-30" />

        {/* Header */}
        <div className="mb-12 relative z-10">
          <div className="inline-block border border-red-900/50 bg-red-900/10 px-3 py-1 mb-4">
            <span className="text-red-500 text-xs font-bold font-mono tracking-widest uppercase">Writing</span>
          </div>
          <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-6">
            Engineering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-white">Thoughts.</span>
          </h1>
          <p className="max-w-xl text-neutral-400 font-mono text-sm lg:text-base border-l border-neutral-800 pl-6">
            // Insights on software architecture, performance, and reliable system design.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-10 relative z-10 flex flex-wrap gap-2" role="group" aria-label="Filter posts by category">
          {filters.map(({ id, label, count }) => {
            const isActive = id === active;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={isActive}
                onClick={() => select(id)}
                className={`relative inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-500 ${
                  isActive
                    ? 'border-red-600/70 text-white'
                    : 'border-neutral-800 bg-[#0a0a0a] text-neutral-500 hover:border-neutral-600 hover:text-white'
                }`}
              >
                {isActive && (
                  <m.div
                    layoutId="blog-filter-active-pill"
                    transition={shouldReduceMotion ? { duration: 0 } : SPRING_SNAPPY}
                    className="absolute inset-0 bg-red-950/40 border border-red-500/50 -z-10"
                  />
                )}
                <span>{label}</span>
                <span className={isActive ? 'text-red-400 font-semibold' : 'text-neutral-500'}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Posts Grid */}
        {visible.length > 0 ? (
          <m.div
            layout={!shouldReduceMotion}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((post, index) => (
                <m.div
                  key={post.id}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: -10 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.25,
                          ease: [0.16, 1, 0.3, 1],
                          layout: SPRING_SNAPPY,
                        }
                  }
                  className="h-full"
                >
                  <BlogCard {...post} priority={index === 0} />
                </m.div>
              ))}
            </AnimatePresence>
          </m.div>
        ) : (
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 font-mono text-sm text-neutral-500"
          >
            // No posts in this category yet.
          </m.p>
        )}
      </section>
    </LayoutGroup>
  );
};

export default BlogList;
