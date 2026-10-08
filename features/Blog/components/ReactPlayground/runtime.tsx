import React, { Component, StrictMode, useEffect, type ComponentType, type ReactNode } from 'react';
import * as ReactModule from 'react';
import * as ReactDomModule from 'react-dom';
import * as ReactDomClientModule from 'react-dom/client';
import * as JsxRuntimeModule from 'react/jsx-runtime';
import { createRoot, type Root } from 'react-dom/client';
import type { PlaygroundConsoleLevel, PlaygroundErrorInfo, PlaygroundRuntimeMessage } from '@/types/blog';
import { PLAYGROUND_CONSOLE_RATE_PER_SECOND, PLAYGROUND_EXTERNAL_MODULES } from '../../constants';
import {
  describeRuntimeError,
  isFromOtherRun,
  isPageError,
  PlaygroundError,
  runPlaygroundProject,
  toInteropModule,
} from '../../utils/playgroundEngine';
import {
  createRateLimiter,
  formatConsoleArgs,
  isPlaygroundHostMessage,
  parsePlaygroundStack,
} from '../../utils/playgroundProtocol';

// Runs inside the preview iframe (pages/playground-runtime.tsx), never in the post page.
// The iframe is sandboxed without allow-same-origin, so this code and the reader's
// code get an opaque origin: no cookies, no storage, no access to the parent.

/** The only packages the reader's code can import: the React this page already ships. */
const EXTERNALS: Record<(typeof PLAYGROUND_EXTERNAL_MODULES)[number], unknown> = {
  react: toInteropModule(ReactModule),
  'react-dom': toInteropModule(ReactDomModule),
  'react-dom/client': toInteropModule(ReactDomClientModule),
  'react/jsx-runtime': toInteropModule(JsxRuntimeModule),
};

const CONSOLE_LEVELS: readonly PlaygroundConsoleLevel[] = ['log', 'info', 'warn', 'error'];
// Next.js logs these from its dev client inside this frame. They are not the reader's output.
const DEV_NOISE = /^(\[Fast Refresh\]|\[HMR\]|Failed to fetch _devMiddlewareManifest)/;
const STYLE_MARK = 'data-playground-style';
// What the browser reports when it hides an error's details from this frame.
const HIDDEN_ERROR_PATTERN = /^(Uncaught )?Script error\.?$/;
const HIDDEN_ERROR_MESSAGE =
  'The code threw an error, but the browser hid its details. The developer tools console of the browser shows it.';

// The site's global CSS loads on every page, this one included. The reader's CSS
// should land on browser defaults, as in a fresh project, so the site's sheets go.
const isSiteStyle = (node: Node): node is Element =>
  node instanceof Element &&
  !node.hasAttribute(STYLE_MARK) &&
  (node.matches('link[rel~="stylesheet"][href^="/_next/"]') ||
    node.matches('style[data-n-href], style[data-next-hide-fouc]'));

function stripSiteStyles(): () => void {
  const sweep = (nodes: Iterable<Node>) => {
    for (const node of nodes) {
      if (isSiteStyle(node)) node.remove();
      // The Next.js dev overlay would cover the reader's preview. Development only.
      else if (node.nodeName === 'NEXTJS-PORTAL') (node as HTMLElement).style.display = 'none';
    }
  };
  sweep(document.querySelectorAll('link, style, nextjs-portal'));
  const observer = new MutationObserver((records) => records.forEach((record) => sweep(record.addedNodes)));
  observer.observe(document.head, { childList: true });
  observer.observe(document.body, { childList: true });
  return () => observer.disconnect();
}

/** Tag of the run whose code called the current function, or undefined for the page's own code. */
function callerTag(): string | undefined {
  return parsePlaygroundStack(new Error().stack)[0]?.tag;
}

type ListenerArgs = Parameters<EventTarget['addEventListener']>;
// The browser's signatures. The project's Node typings would add their own overloads.
type SetTimer = (handler: TimerHandler, delay?: number, ...args: unknown[]) => number;
type ClearTimer = (id?: number) => void;

const captureOf = (options: ListenerArgs[2]) => (typeof options === 'boolean' ? options : Boolean(options?.capture));

