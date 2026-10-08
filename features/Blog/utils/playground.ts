import type { ReactPlaygroundProps } from '@/types/blog';
import { PLAYGROUND_GRAMMARS } from '../constants';
import { normalizeCode } from './code';

/** Playground paths always start with `/`, e.g. `/App.tsx`. */
export function toPlaygroundPath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Builds the playground file map from the `files` prop, or from the single-file
 * `children` shorthand. Paths are normalized to start with `/`.
 */
export function buildPlaygroundFiles(
  { files, children }: Pick<ReactPlaygroundProps, 'files' | 'children'>,
  entryFile: string,
): Record<string, string> {
  if (files && Object.keys(files).length > 0) {
    return Object.fromEntries(
      Object.entries(files).map(([path, code]) => [toPlaygroundPath(path), normalizeCode(code)]),
    );
  }

  return children ? { [entryFile]: normalizeCode(children) } : {};
}

/** Prism grammar for a playground file, from its extension. */
export function grammarForPath(path: string): string {
  const extension = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
  return PLAYGROUND_GRAMMARS[extension] ?? 'plain';
}

/** Tab label: the path without its leading slash. */
export function fileLabel(path: string): string {
  return path.replace(/^\//, '');
}
