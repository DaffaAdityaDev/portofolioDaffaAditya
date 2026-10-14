import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { CV_SRC_DIR } from './paths';

/**
 * Compiles a cv-src main document with Tectonic (XeLaTeX). `--untrusted` disables shell-escape and other
 * unsafe primitives; the output goes to a throwaway temp dir, so cv-src never collects build files.
 */

const TECTONIC_BIN = process.env.TECTONIC_BIN || 'tectonic';
// Generous because a cold cache downloads the TeX bundle; a warm compile takes ~5 s.
const TIMEOUT_MS = 120_000;
const LOG_TAIL_CHARS = 6000;

export type CompileResult = { ok: true; pdf: Buffer } | { ok: false; error: string; log: string };

// One compile at a time: parallel runs only fight over the same Tectonic cache and CPU.
let queue: Promise<unknown> = Promise.resolve();
// The last successful compile, so Publish right after Compile (same main, untouched sources) reuses its PDF.
let lastCompile: { main: string; sourcesMs: number; pdf: Buffer } | null = null;

/** `main` must already be validated (see assertMain). */
export function compileCv(main: string): Promise<CompileResult> {
  const run = queue.then(() => compileCached(main));
  queue = run.catch(() => undefined);
  return run;
}

async function compileCached(main: string): Promise<CompileResult> {
  const sources = await newestSourceMtimes(CV_SRC_DIR);
  if (lastCompile?.main === main && lastCompile.sourcesMs === sources.anyMs) return { ok: true, pdf: lastCompile.pdf };
  const result = await runTectonic(main, sources.fileSeconds);
  lastCompile = result.ok ? { main, sourcesMs: sources.anyMs, pdf: result.pdf } : null;
  return result;
}

async function runTectonic(main: string, sourceDateEpoch: number): Promise<CompileResult> {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cv-build-'));
  try {
    const args = ['-X', 'compile', '--untrusted', path.join(CV_SRC_DIR, main), '--outdir', outDir];
    const env = { ...process.env, SOURCE_DATE_EPOCH: String(sourceDateEpoch) };
    const { error, output } = await new Promise<{ error: (Error & { code?: unknown; killed?: boolean }) | null; output: string }>(
      (resolve) => {
        execFile(TECTONIC_BIN, args, { cwd: CV_SRC_DIR, env, timeout: TIMEOUT_MS, maxBuffer: 16 * 1024 * 1024, windowsHide: true }, (err, stdout, stderr) =>
          resolve({ error: err, output: `${stdout}${stderr}` }),
        );
      },
    );
    const log = output.slice(-LOG_TAIL_CHARS);
    if (error) {
      if (error.code === 'ENOENT') return { ok: false, error: `Tectonic not found (${TECTONIC_BIN}). Install it or set TECTONIC_BIN.`, log };
      if (error.killed) return { ok: false, error: `Tectonic timed out after ${TIMEOUT_MS / 1000} s`, log };
      return { ok: false, error: firstErrorLine(output) ?? `Tectonic exited with code ${String(error.code)}`, log };
    }
    const pdf = await fs.readFile(path.join(outDir, `${path.basename(main, '.tex')}.pdf`)).catch(() => null);
    if (!pdf) return { ok: false, error: 'Tectonic finished but wrote no PDF', log };
    return { ok: true, pdf };
  } finally {
    await fs.rm(outDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

/**
 * Tectonic stamps the build time into the PDF, so identical sources would give a new hash (and a cache bust and
 * a git diff) on every publish. Pinning it to the newest source file mtime (`fileSeconds`) keeps the PDF
 * reproducible while \today still moves when the sources change. `anyMs` also counts folders, so adding or
 * deleting a file invalidates the compile cache too.
 */
async function newestSourceMtimes(dir: string): Promise<{ fileSeconds: number; anyMs: number }> {
  // @types/node 18.0 predates readdir's `recursive` option (Node 18.17+); the runtime has it.
  const readdirRecursive = fs.readdir as (dir: string, options: { recursive: true }) => Promise<string[]>;
  const entries = ['.', ...(await readdirRecursive(dir, { recursive: true }))];
  // lstat: symlinks are not followed and never count as source files.
  const stats = await Promise.all(entries.map((rel) => fs.lstat(path.join(dir, rel)).catch(() => null)));
  let fileMs = 0;
  let anyMs = 0;
  for (const stat of stats) {
    if (!stat) continue;
    if (stat.isFile()) fileMs = Math.max(fileMs, stat.mtimeMs);
    anyMs = Math.max(anyMs, stat.mtimeMs);
  }
  return { fileSeconds: Math.floor(fileMs / 1000), anyMs };
}

/**
 * Tectonic prints errors as "error: cv/summary.tex:23: Undefined control sequence", then generic ones
 * ("the XeTeX engine had an unrecoverable error"). The first is the cause.
 */
function firstErrorLine(output: string): string | null {
  const line = output.split(/\r?\n/).find((l) => l.startsWith('error:'));
  return line ? line.slice('error:'.length).trim() : null;
}