/**
 * Wraps the global timers, and addEventListener on window and document, so whatever the
 * reader's code schedules or listens to can be undone before the next run. That holds
 * for `setTimeout(...)` and `window.setTimeout(...)` alike. The reader's code is told
 * from the page's own by the playground file names in the stack trace. Code left over
 * from an earlier run, such as a pending promise, can no longer schedule anything.
 * React took its own references to the timers when it loaded, so it is not affected.
 */
function interceptGlobals(currentTag: () => string) {
  const timeouts = new Set<number>();
  const intervals = new Set<number>();
  const frames = new Set<number>();
  const listeners: Array<[EventTarget, ...ListenerArgs]> = [];
  const native = {
    setTimeout: window.setTimeout as SetTimer,
    clearTimeout: window.clearTimeout as ClearTimer,
    setInterval: window.setInterval as SetTimer,
    clearInterval: window.clearInterval as ClearTimer,
    requestAnimationFrame: window.requestAnimationFrame,
    cancelAnimationFrame: window.cancelAnimationFrame,
  };
  const targets: EventTarget[] = [window, document];

  // undefined: the page's own code. false: an earlier run. true: the current run.
  const isCurrentRun = () => {
    const tag = callerTag();
    return tag === undefined ? undefined : tag === currentTag();
  };

  window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => {
    const current = isCurrentRun();
    if (current === undefined) return native.setTimeout.call(window, handler, delay, ...args);
    if (!current) return 0;
    const id: number = native.setTimeout.call(
      window,
      typeof handler === 'function'
        ? (...callArgs: unknown[]) => {
            timeouts.delete(id);
            handler(...callArgs);
          }
        : handler,
      delay,
      ...args,
    );
    timeouts.add(id);
    return id;
  }) as typeof window.setTimeout;
  window.clearTimeout = ((id?: number) => {
    if (id !== undefined) timeouts.delete(id);
    native.clearTimeout.call(window, id);
  }) as typeof window.clearTimeout;
  window.setInterval = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => {
    const current = isCurrentRun();
    if (current === undefined) return native.setInterval.call(window, handler, delay, ...args);
    if (!current) return 0;
    const id = native.setInterval.call(window, handler, delay, ...args);
    intervals.add(id);
    return id;
  }) as typeof window.setInterval;
  window.clearInterval = ((id?: number) => {
    if (id !== undefined) intervals.delete(id);
    native.clearInterval.call(window, id);
  }) as typeof window.clearInterval;
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    const current = isCurrentRun();
    if (current === undefined) return native.requestAnimationFrame.call(window, callback);
    if (!current) return 0;
    const id: number = native.requestAnimationFrame.call(window, (time) => {
      frames.delete(id);
      callback(time);
    });
    frames.add(id);
    return id;
  };
  window.cancelAnimationFrame = (id: number) => {
    frames.delete(id);
    native.cancelAnimationFrame.call(window, id);
  };

  targets.forEach((target) => {
    const add = target.addEventListener;
    const remove = target.removeEventListener;
    // A bare `addEventListener(...)` call has no `this`. The browser takes it as window.
    target.addEventListener = function (this: EventTarget | undefined, ...args: ListenerArgs) {
      const self = this ?? window;
      const current = isCurrentRun();
      if (current === false) return;
      if (current) listeners.push([self, ...args]);
      add.apply(self, args);
    };
    target.removeEventListener = function (this: EventTarget | undefined, ...args: ListenerArgs) {
      const self = this ?? window;
      const [type, listener, options] = args;
      const index = listeners.findIndex(
        (entry) => entry[0] === self && entry[1] === type && entry[2] === listener && captureOf(entry[3]) === captureOf(options),
      );
      if (index >= 0) listeners.splice(index, 1);
      remove.apply(self, args);
    };
  });

  /** Cancels everything the reader's code scheduled and removes its listeners. */
  const clear = () => {
    timeouts.forEach((id) => native.clearTimeout.call(window, id));
    intervals.forEach((id) => native.clearInterval.call(window, id));
    frames.forEach((id) => native.cancelAnimationFrame.call(window, id));
    timeouts.clear();
    intervals.clear();
    frames.clear();
    listeners.splice(0).forEach(([target, type, listener, options]) => target.removeEventListener(type, listener, options));
  };

  /** Clears, then puts the original functions back. */
  const restore = () => {
    clear();
    Object.assign(window, native);
    targets.forEach((target) => {
      delete (target as Partial<EventTarget>).addEventListener;
      delete (target as Partial<EventTarget>).removeEventListener;
    });
  };

  return { clear, restore };
}

