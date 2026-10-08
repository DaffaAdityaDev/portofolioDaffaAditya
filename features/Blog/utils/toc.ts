import type { TocItem } from '@/types/blog';
import { TOC_HEADING_SELECTOR } from '../constants';

/** "Uploading a video" → "uploading-a-video". */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Reads the section headings of an article and gives each one a stable id, so
 * it can be linked to. Ids a post sets itself are kept. Repeated titles get a
 * numbered suffix.
 */
export const collectHeadings = (root: HTMLElement): TocItem[] => {
  const used = new Set<string>();
  const headings = Array.from(root.querySelectorAll<HTMLHeadingElement>(TOC_HEADING_SELECTOR)).filter(
    (heading) => !heading.closest('[data-toc-ignore]'),
  );

  return headings.flatMap((heading) => {
    const text = heading.textContent?.trim() ?? '';
    if (!text) return [];

    if (!heading.id) {
      const base = slugify(text) || 'section';
      let id = base;
      for (let suffix = 2; used.has(id) || document.getElementById(id); suffix += 1) id = `${base}-${suffix}`;
      heading.id = id;
    }
    used.add(heading.id);

    return [{ id: heading.id, text, level: heading.tagName === 'H2' ? 2 : 3 }];
  });
};
