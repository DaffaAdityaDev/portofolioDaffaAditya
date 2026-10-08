import type { PlaygroundTextEdit } from '@/types/blog';
import { PLAYGROUND_BRACKET_PAIRS, PLAYGROUND_INDENT } from '../constants';

// Keyboard edits for the playground editor, as pure functions of the text and selection.

const LEADING_INDENT = new RegExp(`^( {1,${PLAYGROUND_INDENT.length}}|\\t)`);

function lineStartOf(value: string, index: number): number {
  return value.lastIndexOf('\n', index - 1) + 1;
}

/** Start of the first and end of the last line the selection touches. A selection that ends at a line start leaves that line out. */
function selectedLineRange(value: string, start: number, end: number): { from: number; to: number } {
  const from = lineStartOf(value, start);
  const last = end > start && value[end - 1] === '\n' ? end - 1 : end;
  const to = value.indexOf('\n', last);
  return { from, to: to < 0 ? value.length : to };
}

/** Tab: two spaces at the caret, or one more level on every selected line. */
export function indentEdit(value: string, start: number, end: number): PlaygroundTextEdit {
  const indent = PLAYGROUND_INDENT;
  if (!value.slice(start, end).includes('\n')) {
    const caret = start + indent.length;
    return { start, end, text: indent, selectionStart: caret, selectionEnd: caret };
  }

  const { from, to } = selectedLineRange(value, start, end);
  const lines = value.slice(from, to).split('\n');
  return {
    start: from,
    end: to,
    text: lines.map((line) => indent + line).join('\n'),
    selectionStart: start + indent.length,
    selectionEnd: end + indent.length * lines.length,
  };
}

/** Shift+Tab: one level less on every line the selection touches, the caret's line if none. */
export function outdentEdit(value: string, start: number, end: number): PlaygroundTextEdit {
  const { from, to } = selectedLineRange(value, start, end);
  const lines = value.slice(from, to).split('\n');
  const removed = lines.map((line) => LEADING_INDENT.exec(line)?.[0].length ?? 0);

  // How far a position moves left: the indent removed from its own line and the lines above it.
  let lineStart = from;
  const starts = lines.map((line) => {
    const current = lineStart;
    lineStart += line.length + 1;
    return current;
  });
  const shift = (position: number) =>
    starts.reduce((total, start, index) => (start < position ? total + Math.min(removed[index], position - start) : total), 0);

  return {
    start: from,
    end: to,
    text: lines.map((line, index) => line.slice(removed[index])).join('\n'),
    selectionStart: start - shift(start),
    selectionEnd: end - shift(end),
  };
}

/**
 * Enter: the new line keeps the current indentation. After an opening bracket it
 * goes one level deeper, and a closing bracket right after the caret moves to its
 * own line.
 */
export function newlineEdit(value: string, start: number, end: number): PlaygroundTextEdit {
  const lineStart = lineStartOf(value, start);
  const indent = /^[ \t]*/.exec(value.slice(lineStart, start))?.[0] ?? '';
  const closer = PLAYGROUND_BRACKET_PAIRS[value[start - 1]];

  if (!closer) {
    const text = `\n${indent}`;
    return { start, end, text, selectionStart: start + text.length, selectionEnd: start + text.length };
  }

  const inner = `\n${indent}${PLAYGROUND_INDENT}`;
  const text = value[end] === closer ? `${inner}\n${indent}` : inner;
  return { start, end, text, selectionStart: start + inner.length, selectionEnd: start + inner.length };
}
