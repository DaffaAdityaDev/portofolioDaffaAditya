/** Local-only API routes (pages/api/cv/*.dev.ts). They do not exist in production builds. */
export const CV_API = {
  FILES: '/api/cv/files',
  FILE: '/api/cv/file',
  COMPILE: '/api/cv/compile',
  PUBLISH: '/api/cv/publish',
} as const;

/** Main file compiled and opened first; it is the one the site's resume PDF is built from. */
export const DEFAULT_CV_MAIN = 'cv.tex';

/** Download name of a compiled main: cv.tex -> Daffa_Aditya_Rahman_CV.pdf, cv_indo.tex -> ..._CV_INDO.pdf. */
export const pdfFileName = (main: string): string => {
  const variant = main.replace(/\.tex$/, '').replace(/^cv_?/, '');
  return `Daffa_Aditya_Rahman_CV${variant ? `_${variant.toUpperCase()}` : ''}.pdf`;
};

/** The public PDF is the resume, so only CV documents may replace it. */
export const PUBLISHABLE_MAINS = ['cv.tex', 'cv_indo.tex'] as const;

export const isPublishable = (main: string): boolean => (PUBLISHABLE_MAINS as readonly string[]).includes(main);

/** The class file is shared by every document; the API only accepts writes to .tex files. */
export const isReadOnlyPath = (path: string): boolean => path.endsWith('.cls');

/** With auto compile on, the save + compile runs this long after the last edit. */
export const AUTO_COMPILE_DELAY_MS = 1500;

/** localStorage key remembering the auto compile toggle. */
export const AUTO_COMPILE_STORAGE_KEY = 'cv-editor:auto-compile';
