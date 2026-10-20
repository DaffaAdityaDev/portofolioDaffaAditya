import React from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import type { PostSummary } from '@/types/blog';
import DateComponent from '@/components/ui/Date';
import { BLOG_CATEGORY_LABELS } from './constants';
import { chipClasses } from '@/components/ui/chip';
import Link from 'next/link';
import { useRouter } from 'next/router';

/** Each banner ships with a 640px wide copy next to it: banner.webp and banner-640.webp. */
const SMALL_IMAGE_WIDTH = 640;
const IMAGE_WIDTH = 1280;
/** Card width in the 1, 2 and 3 column grid of BlogList. */
const IMAGE_SIZES = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';

const smallVariant = (src: string) => src.replace(/(\.\w+)$/, `-${SMALL_IMAGE_WIDTH}$1`);

interface BlogCardProps extends PostSummary {
  /** First card on the page: load its image eagerly, as it is likely the LCP element. */
  priority?: boolean;
}

const BlogCard = ({ priority = false, ...props }: BlogCardProps) => {
  const { id, category, title, description, date, timeToRead, image } = props;
  const router = useRouter();
  const targetUrl = `/blog/post/${id}`;

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle new-tab and other modified clicks.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Without View Transitions, next/link navigates as usual.
    const doc = document as Document & {
      startViewTransition?: (cb: () => Promise<unknown>) => unknown;
    };
    if (!doc.startViewTransition) return;
    // Under reduced motion, skip the morph and navigate without it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    e.preventDefault();
    // Returning the promise keeps the old snapshot until the new page has rendered.
    doc.startViewTransition(() => router.push(targetUrl));
  };

  return (
    <Link href={targetUrl} onClick={handleNavigate} className="group block h-full">
      <div className="bg-background border border-border rounded-lg overflow-hidden h-full flex flex-col hover:border-neutral-600 transition-colors">
        {/* Image Container */}
        <div className="aspect-video w-full overflow-hidden border-b border-border relative">
          <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
          <img
            src={image}
            srcSet={`${smallVariant(image)} ${SMALL_IMAGE_WIDTH}w, ${image} ${IMAGE_WIDTH}w`}
            sizes={IMAGE_SIZES}
            alt={title}
            width={IMAGE_WIDTH}
            height={720}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding={priority ? undefined : 'async'}
            className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100 relative z-10"
            style={{ viewTransitionName: `blog-image-${id}` }}
          />
          <div 
            className="absolute inset-0 bg-linear-to-t from-background to-transparent opacity-60 z-20" 
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs font-mono text-neutral-500">
            <span className={chipClasses({ tone: 'accent', className: 'px-2 py-0.5 text-2xs' })}>
              {BLOG_CATEGORY_LABELS[category]}
            </span>
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
          <h2 
            className="text-xl font-bold tracking-tight text-white mb-3 group-hover:text-accent-brand transition-colors line-clamp-2"
            style={{ viewTransitionName: `blog-title-${id}` }}
          >
            {title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
            {description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white group-hover:gap-4 transition-all">
            Read article <ArrowRight size={14} className="text-accent-brand" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
