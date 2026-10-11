import { createElement, type ComponentType } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import type { TocItem } from '@/types/blog';
import { slugify } from './toc';

// Server only: imported from getStaticProps, so it never reaches the browser bundle.

/** A post that takes longer than this to render gets no static TOC, and the client builds it instead. */
const RENDER_TIMEOUT_MS = 10_000;

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

// A comment, a script or style with its body, a tag (closing flag, name, attributes), or a run of text.
const TOKEN = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>|<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|[^<]+/g;
const ID_ATTR = /(?:^|\s)id="([^"]*)"/;
const IGNORE_ATTR = /(?:^|\s)data-toc-ignore(?=[\s=/]|$)/;

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

const decodeEntities = (text: string): string =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] !== '#') return ENTITIES[entity.toLowerCase()] ?? match;
    const code = entity[1] === 'x' || entity[1] === 'X' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
    return String.fromCodePoint(code);
  });

/**
 * Reads the h2/h3 headings out of rendered post HTML with the same rules as
 * `collectHeadings` in the browser: ids a post sets itself are kept, the rest are
 * slugs of the heading text with a numbered suffix when taken, and anything inside
 * [data-toc-ignore] is skipped. The browser then gives the headings the same ids.
 */
export const extractToc = (html: string): TocItem[] => {
  // The browser checks `document.getElementById`, so every id already in the post counts as taken.
  const taken = new Set<string>();
  for (const match of html.matchAll(/<[a-zA-Z][^>]*?\sid="([^"]*)"/g)) taken.add(decodeEntities(match[1]));

  const items: TocItem[] = [];
  const used = new Set<string>();
  // One entry per open element: whether it sits inside [data-toc-ignore].
  const ignoredStack: boolean[] = [];
  let heading: { tag: string; depth: number; id?: string; text: string } | null = null;

  for (const [token, rawBody, closing, rawTag, attrs = ''] of html.matchAll(TOKEN)) {
    if (token.startsWith('<!--') || rawBody) continue;

    if (!rawTag) {
      if (heading) heading.text += decodeEntities(token);
      continue;
    }

    const tag = rawTag.toLowerCase();
    if (closing) {
      if (heading && tag === heading.tag && ignoredStack.length === heading.depth) {
        const text = heading.text.trim();
        if (text) {
          let id = heading.id;
          if (!id) {
            const base = slugify(text) || 'section';
            id = base;
            for (let suffix = 2; used.has(id) || taken.has(id); suffix += 1) id = `${base}-${suffix}`;
          }
          used.add(id);
          items.push({ id, text, level: tag === 'h2' ? 2 : 3 });
        }
        heading = null;
      }
      ignoredStack.pop();
      continue;
    }

    const ignored = (ignoredStack[ignoredStack.length - 1] ?? false) || IGNORE_ATTR.test(attrs);
    const selfClosing = VOID_TAGS.has(tag) || attrs.trimEnd().endsWith('/');
    if (!heading && !ignored && !selfClosing && (tag === 'h2' || tag === 'h3')) {
      const presetId = attrs.match(ID_ATTR)?.[1];
      heading = { tag, depth: ignoredStack.length + 1, id: presetId ? decodeEntities(presetId) : undefined, text: '' };
    }
    if (!selfClosing) ignoredStack.push(ignored);
  }

  return items;
};

/**
 * Renders a post once at build time and returns its table of contents, so the
 * page can lay out the TOC column in the static HTML. Returns [] if the post
 * fails to render, and the client falls back to reading the headings itself.
 */
export const buildPostToc = async (Post: ComponentType): Promise<TocItem[]> => {
  try {
    const { prelude } = await prerenderToNodeStream(createElement(Post), {
      signal: AbortSignal.timeout(RENDER_TIMEOUT_MS),
    });
    const decoder = new TextDecoder();
    let html = '';
    for await (const chunk of prelude) {
      if (typeof chunk === 'string') {
        html += chunk;
      } else if (chunk instanceof Uint8Array) {
        html += decoder.decode(chunk, { stream: true });
      }
    }
    html += decoder.decode();
    return extractToc(html);
  } catch (error) {
    console.warn('[blog] Could not build the table of contents at build time:', error);
    return [];
  }
};
