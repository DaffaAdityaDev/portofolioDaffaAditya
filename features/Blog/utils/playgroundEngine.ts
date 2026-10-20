import { transform, type Transform } from 'sucrase';
import { parse, type SucraseToken } from 'sucrase/dist/esm/parser';
import { TokenType } from 'sucrase/dist/esm/parser/tokenizer/types';
import type { PlaygroundErrorInfo } from '@/types/blog';
import {
  PLAYGROUND_FRAME_CONTEXT_LINES,
  PLAYGROUND_LOOP_CHECK_EVERY,
  PLAYGROUND_LOOP_LIMIT_MS,
  PLAYGROUND_MAX_FILES,
  PLAYGROUND_MAX_SOURCE_CHARS,
  PLAYGROUND_RESOLVE_EXTENSIONS,
  PLAYGROUND_SOURCE_URL_PREFIX,
} from '../constants';
import { inspectValue, limitErrorInfo, parsePlaygroundStack, truncateText } from './playgroundProtocol';

// Turns the playground files into a running module graph: Sucrase strips types and JSX,
// a small CommonJS loader wires the files together. No DOM access, so Node can test it.

const LOOP_GUARD = '__playgroundLoopGuard';
const LOOP_GUARD_ITERABLE = '__playgroundGuardIterable';
const NAMESPACE_MESSAGE = 'TypeScript namespaces are not supported in the preview. Use a module or an object.';

const TRANSFORMS: Record<string, Transform[]> = {
  js: ['jsx', 'imports'],
  jsx: ['jsx', 'imports'],
  ts: ['typescript', 'imports'],
  tsx: ['typescript', 'jsx', 'imports'],
};

/** A run that failed. `info` is what the preview shows and posts to the console. */
export class PlaygroundError extends Error {
  readonly info: PlaygroundErrorInfo;

  constructor(info: PlaygroundErrorInfo) {
    super(info.message);
    this.name = 'PlaygroundError';
    this.info = limitErrorInfo(info);
  }
}

function extensionOf(path: string): string {
  return /\.([a-z0-9]+)$/i.exec(path)?.[1].toLowerCase() ?? '';
}

function hasFile(files: Record<string, string>, path: string): boolean {
  return Object.prototype.hasOwnProperty.call(files, path);
}

/** 1-based line and column of a character offset. */
function positionOf(source: string, offset: number): { line: number; column: number } {
  const before = source.slice(0, offset);
  return { line: before.split('\n').length, column: offset - before.lastIndexOf('\n') };
}

/** Source lines around `line`, with `>` on that line and a caret under `column` if known. */
export function codeFrame(source: string, line: number, column?: number): string {
  const lines = source.split('\n');
  const first = Math.max(line - PLAYGROUND_FRAME_CONTEXT_LINES, 1);
  const last = Math.min(line + PLAYGROUND_FRAME_CONTEXT_LINES, lines.length);
  const width = String(last).length;
  const rows: string[] = [];

  for (let number = first; number <= last; number++) {
    const marker = number === line ? '>' : ' ';
    rows.push(`${marker} ${String(number).padStart(width)} | ${lines[number - 1]}`);
    if (number === line && column) {
      rows.push(`  ${' '.repeat(width)} | ${' '.repeat(Math.max(column - 1, 0))}^`);
    }
  }
  return rows.join('\n');
}

function locatedError(
  kind: PlaygroundErrorInfo['kind'],
  message: string,
  file: string,
  source: string,
  line?: number,
  column?: number,
): PlaygroundError {
  return new PlaygroundError({
    kind,
    message,
    file,
    line,
    column,
    frame: line ? codeFrame(source, line, column) : undefined,
  });
}

/**
 * Adds a guard call to every loop, so an endless loop throws instead of freezing
 * the page. Works on Sucrase output, which is plain JS, using Sucrase's own
 * tokenizer so strings, comments and regexes are never touched. Inserts no
 * newlines, so line numbers stay as they were.
 */