const OVERLAY_CSS = `
  :host([hidden]) { display: none; }
  :host { all: initial; position: fixed; inset: 0; z-index: 2147483647; overflow: auto; background: rgb(13 13 13 / 0.97); }
  .panel { box-sizing: border-box; min-height: 100%; padding: 16px; color: #d4d4d4; font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  .head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
  .kind { color: #ef4444; text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; }
  .file { color: #a3a3a3; margin-bottom: 8px; }
  button { all: unset; cursor: pointer; color: #a3a3a3; padding: 2px 6px; border: 1px solid #404040; font-size: 11px; }
  button:hover, button:focus-visible { color: #fff; border-color: #ef4444; }
  pre { margin: 0; white-space: pre-wrap; word-break: break-word; }
  .message { color: #fca5a5; margin-bottom: 12px; }
  .frame { color: #a3a3a3; padding: 8px; border: 1px solid #262626; white-space: pre; overflow-x: auto; }
  .frame:empty { display: none; }
`;

/** Error panel over the preview. Shadow DOM keeps the reader's CSS away from it. */
function createOverlay() {
  const host = document.createElement('div');
  host.setAttribute('data-playground-overlay', '');
  host.hidden = true;
  const shadow = host.attachShadow({ mode: 'closed' });
  shadow.innerHTML = `<style>${OVERLAY_CSS}</style>
    <div class="panel" role="alert">
      <div class="head"><span class="kind"></span><button type="button">Dismiss</button></div>
      <div class="file"></div>
      <pre class="message"></pre>
      <pre class="frame"></pre>
    </div>`;
  const field = (selector: string) => shadow.querySelector(selector) as HTMLElement;
  field('button').addEventListener('click', () => {
    host.hidden = true;
  });
  document.body.appendChild(host);

  return {
    show({ kind, message, file, line, frame }: PlaygroundErrorInfo) {
      // textContent only: the message can contain anything the reader typed.
      field('.kind').textContent = kind === 'compile' ? 'Compile error' : 'Runtime error';
      field('.file').textContent = file ? `${file}${line ? `:${line}` : ''}` : '';
      field('.message').textContent = message;
      field('.frame').textContent = frame ?? '';
      host.hidden = false;
    },
    hide() {
      host.hidden = true;
    },
    remove() {
      host.remove();
    },
  };
}

interface RunBoundaryProps {
  onError: (error: unknown) => void;
  children: ReactNode;
}

/** Catches render errors so one bad component shows an error, not a blank frame. */
class RunBoundary extends Component<RunBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const RenderReporter: React.FC<{ onCommit: () => void; children: ReactNode }> = ({ onCommit, children }) => {
  useEffect(onCommit, [onCommit]);
  return children;
};

/**
 * Starts listening for code from the parent page. Returns a cleanup that undoes
 * everything, for React's double effects in development.
 */
