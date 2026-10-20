import React, { useId, useLayoutEffect, useMemo, useRef } from 'react';
import { tokenizeCode } from '@/lib/prism';
import { cn } from '@/utils/cn';
import type { PlaygroundEditorProps, PlaygroundTextEdit } from '@/types/blog';
import { flattenTokens } from '../../utils/code';
import { indentEdit, newlineEdit, outdentEdit } from '../../utils/editor';
import { fileLabel, grammarForPath } from '../../utils/playground';

// The textarea and the highlighted copy under it must lay text out identically. 16px on
// small screens, because iOS zooms the page into any focused field set smaller than that.
const TEXT_CLASS = 'm-0 whitespace-pre p-4 font-mono text-base leading-[1.7] [tab-size:2] md:text-[13px]';
// Pressing one of these on its own, e.g. Shift before Shift+Tab, keeps the Escape exit armed.
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

/**
 * Code editor: a transparent textarea over a Prism-highlighted copy of its text.
 * The textarea owns typing, selection, undo and scrolling; the copy and the line
 * numbers follow its scroll position.
 */
const PlaygroundEditor: React.FC<PlaygroundEditorProps> = ({ path, value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  // After Escape, the next Tab leaves the editor instead of indenting.
  const tabLeaves = useRef(false);
  const hintId = useId();

  // The console and the preview status re-render this often. Highlight only when the text changes.
  const lines = useMemo(() => flattenTokens(tokenizeCode(value, grammarForPath(path))), [value, path]);

  const syncScroll = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { scrollTop, scrollLeft } = textarea;
    if (highlightRef.current) highlightRef.current.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    if (gutterRef.current) gutterRef.current.style.transform = `translateY(${-scrollTop}px)`;
  };

  // Deleting lines can move the scroll position without a scroll event.
  useLayoutEffect(syncScroll);

  const applyEdit = (edit: PlaygroundTextEdit) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.setSelectionRange(edit.start, edit.end);
    // execCommand keeps the browser's undo history. Where it is gone, edit the value directly.
    const applied = edit.text
      ? document.execCommand('insertText', false, edit.text)
      : edit.start === edit.end || document.execCommand('delete');
    if (!applied) {
      textarea.setRangeText(edit.text, edit.start, edit.end, 'end');
      onChange(textarea.value);
    }
    textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || MODIFIER_KEYS.has(event.key)) return;
    const { selectionStart, selectionEnd } = event.currentTarget;
    const hasModifier = event.ctrlKey || event.metaKey || event.altKey;

    if (event.key === 'Escape') {
      tabLeaves.current = true;
      return;
    }
    if (event.key === 'Tab' && !hasModifier && !tabLeaves.current) {
      event.preventDefault();
      applyEdit(
        event.shiftKey
          ? outdentEdit(value, selectionStart, selectionEnd)
          : indentEdit(value, selectionStart, selectionEnd),
      );
    } else if (event.key === 'Enter' && !hasModifier && !event.shiftKey) {
      event.preventDefault();
      applyEdit(newlineEdit(value, selectionStart, selectionEnd));
    }
    tabLeaves.current = false;
  };

  return (
    <div className="playground-editor relative flex h-full min-h-0 overflow-hidden bg-surface-1 focus-within:ring-1 focus-within:ring-inset focus-within:ring-accent-brand">
      <div className="shrink-0 overflow-hidden border-r border-neutral-900 text-neutral-600 select-none" aria-hidden="true">
        <div ref={gutterRef} className={cn(TEXT_CLASS, 'min-w-11 pl-2 pr-3 text-right')}>
          {lines.map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>
      </div>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <pre
          ref={highlightRef}
          aria-hidden="true"
          className={cn(TEXT_CLASS, 'pointer-events-none absolute left-0 top-0 min-w-full text-neutral-300')}
        >
          <code>
            {lines.map((line, index) => (
              <React.Fragment key={index}>
                {index > 0 && '\n'}
                {line.map((segment, segmentIndex) =>
                  segment.types.length ? (
                    <span key={segmentIndex} className={`token ${segment.types.join(' ')}`}>
                      {segment.text}
                    </span>
                  ) : (
                    segment.text
                  ),
                )}
              </React.Fragment>
            ))}
            {/* Keeps a trailing empty line as tall as the textarea's. */}
            {'\n'}
          </code>
        </pre>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          wrap="off"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label={`Code editor, ${fileLabel(path)}`}
          aria-describedby={hintId}
          className={cn(
            TEXT_CLASS,
            'absolute inset-0 size-full resize-none overflow-auto border-0 bg-transparent text-transparent caret-neutral-100 outline-none',
            'selection:bg-accent-brand/30 [-webkit-text-fill-color:transparent]',
          )}
        />
        <span id={hintId} className="sr-only">
          Tab inserts two spaces. Press Escape, then Tab or Shift+Tab, to move focus out of the editor.
        </span>
      </div>
    </div>
  );
};

export default PlaygroundEditor;
