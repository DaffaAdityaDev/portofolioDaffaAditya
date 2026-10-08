import type {
  PlaygroundConsoleLevel,
  PlaygroundErrorInfo,
  PlaygroundHostMessage,
  PlaygroundRuntimeMessage,
} from '@/types/blog';
import {
  PLAYGROUND_INSPECT_MAX_DEPTH,
  PLAYGROUND_INSPECT_MAX_ITEMS,
  PLAYGROUND_INSPECT_MAX_STRING,
  PLAYGROUND_SOURCE_URL_PREFIX,
} from '../constants';

// Shared by the post page and the preview iframe. No DOM access, so Node can test it.

const CONSOLE_LEVELS: readonly PlaygroundConsoleLevel[] = ['log', 'info', 'warn', 'error'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFileMap(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((code) => typeof code === 'string');
}

function isErrorInfo(value: unknown): value is PlaygroundErrorInfo {
  return (
    isRecord(value) &&
    (value.kind === 'compile' || value.kind === 'runtime') &&
    typeof value.message === 'string' &&
    (value.file === undefined || typeof value.file === 'string') &&
    (value.line === undefined || typeof value.line === 'number') &&
    (value.column === undefined || typeof value.column === 'number') &&
    (value.frame === undefined || typeof value.frame === 'string')
  );
}

/** Checked by the iframe before it runs anything it receives. */
export function isPlaygroundHostMessage(data: unknown): data is PlaygroundHostMessage {
  if (!isRecord(data) || data.source !== 'playground-host') return false;
  if (data.type === 'ping') return true;
  return (
    data.type === 'run' &&
    Number.isInteger(data.runId) &&
    typeof data.entry === 'string' &&
    isFileMap(data.files)
  );
}

/** Checked by the post page before it trusts anything the iframe sends. */
export function isPlaygroundRuntimeMessage(data: unknown): data is PlaygroundRuntimeMessage {
  if (!isRecord(data) || data.source !== 'playground-runtime') return false;

  switch (data.type) {
    case 'ready':
    case 'pong':
      return true;
    case 'rendered':
      return Number.isInteger(data.runId);
    case 'error':
      return Number.isInteger(data.runId) && isErrorInfo(data.error);
    case 'console':
      return CONSOLE_LEVELS.includes(data.level as PlaygroundConsoleLevel) && typeof data.text === 'string';
    default:
      return false;
  }
}

// --- Stack traces ---

export interface PlaygroundStackFrame {
  name?: string;
  /** The run tag in the file's source URL, `''` when there is none. */
  tag: string;
  file: string;
  line: number;
  column?: number;
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// `playground://<tag>/App.tsx:3:5`, where the tag (see runPlaygroundProject) may be empty.
const LOCATION_PATTERN = new RegExp(`${escapeRegExp(PLAYGROUND_SOURCE_URL_PREFIX)}([\\w-]*)(/[^\\s():]*):(\\d+)(?::(\\d+))?`);
// Chrome writes `at name (url:1:2)`, Firefox and Safari write `name@url:1:2`.
const CHROME_NAME_PATTERN = /^\s*at\s+(.+?)\s+\(/;
const GECKO_NAME_PATTERN = /^([^@\s]+)@/;

/** Frames of a stack trace that point into playground files, innermost first. */
export function parsePlaygroundStack(stack: unknown): PlaygroundStackFrame[] {
  if (typeof stack !== 'string') return [];

  return stack.split('\n').flatMap((line) => {
    const location = LOCATION_PATTERN.exec(line);
    if (!location) return [];
    const name = CHROME_NAME_PATTERN.exec(line)?.[1] ?? GECKO_NAME_PATTERN.exec(line)?.[1];
    return [
      {
        name: name && name !== 'eval' ? name : undefined,
        tag: location[1],
        file: location[2],
        line: Number(location[3]),
        column: location[4] ? Number(location[4]) : undefined,
      },
    ];
  });
}

// --- Console values ---

const IDENTIFIER_PATTERN = /^[A-Za-z_$][\w$]*$/;
const FORMAT_PATTERN = /%([sdifoOc%])/g;
const STACK_FRAMES_SHOWN = 3;

/** Cuts text longer than PLAYGROUND_INSPECT_MAX_STRING and says how much was cut. */
export function truncateText(text: string): string {
  return text.length > PLAYGROUND_INSPECT_MAX_STRING
    ? `${text.slice(0, PLAYGROUND_INSPECT_MAX_STRING)}... (${text.length - PLAYGROUND_INSPECT_MAX_STRING} more characters)`
    : text;
}

function constructorName(value: object): string | undefined {
  const proto = Object.getPrototypeOf(value);
  const name = proto?.constructor?.name;
  return typeof name === 'string' && name ? name : undefined;
}

function isErrorLike(value: object): value is Error {
  return value instanceof Error || (typeof (value as Error).message === 'string' && typeof (value as Error).stack === 'string');
}

/** `Error: message`, followed by the frames that point into playground files. */
export function formatError(error: Error): string {
  const head = `${error.name || 'Error'}: ${error.message}`;
  const frames = parsePlaygroundStack(error.stack)
    .slice(0, STACK_FRAMES_SHOWN)
    .map(({ name, file, line }) => `    at ${name ? `${name} (${file}:${line})` : `${file}:${line}`}`);
  return [head, ...frames].join('\n');
}

function formatKey(key: string): string {
  return IDENTIFIER_PATTERN.test(key) ? key : JSON.stringify(key);
}

function firstItems<T>(iterable: Iterable<T>, limit: number): T[] {
  const items: T[] = [];
  for (const item of iterable) {
    if (items.length >= limit) break;
    items.push(item);
  }
  return items;
}

function formatItems(items: string[], total: number, open: string, close: string): string {
  const hidden = total - items.length;
  const parts = hidden > 0 ? [...items, `... ${hidden} more`] : items;
  return parts.length ? `${open} ${parts.join(', ')} ${close}` : `${open}${close}`;
}

function inspectObject(value: object, depth: number, seen: Set<object>): string {
  const next = (item: unknown) => inspect(item, depth + 1, seen);
  const name = constructorName(value);

  if (isErrorLike(value)) return formatError(value);
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
  if (value instanceof RegExp) return String(value);
  if (typeof Promise !== 'undefined' && value instanceof Promise) return 'Promise { ... }';
  if (typeof WeakMap !== 'undefined' && (value instanceof WeakMap || value instanceof WeakSet)) return `${name} { ... }`;

  // Files and DOM nodes say more through a few fields than through their (empty) own keys.
  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    const fileName = (value as File).name;
    return typeof fileName === 'string'
      ? `File { name: ${JSON.stringify(fileName)}, size: ${value.size}, type: ${JSON.stringify(value.type)} }`
      : `Blob { size: ${value.size}, type: ${JSON.stringify(value.type)} }`;
  }
  const node = value as { nodeType?: unknown; nodeName?: unknown; id?: unknown; textContent?: unknown };
  if (typeof node.nodeType === 'number' && typeof node.nodeName === 'string') {
    if (node.nodeType !== 1) return `${node.nodeName} ${JSON.stringify(truncateText(String(node.textContent ?? '')))}`;
    const id = typeof node.id === 'string' && node.id ? ` id="${node.id}"` : '';
    return `<${node.nodeName.toLowerCase()}${id}>`;
  }

  const atLimit = depth >= PLAYGROUND_INSPECT_MAX_DEPTH;
  const limit = PLAYGROUND_INSPECT_MAX_ITEMS;

  if (Array.isArray(value)) {
    if (atLimit) return '[Array]';
    return formatItems(value.slice(0, limit).map(next), value.length, '[', ']');
  }
  // Only the items shown are read, so a huge buffer or map costs no more than a small one.
  if (ArrayBuffer.isView(value) && 'length' in value) {
    const { length } = value as unknown as ArrayLike<number>;
    const items = Array.prototype.slice.call(value, 0, limit) as unknown[];
    return `${name}(${length}) ${formatItems(items.map(String), length, '[', ']')}`;
  }
  if (value instanceof Map) {
    if (atLimit) return '[Map]';
    const entries = firstItems(value, limit).map(([key, item]) => `${next(key)} => ${next(item)}`);
    return `Map(${value.size}) ${formatItems(entries, value.size, '{', '}')}`;
  }
  if (value instanceof Set) {
    if (atLimit) return '[Set]';
    return `Set(${value.size}) ${formatItems(firstItems(value, limit).map(next), value.size, '{', '}')}`;
  }

  const prefix = name && name !== 'Object' ? `${name} ` : '';
  if (atLimit) return `[${name ?? 'Object'}]`;
  const keys = Object.keys(value);
  const entries = keys.slice(0, limit).map((key) => {
    let item: unknown;
    try {
      item = (value as Record<string, unknown>)[key];
    } catch {
      return `${formatKey(key)}: [Getter threw]`;
    }
    return `${formatKey(key)}: ${next(item)}`;
  });
  return `${prefix}${formatItems(entries, keys.length, '{', '}')}`;
}

function inspect(value: unknown, depth: number, seen: Set<object>): string {
  switch (typeof value) {
    case 'string':
      return depth === 0 ? truncateText(value) : JSON.stringify(truncateText(value));
    case 'number':
      return Object.is(value, -0) ? '-0' : String(value);
    case 'bigint':
      return `${value}n`;
    case 'symbol':
      return value.toString();
    case 'function':
      return `[Function: ${value.name || 'anonymous'}]`;
    case 'boolean':
    case 'undefined':
      return String(value);
  }
  if (value === null) return 'null';

  const object = value as object;
  if (seen.has(object)) return '[Circular]';
  seen.add(object);
  try {
    return inspectObject(object, depth, seen);
  } catch {
    // Revoked proxies and hostile getters end up here.
    return '[Uninspectable]';
  } finally {
    seen.delete(object);
  }
}

/** One value as text, like the browser console would print it. Never throws. */
export function inspectValue(value: unknown): string {
  return inspect(value, 0, new Set());
}

/** Applies `%s`-style substitutions, which React's own warnings use. */
function applyFormat(format: string, args: unknown[]): string {
  return format.replace(FORMAT_PATTERN, (match, flag: string) => {
    if (flag === '%') return '%';
    if (args.length === 0) return match;
    const arg = args.shift();
    switch (flag) {
      case 's':
        return typeof arg === 'string' ? arg : inspectValue(arg);
      case 'd':
      case 'i':
        return String(Number.parseInt(String(arg), 10));
      case 'f':
        return String(Number(arg));
      case 'c':
        return '';
      default:
        return inspectValue(arg);
    }
  });
}

/** The arguments of one console call as a single line of text. */
export function formatConsoleArgs(args: unknown[]): string {
  const rest = [...args];
  const head = typeof rest[0] === 'string' && rest[0].includes('%') ? applyFormat(String(rest.shift()), rest) : undefined;
  const parts = rest.map(inspectValue);
  return truncateText((head === undefined ? parts : [head, ...parts]).join(' '));
}

/** The same error with its text cut to size. Code can throw a message of any length. */
export function limitErrorInfo(info: PlaygroundErrorInfo): PlaygroundErrorInfo {
  const limited = { ...info, message: truncateText(info.message) };
  if (info.file !== undefined) limited.file = truncateText(info.file);
  if (info.frame !== undefined) limited.frame = truncateText(info.frame);
  return limited;
}

/**
 * Lets at most `perSecond` messages through each second. Both sides of the preview use
 * one: the frame so it does not flood the post page, and the post page because code in
 * the frame can post to it directly.
 */
export function createRateLimiter(perSecond: number, now: () => number = Date.now) {
  let windowStart = -Infinity;
  let sent = 0;
  let skipped = 0;

  return {
    /** True if one more message fits in the current second. Counts it as skipped if not. */
    take(): boolean {
      const time = now();
      if (time - windowStart >= 1000) {
        windowStart = time;
        sent = 0;
      }
      if (sent < perSecond) {
        sent++;
        return true;
      }
      skipped++;
      return false;
    },
    /** How many messages were skipped since the last call. */
    takeSkipped(): number {
      const count = skipped;
      skipped = 0;
      return count;
    },
  };
}

/** An error as console text: where it happened, what it says, and the source around it. */
export function describePlaygroundError({ message, file, line, frame }: PlaygroundErrorInfo): string {
  const location = file ? `${file}${line ? `:${line}` : ''}\n` : '';
  return `${location}${message}${frame ? `\n\n${frame}` : ''}`;
}
