import type { LucideIcon } from 'lucide-react';
import type { ReactNode, Ref } from 'react';

/** Groups on the blog page. Labels and order live in BLOG_CATEGORIES (features/Blog/constants.ts). */
export type BlogCategory = 'system-design' | 'tech' | 'blog';

/** One post's metadata, as listed in POSTS_DATA (features/Blog/constants.ts). */
export interface PostData {
  /** Public URL slug, kebab-case: /blog/post/<id>. */
  id: string;
  category: BlogCategory;
  /** Page h1 and card title. */
  title: string;
  /** Shorter <title> for search results when `title` runs past ~45 characters (the site suffix adds 15). */
  seoTitle?: string;
  /** Imperative, at most ~155 characters: the meta description and the card text. */
  description: string;
  /** Published, YYYY-MM-DD. */
  date: string;
  /** Last meaningful content update, YYYY-MM-DD. */
  updated?: string;
  timeToRead: number;
  /** 16:9 thumbnail, used by the blog card. */
  image: string;
  /** Text-free variant for the post hero, where the page renders its own title. Falls back to `image`. */
  heroImage?: string;
  /** 1200x630 link preview (Open Graph / Twitter). Falls back to `image`. */
  ogImage?: string;
  /** False keeps a draft out of the list, the sitemap and the build. Defaults to true. */
  production?: boolean;
}

/** What the blog list needs from a post. */
export type PostSummary = Pick<PostData, 'id' | 'category' | 'image' | 'title' | 'description' | 'date' | 'updated' | 'timeToRead'>;

export interface CustomImageProps {
  src: string;
  alt: string;
}

export interface CodeBlockProps {
  children: string;
  /** Legacy language hook, e.g. `language-javascript`. Prefer `language`. */
  className?: string;
  language?: string;
  /** Filename or caption shown in the header, e.g. `pages/blog.jsx`. */
  title?: string;
  /** Defaults to on once the snippet reaches `CODE_LINE_NUMBER_MIN_LINES`. */
  lineNumbers?: boolean;
  /** 1-based line spec, e.g. `2,4-6`. */
  highlight?: string;
  /** Lines marked as added in a diff, same spec as `highlight`. */
  added?: string;
  /** Lines marked as removed in a diff, same spec as `highlight`. */
  removed?: string;
  /** Collapse long snippets behind a "show more" bar. Defaults to true. */
  collapsible?: boolean;
  /** Start with long lines wrapped instead of scrolling horizontally. */
  wrap?: boolean;
}

export interface CodeSegment {
  text: string;
  /** Prism token type followed by its aliases, innermost token only. */
  types: string[];
}

export type CodeLine = CodeSegment[];

export type CodeLineMark = 'highlight' | 'added' | 'removed';

export interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}

export type PlaygroundTemplate = 'react' | 'react-ts';

export interface ReactPlaygroundProps {
  /** Single-file shorthand, becomes the entry file (`/App.js` or `/App.tsx`). */
  children?: string;
  /** Multi-file project keyed by path, e.g. `{ '/App.js': '...', '/Button.js': '...' }`. */
  files?: Record<string, string>;
  title?: string;
  template?: PlaygroundTemplate;
  /**
   * Ignored. The preview runs on this site with no package registry, so only
   * `react` and `react-dom` can be imported. Kept so older posts still compile.
   */
  dependencies?: Record<string, string>;
  /** Height of the editor and preview panes in px. */
  height?: number;
  showConsole?: boolean;
  /** File to open first. Defaults to the entry file. */
  activeFile?: string;
}

export type PlaygroundConsoleLevel = 'log' | 'info' | 'warn' | 'error';

/** A failed run: `compile` for a syntax error, `runtime` for anything thrown while running. */
export interface PlaygroundErrorInfo {
  kind: 'compile' | 'runtime';
  message: string;
  /** Playground path, e.g. `/App.tsx`, when the error could be traced to a file. */
  file?: string;
  /** 1-based. */
  line?: number;
  column?: number;
  /** A few source lines around `line`, with a marker on the failing one. */
  frame?: string;
}

/** Messages the post page sends into the preview iframe. */
export type PlaygroundHostMessage =
  | { source: 'playground-host'; type: 'run'; runId: number; entry: string; files: Record<string, string> }
  | { source: 'playground-host'; type: 'ping' };

/** Messages the preview iframe sends back to the post page. */
export type PlaygroundRuntimeMessage =
  | { source: 'playground-runtime'; type: 'ready' }
  | { source: 'playground-runtime'; type: 'pong' }
  | { source: 'playground-runtime'; type: 'rendered'; runId: number }
  | { source: 'playground-runtime'; type: 'error'; runId: number; error: PlaygroundErrorInfo }
  | { source: 'playground-runtime'; type: 'console'; level: PlaygroundConsoleLevel; text: string };

/**
 * - `loading`: the iframe has not said it is ready yet.
 * - `running`: code was sent and has not rendered yet.
 * - `unresponsive`: the iframe stopped answering pings, usually an endless loop.
 */
export type PlaygroundStatus = 'loading' | 'running' | 'ready' | 'error' | 'unresponsive';

export interface PlaygroundConsoleEntry {
  id: number;
  level: PlaygroundConsoleLevel;
  text: string;
}

/** Replace `start..end` with `text`, then select `selectionStart..selectionEnd`. */
export interface PlaygroundTextEdit {
  start: number;
  end: number;
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

export interface PlaygroundEditorProps {
  /** Playground path of the open file, used for the label and the grammar. */
  path: string;
  value: string;
  onChange: (value: string) => void;
}

export interface PlaygroundFileTabsProps {
  paths: string[];
  activePath: string;
  onSelect: (path: string) => void;
  /** Id of the editor panel the tabs control. */
  panelId: string;
}

export interface PlaygroundPreviewProps {
  iframeRef: Ref<HTMLIFrameElement>;
  /** Changes on every reload, so React swaps in a fresh iframe. */
  frameKey: number;
  status: PlaygroundStatus;
  /** True once the current iframe has answered at least once. */
  hasLoaded: boolean;
  /** A replacement frame could not start either. Only reloading the page helps. */
  needsPageReload: boolean;
  height: number;
  onReload: () => void;
  onReset: () => void;
}

export interface PlaygroundConsoleProps {
  entries: PlaygroundConsoleEntry[];
  onClear: () => void;
}

/** One heading of a post, as listed in the table of contents. */
export interface TocItem {
  id: string;
  text: string;
  /** 2 for a section, 3 for a subsection. */
  level: 2 | 3;
}

export interface TableOfContentsProps {
  items: TocItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export type CalloutVariant = 'note' | 'tip' | 'warning';

export interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

export interface RevealProps {
  children: ReactNode;
  className?: string;
}

export interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
  className?: string;
}

export interface ResultTileProps {
  label: string;
  value: number;
  format: (value: number) => string;
  hint: string;
  accent?: boolean;
}

export interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

export interface WidgetFrameProps {
  title: string;
  icon: LucideIcon;
  /** Lets a widget observe whether its frame is on screen. */
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
}
