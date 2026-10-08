import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { TocItem } from '@/types/blog';
import { TOC_SCROLL_OFFSET_PX } from '../constants';
import { collectHeadings } from '../utils/toc';

const sameItems = (a: TocItem[], b: TocItem[]): boolean =>
  a.length === b.length && a.every((item, index) => item.id === b[index].id && item.text === b[index].text);

const NO_ITEMS: TocItem[] = [];

/**
 * Tracks the table of contents of the article in `articleRef` and which section
 * the reader is in.
 *
 * `initialItems` is the list built at build time (see `buildPostToc`), so the
 * TOC is in the static HTML and the layout does not move on hydration. The
 * headings only get their ids in the browser, with the same slug rules, so the
 * article is read once its headings have rendered (posts load lazily after a
 * client-side navigation), and then no longer watched. Without `initialItems`
 * the list comes from the DOM alone and follows every change to the article.
 */
export const useTableOfContents = (
  articleRef: RefObject<HTMLElement | null>,
  initialItems: TocItem[] = NO_ITEMS,
) => {
  const [items, setItems] = useState<TocItem[]>(initialItems);
  // True once the headings in the DOM carry their ids.
  const [linked, setLinked] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const jumpedToHash = useRef(false);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = collectHeadings(article);
        // The post has not rendered yet: keep the build-time list until it has.
        if (next.length === 0 || next.length < initialItems.length) return;
        if (initialItems.length > 0) observer.disconnect();

        setItems((current) => (sameItems(current, next) ? current : next));
        setLinked(true);

        // The ids only exist once the post has rendered, so a shared link to a
        // section has to be followed by hand, once.
        const hashId = decodeURIComponent(window.location.hash.slice(1));
        if (!jumpedToHash.current && hashId && next.some((item) => item.id === hashId)) {
          jumpedToHash.current = true;
          document.getElementById(hashId)?.scrollIntoView();
        }
      });
    };

    const observer = new MutationObserver(refresh);
    observer.observe(article, { childList: true, subtree: true });
    refresh();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [articleRef, initialItems]);

  useEffect(() => {
    if (!linked || items.length === 0) return;

    let frame = 0;
    // The active section is the last heading that has scrolled past the navbar.
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current: string | null = null;
        for (const item of items) {
          const heading = document.getElementById(item.id);
          if (heading && heading.getBoundingClientRect().top <= TOC_SCROLL_OFFSET_PX + 8) current = item.id;
          else break;
        }
        setActiveId(current);
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items, linked]);

  const jumpTo = useCallback(
    (id: string) => {
      const heading = document.getElementById(id);
      if (!heading) return;
      heading.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    },
    [reduceMotion],
  );

  return { items, activeId, jumpTo };
};
