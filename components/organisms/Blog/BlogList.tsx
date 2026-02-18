import React from 'react';
import BlogCard from './BlogCard';
import { IBlogProps } from '@/components/atoms/types';
import GridLine from '@/components/atoms/GridLine';

interface BlogListProps {
  posts: IBlogProps[];
}

const BlogList = ({ posts }: BlogListProps) => {
  return (
    <section className="relative py-20 px-6 lg:px-20 min-h-screen bg-[#0a0a0a]">
      {/* Grid Lines */}
      <GridLine className="top-0 opacity-30" />
      <GridLine vertical className="left-6 lg:left-20 opacity-30" />
      <GridLine vertical className="right-6 lg:right-20 opacity-30" />

      {/* Header */}
      <div className="mb-16 relative z-10">
        <div className="inline-block border border-red-900/50 bg-red-900/10 px-3 py-1 mb-4">
          <span className="text-red-500 text-xs font-bold font-mono tracking-widest uppercase">Writing</span>
        </div>
        <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-6">
          Engineering <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-white">Thoughts.</span>
        </h1>
        <p className="max-w-xl text-neutral-400 font-mono text-sm lg:text-base border-l border-neutral-800 pl-6">
          // Insights on software architecture, frontend performance, and reliable system design.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {posts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
    </section>
  );
};

export default BlogList;
