import { promises as fs } from 'fs';
import path from 'path';

/**
 * Where the /cv editor may read and write. Every path from a request goes through `resolveCvPath`, which
 * only accepts plain relative POSIX paths to .tex (and, for reading, .cls) files inside cv-src.
 */

export const REPO_ROOT = process.cwd();
export const CV_SRC_DIR = path.resolve(REPO_ROOT, process.env.CV_SRC_DIR || 'cv-src');

const READ_EXTENSIONS = ['.tex', '.cls'];
const WRITE_EXTENSIONS = ['.tex'];
// No hidden segments, no spaces or shell-ish characters: the editor only ever needs names like cv/experience.tex.
const SEGMENT = /^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/;
// A real \documentclass line, not one in a comment.
const DOCUMENTCLASS = /^[ \t]*\\documentclass\b/m;

export class CvPathError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 = 400,
  ) {
    super(message);
  }
}

/** Resolves a request path to an absolute file in cv-src, or throws CvPathError. Does not check that it exists. */
function resolveCvPath(rel: unknown, mode: 'read' | 'write'): string {
  if (typeof rel !== 'string' || !rel) throw new CvPathError('Missing path');
  if (rel.includes('\\') || rel.includes('\0') || rel.startsWith('/') || path.isAbsolute(rel)) {
    throw new CvPathError('Path must be relative and use forward slashes');
  }
  const segments = rel.split('/');
  if (segments.some((s) => s === '..' || !SEGMENT.test(s))) throw new CvPathError('Invalid path');
  const allowed = mode === 'write' ? WRITE_EXTENSIONS : READ_EXTENSIONS;
  if (!allowed.includes(path.extname(rel).toLowerCase())) {
    throw new CvPathError(`Only ${allowed.join(' and ')} files can be ${mode === 'write' ? 'written' : 'read'}`);
  }
  const abs = path.resolve(CV_SRC_DIR, ...segments);
  if (!isInside(abs, CV_SRC_DIR)) throw new CvPathError('Path is outside cv-src');
  return abs;
}

/** Follows symlinks so a link inside cv-src cannot point outside it. Null when the file does not exist. */
async function realPathInside(abs: string): Promise<string | null> {
  const real = await fs.realpath(abs).catch(() => null);
  if (real && !isInside(real, await fs.realpath(CV_SRC_DIR))) throw new CvPathError('Path is outside cv-src');
  return real;
}

/** An existing file to read or overwrite (symlinks followed), or null when there is none. */
export async function resolveExistingCvPath(rel: unknown, mode: 'read' | 'write'): Promise<string | null> {
  return realPathInside(resolveCvPath(rel, mode));
}

/** A .tex path to write: an existing file (symlinks followed) or a new one in a folder that already exists. */
export async function resolveWritableCvPath(rel: unknown): Promise<string> {
  const abs = resolveCvPath(rel, 'write');
  const existing = await realPathInside(abs);
  if (existing) return existing;
  const realRoot = await fs.realpath(CV_SRC_DIR);
  const parent = await fs.realpath(path.dirname(abs)).catch(() => null);
  if (!parent) throw new CvPathError('Folder does not exist', 404);
  if (parent !== realRoot && !isInside(parent, realRoot)) throw new CvPathError('Path is outside cv-src');
  return path.join(parent, path.basename(abs));
}

function isInside(abs: string, root: string): boolean {
  const relative = path.relative(root, abs);
  return !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

/** A main document is a top-level .tex file with a \documentclass, i.e. one Tectonic can compile. */
const isTopLevelTex = (name: string) => SEGMENT.test(name) && name.toLowerCase().endsWith('.tex');
const hasDocumentclass = async (name: string) => DOCUMENTCLASS.test(await fs.readFile(path.join(CV_SRC_DIR, name), 'utf8'));

/** Throws CvPathError unless `main` names a main document. Only reads that one file. */
export async function assertMain(main: unknown): Promise<string> {
  if (typeof main !== 'string' || !isTopLevelTex(main)) throw new CvPathError('Unknown main document');
  const stat = await fs.lstat(path.join(CV_SRC_DIR, main)).catch(() => null);
  if (!stat?.isFile() || !(await hasDocumentclass(main))) throw new CvPathError('Unknown main document');
  return main;
}

/**
 * Every .tex and .cls under cv-src as relative POSIX paths (main documents first, then the rest sorted), plus
 * the main documents themselves (sorted).
 */
export async function listCvFiles(): Promise<{ files: string[]; mains: string[] }> {
  const found: string[] = [];
  const topLevelTex: string[] = [];
  async function walk(dir: string, prefix: string) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      if (!SEGMENT.test(entry.name)) continue;
      const rel = prefix + entry.name;
      if (entry.isDirectory()) await walk(path.join(dir, entry.name), `${rel}/`);
      else if (entry.isFile() && READ_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
        found.push(rel);
        if (!prefix && isTopLevelTex(entry.name)) topLevelTex.push(rel);
      }
    }
  }
  await walk(CV_SRC_DIR, '');
  const isMain = await Promise.all(topLevelTex.map(hasDocumentclass));
  const mains = topLevelTex.filter((_, i) => isMain[i]).sort();
  return { files: [...mains, ...found.filter((f) => !mains.includes(f)).sort()], mains };
}