export function addLoopGuards(code: string): string {
  let tokens: SucraseToken[];
  try {
    tokens = parse(code, false, false, false).tokens;
  } catch {
    return code;
  }

  const inserts: Array<{ at: number; text: string }> = [];
  const call = `${LOOP_GUARD}()`;
  const openers = new Set([TokenType.parenL, TokenType.braceL, TokenType.bracketL, TokenType.dollarBraceL]);
  const closers = new Set([TokenType.parenR, TokenType.braceR, TokenType.bracketR]);

  const text = (token?: SucraseToken) => (token ? code.slice(token.start, token.end) : '');

  tokens.forEach((token, index) => {
    if (token.type !== TokenType._for && token.type !== TokenType._while) return;
    let open = index + 1;
    const isAwait = token.type === TokenType._for && text(tokens[open]) === 'await';
    if (isAwait) open++;
    if (tokens[open]?.type !== TokenType.parenL) return;

    // `while (` and the `while (` that ends a do-while: guard the condition.
    if (token.type === TokenType._while) {
      inserts.push({ at: tokens[open].end, text: `${call}, ` });
      return;
    }

    let depth = 0;
    let firstSemi = -1;
    let ofKeyword = -1;
    let close = -1;
    for (let cursor = open; cursor < tokens.length; cursor++) {
      const { type } = tokens[cursor];
      if (openers.has(type)) depth++;
      else if (closers.has(type) && --depth === 0) {
        close = cursor;
        break;
      } else if (type === TokenType.semi && depth === 1 && firstSemi < 0) firstSemi = cursor;
      else if (
        // `of` can also be a variable name: `for (const of of list)`. The keyword comes after the binding.
        depth === 1 &&
        ofKeyword < 0 &&
        type === TokenType.name &&
        text(tokens[cursor]) === 'of' &&
        ![TokenType.parenL, TokenType._const, TokenType._let, TokenType._var].includes(tokens[cursor - 1].type)
      ) {
        ofKeyword = cursor;
      }
    }
    if (close < 0) return;

    if (firstSemi >= 0) {
      // `for (init; test; update)`: guard the test. An empty test becomes the guard, which returns true.
      const emptyTest = tokens[firstSemi + 1]?.type === TokenType.semi;
      inserts.push({ at: tokens[firstSemi].end, text: emptyTest ? ` ${call}` : ` ${call},` });
    } else if (tokens[close + 1]?.type === TokenType.braceL) {
      // `for (x of y) {`: guard the body.
      inserts.push({ at: tokens[close + 1].end, text: ` ${call};` });
    } else if (ofKeyword >= 0 && !isAwait) {
      // `for (x of y) statement;`: no block to put the call in, so the iterable is wrapped
      // instead. `for...in` walks a fixed list of keys and needs no guard.
      inserts.push({ at: tokens[ofKeyword].end, text: ` ${LOOP_GUARD_ITERABLE}(` }, { at: tokens[close].start, text: ')' });
    }
  });

  return inserts
    .sort((a, b) => b.at - a.at)
    .reduce((result, { at, text }) => result.slice(0, at) + text + result.slice(at), code);
}

/**
 * The function every guarded loop calls. It throws once the current task has
 * spent `limitMs` inside loops. The clock restarts on the next microtask, so
 * loops that `await` or run in separate events are never stopped.
 */
export function createLoopGuard(limitMs = PLAYGROUND_LOOP_LIMIT_MS, now: () => number = Date.now): () => boolean {
  let startedAt = -1;
  let iterations = 0;

  return () => {
    if (startedAt < 0) {
      startedAt = now();
      iterations = 0;
      queueMicrotask(() => {
        startedAt = -1;
      });
    }
    if (++iterations % PLAYGROUND_LOOP_CHECK_EVERY === 0 && now() - startedAt > limitMs) {
      throw new Error(`A loop ran for more than ${limitMs / 1000}s and was stopped. Check its exit condition.`);
    }
    return true;
  };
}

/** Passes the items of an iterable through, calling the loop guard before each one. */
export function createIterableGuard(loopGuard: () => boolean) {
  return function* guardIterable<T>(iterable: Iterable<T>): Generator<T> {
    if (typeof (iterable as Iterable<T> | null | undefined)?.[Symbol.iterator] !== 'function') {
      throw new TypeError(`${inspectValue(iterable)} is not iterable`);
    }
    for (const item of iterable) {
      loopGuard();
      yield item;
    }
  };
}

