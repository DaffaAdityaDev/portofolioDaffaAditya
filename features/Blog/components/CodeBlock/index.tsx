import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, FileCode2, TriangleAlert, WrapText } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/utils/cn';
import type { CodeBlockProps, CodeLine, CodeLineMark } from '@/types/blog';
import {
  CODE_COLLAPSED_VISIBLE_LINES,
  CODE_COLLAPSE_MIN_LINES,
  CODE_COPY_FEEDBACK_MS,
  CODE_LANGUAGE_LABELS,
  CODE_LINE_NUMBER_MIN_LINES,
} from '../../constants';
import {
  flattenTokens,
  getLineMark,
  normalizeCode,
  parseLineRanges,
  resolveGrammar,
  resolveLanguage,
} from '../../utils/code';
import ToolbarButton from '../ToolbarButton';

/** Highlighting starts a little before the block scrolls into view. */
const HIGHLIGHT_ROOT_MARGIN = '200px 0px';

/**
 * Unhighlighted lines, one plain segment per line. The line count matches what
 * `flattenTokens` produces, so swapping in the highlighted version keeps the same box.
 */
function plainLines(code: string): CodeLine[] {
  return code.split('\n').map((text) => (text ? [{ text, types: [] }] : []));
}

/**
 * Prism tokens for `code`, computed only once the element nears the viewport. Prism
 * loads with a dynamic import, so it stays out of the post bundle and the static HTML
 * carries the plain code text. Returns undefined until the highlighted lines are ready.
 */
function useDeferredHighlight(
  ref: React.RefObject<HTMLElement | null>,
  code: string,
  grammar: string,
): CodeLine[] | undefined {
  const [result, setResult] = useState<{ code: string; grammar: string; lines: CodeLine[] }>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let cancelled = false;

    const highlight = () => {
      import('@/lib/prism').then(({ tokenizeCode }) => {
        if (cancelled) return;
        setResult({ code, grammar, lines: flattenTokens(tokenizeCode(code, grammar)) });
      });
    };

    if (typeof IntersectionObserver === 'undefined') {
      highlight();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          highlight();
        }
      },
      { rootMargin: HIGHLIGHT_ROOT_MARGIN },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [ref, code, grammar]);

  return result && result.code === code && result.grammar === grammar ? result.lines : undefined;
}

interface CodeLineRowProps {
  line: CodeLine;
  number: number;
  mark?: CodeLineMark;
}

const CodeLineRow: React.FC<CodeLineRowProps> = ({ line, number, mark }) => (
  <span className="code-line" data-line={number} data-mark={mark}>
    {line.map((segment, index) =>
      segment.types.length ? (
        <span key={index} className={`token ${segment.types.join(' ')}`}>
          {segment.text}
        </span>
      ) : (
        segment.text
      ),
    )}
  </span>
);

const COPY_LABELS = {
  idle: 'Copy',
  copied: 'Copied',
  error: 'Failed',
} as const;

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className,
  language,
  title,
  lineNumbers,
  highlight,
  added,
  removed,
  collapsible = true,
  wrap = false,
}) => {
  const [isWrapped, setIsWrapped] = useState(wrap);
  const [isExpanded, setIsExpanded] = useState(false);
  const { status, copy } = useCopyToClipboard(CODE_COPY_FEEDBACK_MS);
  const rootRef = useRef<HTMLDivElement>(null);

  const code = normalizeCode(children);
  const resolvedLanguage = resolveLanguage(language, className);
  const languageLabel = CODE_LANGUAGE_LABELS[resolvedLanguage] ?? resolvedLanguage.toUpperCase();
  const highlightedLines = useDeferredHighlight(rootRef, code, resolveGrammar(resolvedLanguage, code));
  const lines = highlightedLines ?? plainLines(code);

  const markSets = {
    highlight: parseLineRanges(highlight, lines.length),
    added: parseLineRanges(added, lines.length),
    removed: parseLineRanges(removed, lines.length),
  };
  const showLineNumbers = lineNumbers ?? lines.length >= CODE_LINE_NUMBER_MIN_LINES;
  const canCollapse = collapsible && lines.length > CODE_COLLAPSE_MIN_LINES;
  const isCollapsed = canCollapse && !isExpanded;
  const visibleLines = isCollapsed ? lines.slice(0, CODE_COLLAPSED_VISIBLE_LINES) : lines;
  const hiddenCount = lines.length - visibleLines.length;

  const CopyIcon = status === 'copied' ? Check : status === 'error' ? TriangleAlert : Copy;

  return (
    <div
      ref={rootRef}
      className="code-block my-6 overflow-hidden rounded-lg border border-border bg-surface-1"
      data-line-numbers={showLineNumbers}
      data-wrap={isWrapped}
    >
      <div className="flex items-center justify-between border-b border-border bg-neutral-900/50 py-1 pl-3 pr-1 font-mono text-xs">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <FileCode2 className="size-3.5 shrink-0 text-accent-brand" aria-hidden="true" />
          <span className="truncate">{title ?? languageLabel}</span>
          {title && (
            <span className="hidden shrink-0 rounded-lg border border-border px-1.5 py-px text-2xs uppercase tracking-wider text-muted-foreground sm:inline">
              {languageLabel}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center">
          <ToolbarButton
            label={isWrapped ? 'Disable line wrap' : 'Enable line wrap'}
            pressed={isWrapped}
            onClick={() => setIsWrapped((value) => !value)}
          >
            <WrapText className="size-3.5" aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton label="Copy code" onClick={() => copy(code)}>
            <CopyIcon className="size-3.5" aria-hidden="true" />
            <span>{COPY_LABELS[status]}</span>
          </ToolbarButton>
          <span className="sr-only" role="status" aria-live="polite">
            {status === 'copied' && 'Code copied to clipboard'}
            {status === 'error' && 'Could not copy code'}
          </span>
        </div>
      </div>

      <div className="relative">
        <pre
          role="region"
          aria-label={`${title ?? languageLabel} code`}
          tabIndex={0}
          className="overflow-x-auto py-4 font-mono text-[13px] leading-[1.7] text-neutral-300 outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent-brand"
        >
          <code className="block w-max min-w-full">
            {visibleLines.map((line, index) => (
              <CodeLineRow
                key={index}
                line={line}
                number={index + 1}
                mark={getLineMark(index + 1, markSets)}
              />
            ))}
          </code>
        </pre>
        {isCollapsed && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-surface-1 to-transparent"
            aria-hidden="true"
          />
        )}
      </div>

      {canCollapse && (
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 border-t border-border bg-neutral-900/50 py-2 font-mono text-2xs uppercase tracking-wider text-neutral-500 transition-colors',
            'hover:text-white focus-inset',
          )}
        >
          {isExpanded ? (
            <ChevronUp className="size-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-3.5" aria-hidden="true" />
          )}
          {isExpanded ? 'Collapse' : `Show ${hiddenCount} more lines`}
        </button>
      )}
    </div>
  );
};

export default CodeBlock;
