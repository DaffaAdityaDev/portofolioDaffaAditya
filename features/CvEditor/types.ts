/** A source file opened in the editor: what is on screen and what was last read from or written to disk. */
export interface CvFileBuffer {
  content: string;
  saved: string;
}

export type CvCompileStatus = 'idle' | 'compiling' | 'ok' | 'error';

/** Body of a 422 from /api/cv/compile: the error line and the tail of the Tectonic output. */
export interface CvCompileFailure {
  error: string;
  log: string;
}

export type CvPublishStatus = 'idle' | 'publishing' | 'done' | 'error';

/** Body of a successful /api/cv/publish. */
export interface CvPublishResult {
  path: string;
  hash: string;
}
