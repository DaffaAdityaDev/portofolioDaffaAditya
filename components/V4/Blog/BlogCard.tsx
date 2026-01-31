import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { IBlogProps } from '@/components/types';
import DateComponent from '@/components/Date';

const BlogCard = (props: IBlogProps) => {
  const { id, title, description, date, timeToRead, image } = props;

  return (
    <Link href={`/blog/post/${id}`} className="group block h-full">
      <div className="bg-[#0a0a0a] border border-neutral-800 h-full flex flex-col hover:border-neutral-600 transition-colors">
        {/* Image Container */}
        <div className="aspect-video w-full overflow-hidden border-b border-neutral-800 relative">
          <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100 relative z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60 z-20" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Meta */}
          <div className="flex items-center gap-4 mb-4 text-xs font-mono text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              <DateComponent dateString={date} />
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>{timeToRead} min read</span>
            </div>
          </div>

          {/* Title & Desc */}
          <h3 className="text-xl font-bold font-mono text-white mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
            {description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-2 text-xs font-mono text-white group-hover:gap-4 transition-all">
            READ_ARTICLE <ArrowRight size={14} className="text-red-500" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
