/** One letter of SOLID. */
export type SolidLetter = 'S' | 'O' | 'L' | 'I' | 'D';

/** The same feature written twice: everything in one place, and split by the 5 principles. */
export type CodebaseId = 'tangled' | 'solid';

export type ChangeRequestId = 'presigned' | 'gravatar' | 'navbar' | 'textInput' | 'layout';

/** A file that exists before any change is made. */
export interface RippleFile {
  path: string;
  /** What the file holds, in a few words. */
  role: string;
}

/** What a change request does to one file. Files it does not list stay untouched. */
export interface FileEdit {
  path: string;
  kind: 'edited' | 'new';
  /** Why this file has to change. */
  why: string;
}

export interface ChangeRequest {
  id: ChangeRequestId;
  label: string;
  /** The principles that keep this change small in the SOLID version. */
  letters: SolidLetter[];
  edits: Record<CodebaseId, FileEdit[]>;
  /** One line under the columns: what made the difference. */
  lesson: string;
}

export interface Codebase {
  id: CodebaseId;
  label: string;
  caption: string;
  files: RippleFile[];
}