/**
 * Sucrase drops a TypeScript namespace that holds values without a warning, so the
 * code would fail later with "N is not defined". This finds one, to report it up front.
 * Namespaces that only hold types, and `declare namespace`, compile to nothing anyway.
 */
function findValueNamespace(source: string, isJSX: boolean): number | undefined {
  let tokens: SucraseToken[];
  try {
    tokens = parse(source, isJSX, true, false).tokens;
  } catch {
    // A syntax error. The transform reports it with a better message.
    return undefined;
  }

  const text = (token?: SucraseToken) => (token ? source.slice(token.start, token.end) : '');
  const values = new Set([TokenType._const, TokenType._let, TokenType._var, TokenType._function, TokenType._class, TokenType._enum]);

  for (let index = 0; index < tokens.length; index++) {
    const keyword = tokens[index];
    if (!keyword.isType || (text(keyword) !== 'namespace' && text(keyword) !== 'module')) continue;
    if (tokens[index + 1]?.type !== TokenType.name || text(tokens[index - 1]) === 'declare') continue;

    // Skip the name, which may be dotted (`namespace A.B`), then scan the body's own statements.
    let cursor = index + 1;
    while (tokens[cursor]?.type === TokenType.name || tokens[cursor]?.type === TokenType.dot) cursor++;
    if (tokens[cursor]?.type !== TokenType.braceL) continue;
    let depth = 0;
    for (; cursor < tokens.length; cursor++) {
      const { type } = tokens[cursor];
      if (type === TokenType.braceL || type === TokenType.dollarBraceL) depth++;
      else if (type === TokenType.braceR && --depth === 0) break;
      else if (depth === 1 && values.has(type) && text(tokens[cursor - 1]) !== 'declare') return keyword.start;
    }
  }
  return undefined;
}

function compileError(error: unknown, path: string, source: string): PlaygroundError {
  const { message = String(error), loc } = (error ?? {}) as { message?: string; loc?: { line: number; column: number } };
  // Sucrase writes `Error transforming /App.tsx: Unexpected token (3:5)`. File and position are shown separately.
  const clean = message.replace(/^Error transforming [^:]+: /, '').replace(/ \(\d+:\d+\)$/, '');
  return locatedError('compile', clean, path, source, loc?.line, loc?.column);
}

/** Transpiles one script to CommonJS with loop guards. Throws a PlaygroundError on a syntax error. */
export function compileModule(path: string, source: string): string {
  const transforms = TRANSFORMS[extensionOf(path)];
  if (!transforms) throw new PlaygroundError({ kind: 'compile', message: `${path} is not a script file.`, file: path });

  if (transforms.includes('typescript')) {
    const namespaceAt = findValueNamespace(source, transforms.includes('jsx'));
    if (namespaceAt !== undefined) {
      const { line, column } = positionOf(source, namespaceAt);
      throw locatedError('compile', NAMESPACE_MESSAGE, path, source, line, column);
    }
  }

  try {
    const { code } = transform(source, {
      transforms,
      filePath: path,
      jsxRuntime: 'automatic',
      production: true,
      // The preview runs in modern browsers, so only TS, JSX and imports need rewriting.
      disableESTransforms: true,
    });
    return addLoopGuards(code);
  } catch (error) {
    throw compileError(error, path, source);
  }
}

/** Exposes a CommonJS module to `import` syntax, both default and named imports. */
export function toInteropModule(namespace: unknown): unknown {
  const value = (namespace as { default?: unknown })?.default ?? namespace;
  return { ...(value as object), default: value, __esModule: true };
}

/** The stack trace of a thrown value, if it has one. Never throws, even for a revoked proxy. */
function stackOf(error: unknown): unknown {
  try {
    return typeof error === 'object' && error !== null ? (error as Error).stack : undefined;
  } catch {
    return undefined;
  }
}

/**
 * True when every playground frame in the error's stack belongs to another run. That
 * happens when code of an earlier run, a pending promise for example, throws after
 * the next run started. Such an error says nothing about the current code.
 */
export function isFromOtherRun(error: unknown, tag: string): boolean {
  const frames = parsePlaygroundStack(stackOf(error));
  return frames.length > 0 && frames.every((frame) => frame.tag !== tag);
}