export function startPlaygroundRuntime(rootElement: HTMLElement): () => void {
  if (window.parent === window) {
    rootElement.textContent = 'This page runs the live editor of the blog. Open a post with a live editor to use it.';
    return () => {};
  }

  // Only the page that embeds this frame, on this site, may talk to it.
  const post = (message: PlaygroundRuntimeMessage) => window.parent.postMessage(message, location.origin);
  // Taken before the globals are wrapped: the runtime's own timer must survive a new run.
  const setRuntimeTimeout = window.setTimeout.bind(window);
  const clearRuntimeTimeout = window.clearTimeout.bind(window);

  const overlay = createOverlay();
  const unstripStyles = stripSiteStyles();
  let root: Root | undefined;
  let styles: HTMLStyleElement[] = [];
  let runId = -1;
  // Marks this run's files in stack traces. See PlaygroundRunOptions.tag.
  let tag = '';
  let files: Record<string, string> = {};
  let failed = false;
  let sentError = false;
  const globals = interceptGlobals(() => tag);

  // --- Messages to the parent: at most PLAYGROUND_CONSOLE_RATE_PER_SECOND a second ---
  const limiter = createRateLimiter(PLAYGROUND_CONSOLE_RATE_PER_SECOND);
  let flushTimer = 0;
  const flushSkipped = () => {
    flushTimer = 0;
    const skipped = limiter.takeSkipped();
    if (skipped) post({ source: 'playground-runtime', type: 'console', level: 'warn', text: `${skipped} console messages were skipped.` });
  };
  /** True if one more message fits in this second's budget. */
  const withinBudget = () => {
    if (limiter.take()) return true;
    if (!flushTimer) flushTimer = setRuntimeTimeout(flushSkipped, 1000);
    return false;
  };

  const reportError = (error: unknown) => {
    // Errors from before the first run come from the page itself, not the reader's code.
    if (runId < 0 || isFromOtherRun(error, tag)) return;
    const info = describeRuntimeError(error, files, tag);
    failed = true;
    overlay.show(info);
    // The first error of a run always goes out, since it sets the preview's status. Later ones share the budget.
    if (sentError && !withinBudget()) return;
    sentError = true;
    post({ source: 'playground-runtime', type: 'error', runId, error: info });
  };

  const forward = (level: PlaygroundConsoleLevel, args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production' && typeof args[0] === 'string' && DEV_NOISE.test(args[0])) return;
    if (!withinBudget()) return;
    // A log from an earlier run's leftover code would read as output of the current code.
    const caller = callerTag();
    if (caller !== undefined && caller !== tag) return;
    post({ source: 'playground-runtime', type: 'console', level, text: formatConsoleArgs(args) });
  };

  const originalConsole = CONSOLE_LEVELS.map((level) => [level, console[level]] as const);
  CONSOLE_LEVELS.forEach((level) => {
    const original = console[level];
    console[level] = (...args: unknown[]) => {
      original.apply(console, args);
      forward(level, args);
    };
  });

  const teardown = () => {
    try {
      // Unmounting runs the reader's effect cleanups, which may throw too.
      root?.unmount();
    } catch {
      // The next run starts clean either way.
    }
    root = undefined;
    globals.clear();
    styles.forEach((style) => style.remove());
    styles = [];
    overlay.hide();
  };

  const run = (nextRunId: number, entry: string, nextFiles: Record<string, string>) => {
    teardown();
    runId = nextRunId;
    tag = String(nextRunId);
    files = nextFiles;
    failed = false;
    sentError = false;

    let project;
    try {
      project = runPlaygroundProject({ files, entry, externals: EXTERNALS, tag });
    } catch (error) {
      reportError(error);
      return;
    }

    styles = project.styles.map(({ path, css }) => {
      const style = document.createElement('style');
      style.setAttribute(STYLE_MARK, path);
      style.textContent = css;
      document.head.appendChild(style);
      return style;
    });

    const container = document.createElement('div');
    rootElement.replaceChildren(container);
    const currentRun = runId;
    root = createRoot(container, {
      // The boundary reports caught errors, so React's own console.error would repeat them.
      onCaughtError: () => {},
      onUncaughtError: reportError,
      onRecoverableError: (error) => forward('warn', [error]),
    });
    const App = project.App as ComponentType;
    const onCommit = () => {
      if (!failed && runId === currentRun) post({ source: 'playground-runtime', type: 'rendered', runId: currentRun });
    };
    root.render(
      <StrictMode>
        <RunBoundary onError={reportError}>
          <RenderReporter onCommit={onCommit}>
            <App />
          </RenderReporter>
        </RunBoundary>
      </StrictMode>,
    );
  };

  const onMessage = (event: MessageEvent) => {
    if (event.source !== window.parent || event.origin !== location.origin) return;
    if (!isPlaygroundHostMessage(event.data)) return;
    const message = event.data;
    if (message.type === 'ping') post({ source: 'playground-runtime', type: 'pong' });
    else run(message.runId, message.entry, message.files);
  };
  const onError = (event: ErrorEvent) => {
    // No error object and this message: the browser hid the details. Say so plainly.
    if (event.error == null && HIDDEN_ERROR_PATTERN.test(event.message)) {
      reportError(new PlaygroundError({ kind: 'runtime', message: HIDDEN_ERROR_MESSAGE }));
    } else if (!isPageError(event.error)) reportError(event.error ?? event.message);
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    if (!isPageError(event.reason)) reportError(event.reason);
  };

  window.addEventListener('message', onMessage);
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  post({ source: 'playground-runtime', type: 'ready' });

  return () => {
    window.removeEventListener('message', onMessage);
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
    teardown();
    globals.restore();
    originalConsole.forEach(([level, original]) => {
      console[level] = original;
    });
    clearRuntimeTimeout(flushTimer);
    unstripStyles();
    overlay.remove();
  };
}
