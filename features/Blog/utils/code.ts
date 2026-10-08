import type { TokenStream } from 'prismjs';
import type { CodeLine, CodeLineMark } from '@/types/blog';
import {
  CODE_DEFAULT_LANGUAGE,
  CODE_JSX_PATTERN,
  CODE_LANGUAGE_ALIASES,
  CODE_LINE_RANGE_LIMIT,
} from '../constants';

/** Drops leading blank lines and trailing whitespace, keeps the first line's indentation. */
export function normalizeCode(raw: string): string {
  return raw.replace(/^\s*\n/, '').trimEnd();
}

/** Language from the `language` prop, else a legacy `language-xxx` class, else plain text. */
export function resolveLanguage(language?: string, className?: string): string {
  const fromClass = className?.match(/language-([\w-]+)/)?.[1];
  const raw = (language ?? fromClass ?? CODE_DEFAULT_LANGUAGE).toLowerCase();
  return CODE_LANGUAGE_ALIASES[raw] ?? raw;
}

/** Grammar to highlight with. Plain JS that contains JSX needs the JSX grammar. */
export function resolveGrammar(language: string, code: string): string {
  return language === 'javascript' && CODE_JSX_PATTERN.test(code) ? 'jsx' : language;
}

/** Parses a 1-based line spec like `2,4-6` into a set of line numbers. */
export function parseLineRanges(spec: string | undefined, maxLine: number): Set<number> {
  const lines = new Set<number>();
  if (!spec) return lines;

  spec.split(',').forEach((part) => {
    const [startRaw, endRaw] = part.trim().split('-');
    const start = Number.parseInt(startRaw, 10);
    const end = endRaw === undefined ? start : Number.parseInt(endRaw, 10);
    if (Number.isNaN(start) || Number.isNaN(end)) return;

    const last = Math.min(Math.max(start, end), maxLine, CODE_LINE_RANGE_LIMIT);
    for (let line = Math.max(Math.min(start, end), 1); line <= last; line++) {
      lines.add(line);
    }
  });

  return lines;
}

interface LineMarkSets {
  highlight: Set<number>;
  added: Set<number>;
  removed: Set<number>;
}

/** Diff marks win over a plain highlight when a line is in several sets. */
export function getLineMark(line: number, sets: LineMarkSets): CodeLineMark | undefined {
  if (sets.added.has(line)) return 'added';
  if (sets.removed.has(line)) return 'removed';
  if (sets.highlight.has(line)) return 'highlight';
  return undefined;
}

function appendText(lines: CodeLine[], text: string, types: string[]): void {
  text.split('\n').forEach((part, index) => {
    if (index > 0) lines.push([]);
    if (part) lines[lines.length - 1].push({ text: part, types });
  });
}

function walkTokens(stream: TokenStream, types: string[], lines: CodeLine[]): void {
  if (typeof stream === 'string') {
    appendText(lines, stream, types);
    return;
  }

  if (Array.isArray(stream)) {
    stream.forEach((child) => walkTokens(child, types, lines));
    return;
  }

  // Innermost token wins, so `${}` punctuation inside a template string stays punctuation.
  const aliases = Array.isArray(stream.alias) ? stream.alias : stream.alias ? [stream.alias] : [];
  walkTokens(stream.content, [stream.type, ...aliases], lines);
}

/**
 * Flattens a Prism token tree into one segment list per line. Tokens that span
 * several lines (block comments, template strings) are split at each newline, so
 * every line can be rendered, numbered, and highlighted on its own.
 */
export function flattenTokens(stream: TokenStream): CodeLine[] {
  const lines: CodeLine[] = [[]];
  walkTokens(stream, [], lines);
  return lines;
}
