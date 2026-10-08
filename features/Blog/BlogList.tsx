import React from 'react';
import { useRouter } from 'next/router';
import BlogCard from './BlogCard';
import type { BlogCategory, IBlogProps } from '@/types/blog';
import GridLine from '@/components/ui/GridLine';
import { BLOG_CATEGORIES } from './constants';

interface BlogListProps {
  posts: IBlogProps[];
}

type CategoryFilter = BlogCategory | 'all';

const isCategory = (value: unknown): value is BlogCategory =>
  BLOG_CATEGORIES.some(({ id }) => id === value);

const BlogList = ({ posts }: BlogListProps) => {
  const router = useRouter();
  // The filter lives in the URL (?category=tech), so a filtered list can be shared.
  const active: CategoryFilter = isCategory(router.query.category) ? router.query.category : 'all';
  const visible = active === 'all' ? posts : posts.filter((post) => post.category === active);

  const filters: { id: CategoryFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: posts.length },
    ...BLOG_CATEGORIES.map(({ id, label }) => ({
      id,
      label,
      count: posts.filter((post) => post.category === id).length,
    })),
  ];

  const select = (id: CategoryFilter) => {
    const query = id === 'all' ? {} : { category: id };
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
  };

  return (
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
              className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-500 ${
                isActive
                  ? 'border-red-900/60 bg-red-900/20 text-red-500'
                  : 'border-neutral-800 bg-[#0a0a0a] text-neutral-500 hover:border-neutral-600 hover:text-white'
              }`}
            >
              <span>{label}</span>
              <span className={isActive ? 'text-red-500/70' : 'text-neutral-500'}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Posts Grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {visible.map((post, index) => (
            <BlogCard key={post.id} {...post} priority={index === 0} />
          ))}
        </div>
      ) : (
        <p className="relative z-10 font-mono text-sm text-neutral-500">// No posts in this category yet.</p>
      )}
    </section>
  );
};

export default BlogList;