/**
 * True for an error of the runtime page itself, such as the dev server's client code:
 * its stack names this site's scripts and none of the playground files. The reader's
 * code always shows up in the stack of what it throws, or of the call that failed.
 */
export function isPageError(error: unknown): boolean {
  const stack = stackOf(error);
  return typeof stack === 'string' && /\bhttps?:\/\//.test(stack) && parsePlaygroundStack(stack).length === 0;
}

/**
 * File, line and frame for anything thrown while the code ran. `tag` is the run's tag
 * (see PlaygroundRunOptions), so frames of an earlier run are skipped. Never throws.
 */
export function describeRuntimeError(error: unknown, files: Record<string, string>, tag = ''): PlaygroundErrorInfo {
  try {
    if (error instanceof PlaygroundError) return error.info;

    const stack = stackOf(error);
    const isError = error instanceof Error || typeof stack === 'string';
    const message = isError
      ? `${(error as Error).name || 'Error'}: ${(error as Error).message}`
      : `Uncaught ${inspectValue(error)}`;
    const location = parsePlaygroundStack(stack).find((frame) => frame.tag === tag && hasFile(files, frame.file));
    if (!location) return limitErrorInfo({ kind: 'runtime', message });

    // Sucrase keeps line numbers but not columns, so the frame marks the line only.
    return limitErrorInfo({
      kind: 'runtime',
      message,
      file: location.file,
      line: location.line,
      frame: codeFrame(files[location.file], location.line),
    });
  } catch {
    // A hostile value, such as a revoked proxy or a getter that throws.
    return { kind: 'runtime', message: truncateText(`Uncaught ${inspectValue(error)}`) };
  }
}

function joinPath(directory: string, relative: string): string {
  const segments = directory.split('/').filter(Boolean);
  relative.split('/').forEach((segment) => {
    if (segment === '..') segments.pop();
    else if (segment && segment !== '.') segments.push(segment);
  });
  return `/${segments.join('/')}`;
}

/** 1-based line of the first import of `specifier`, for pointing at a failed import. */
function findImportLine(source: string, specifier: string): number | undefined {
  const quoted = [`'${specifier}'`, `"${specifier}"`];
  const index = source.split('\n').findIndex((line) => quoted.some((text) => line.includes(text)));
  return index >= 0 ? index + 1 : undefined;
}

function checkLimits(files: Record<string, string>, entry: string): void {
  const paths = Object.keys(files);
  const size = paths.reduce((total, path) => total + files[path].length, 0);
  if (paths.length > PLAYGROUND_MAX_FILES) {
    throw new PlaygroundError({ kind: 'compile', message: `Too many files: ${paths.length}, the limit is ${PLAYGROUND_MAX_FILES}.` });
  }
  if (size > PLAYGROUND_MAX_SOURCE_CHARS) {
    throw new PlaygroundError({ kind: 'compile', message: `The code is too long: ${size} characters, the limit is ${PLAYGROUND_MAX_SOURCE_CHARS}.` });
  }
  if (!hasFile(files, entry)) {
    throw new PlaygroundError({ kind: 'compile', message: `The entry file ${entry} is missing.` });
  }
}

export interface PlaygroundRunOptions {
  /** Keyed by path, each starting with `/`. */
  files: Record<string, string>;
  /** File whose default export is the component to render, e.g. `/App.tsx`. */
  entry: string;
  /** Bare imports the code may use, already wrapped with `toInteropModule`. */
  externals: Record<string, unknown>;
  /**
   * Goes into each file's name in stack traces (`playground://<tag>/App.tsx`), so an
   * error can be traced to the run that made it. Letters, digits, `_` and `-` only.
   */
  tag?: string;
  loopGuard?: () => boolean;
}

export interface PlaygroundProject {
  /** Default export of the entry file. */
  App: unknown;
  /** Every `.css` file, in file order. */
  styles: Array<{ path: string; css: string }>;
}

/**
 * Compiles every script, then runs the entry file and whatever it imports.
 * Imports between files work with or without the extension. Throws a
 * PlaygroundError with file and line for anything that goes wrong.
 */
export function runPlaygroundProject({
  files,
  entry,
  externals,
  tag = '',
  loopGuard = createLoopGuard(),
}: PlaygroundRunOptions): PlaygroundProject {
  checkLimits(files, entry);

  // Compile everything first, so a syntax error anywhere is reported before any code runs.
  const compiled = new Map<string, string>();
  Object.entries(files).forEach(([path, source]) => {
    if (TRANSFORMS[extensionOf(path)]) compiled.set(path, compileModule(path, source));
  });

  const iterableGuard = createIterableGuard(loopGuard);
  const cache = new Map<string, { exports: unknown }>();

  function resolve(from: string, specifier: string): string {
    const fail = (message: string) =>
      locatedError('compile', message, from, files[from], findImportLine(files[from], specifier));

    if (!specifier.startsWith('.') && !specifier.startsWith('/')) {
      throw fail(`Cannot import "${specifier}". This preview can only import react, react-dom and the files in this editor.`);
    }
    const base = specifier.startsWith('/') ? joinPath('/', specifier) : joinPath(from.slice(0, from.lastIndexOf('/')), specifier);
    const candidates = [
      base,
      ...PLAYGROUND_RESOLVE_EXTENSIONS.map((extension) => base + extension),
      ...PLAYGROUND_RESOLVE_EXTENSIONS.map((extension) => `${base}/index${extension}`),
    ];
    const path = candidates.find((candidate) => hasFile(files, candidate));
    if (!path) throw fail(`Cannot find "${specifier}" from ${from}.`);
    return path;
  }

  function load(path: string): unknown {
    const cached = cache.get(path);
    if (cached) return cached.exports;

    // Cached before it runs, so circular imports get the partly filled exports, as in Node.
    const record = { exports: {} as unknown };
    cache.set(path, record);
    const extension = extensionOf(path);

    if (extension === 'css') return record.exports;
    if (extension === 'json') {
      try {
        record.exports = JSON.parse(files[path]);
      } catch (error) {
        throw new PlaygroundError({ kind: 'compile', message: `Invalid JSON: ${(error as Error).message}`, file: path });
      }
      return record.exports;
    }

    const code = compiled.get(path);
    if (code === undefined) {
      throw new PlaygroundError({ kind: 'compile', message: `${path} cannot be imported. Use .js, .jsx, .ts, .tsx, .css or .json files.`, file: path });
    }
    const requireFrom = (specifier: string) =>
      Object.prototype.hasOwnProperty.call(externals, specifier) ? externals[specifier] : load(resolve(path, specifier));

    // Indirect eval runs in global scope, and keeps line 1 of the file on line 1 of the
    // script. The source URL makes stack traces name the playground file. The module
    // variables are parameters of an outer function, so the file's own top-level
    // declarations (`let module`, for one) shadow them instead of clashing.
    let factory: (...args: unknown[]) => () => void;
    try {
      factory = (0, eval)(
        `(function (require, module, exports, ${LOOP_GUARD}, ${LOOP_GUARD_ITERABLE}) { return function () {${code}\n} })` +
          `\n//# sourceURL=${PLAYGROUND_SOURCE_URL_PREFIX}${tag}${path}`,
      );
    } catch (error) {
      // Sucrase accepts some code the browser rejects, e.g. `010` in strict mode, or decorators.
      if (error instanceof SyntaxError) throw locatedError('compile', `SyntaxError: ${error.message}`, path, files[path]);
      throw error;
    }
    factory(requireFrom, record, record.exports, loopGuard, iterableGuard)();
    return record.exports;
  }

  let exports: unknown;
  try {
    exports = load(entry);
  } catch (error) {
    throw new PlaygroundError(describeRuntimeError(error, files, tag));
  }

  const App = (exports as { default?: unknown } | undefined)?.default;
  if (App === undefined) {
    throw new PlaygroundError({ kind: 'runtime', message: `${entry} has no default export. Add "export default function App() { ... }".`, file: entry });
  }
  if (typeof App !== 'function' && (typeof App !== 'object' || App === null)) {
    throw new PlaygroundError({ kind: 'runtime', message: `The default export of ${entry} is not a React component.`, file: entry });
  }

  const styles = Object.entries(files)
    .filter(([path]) => extensionOf(path) === 'css')
    .map(([path, css]) => ({ path, css }));

  return { App, styles };
}
