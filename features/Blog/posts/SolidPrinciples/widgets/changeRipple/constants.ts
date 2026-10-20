import type { ChangeRequest, ChangeRequestId, Codebase, CodebaseId } from './types';

export const CODEBASE_ORDER: CodebaseId[] = ['tangled', 'solid'];

export const CODEBASES: Record<CodebaseId, Codebase> = {
  tangled: {
    id: 'tangled',
    label: 'Tangled',
    caption: 'each form does everything',
    files: [
      { path: 'ProfileForm.tsx', role: 'form, file picking, preview, fetch' },
      { path: 'SignupForm.tsx', role: 'a copy of the same upload code' },
      { path: 'ProfileForm.test.tsx', role: 'mocks the global fetch' },
      { path: 'TextInput.tsx', role: 'onChange gets a string, drops disabled' },
      { path: 'Navbar.tsx', role: 'shows the user name' },
      { path: 'api/session.ts', role: 'returns the name and avatarUrl' },
    ],
  },
  solid: {
    id: 'solid',
    label: 'SOLID',
    caption: 'split by reason to change',
    files: [
      { path: 'ProfileForm.tsx', role: 'layout and submit' },
      { path: 'SignupForm.tsx', role: 'reuses AvatarPicker and the Uploader' },
      { path: 'ProfileForm.test.tsx', role: 'passes a fake Uploader' },
      { path: 'TextInput.tsx', role: 'keeps every <input> prop' },
      { path: 'Navbar.tsx', role: 'shows the user name' },
      { path: 'api/session.ts', role: 'returns the name and avatarUrl' },
      { path: 'AvatarPicker.tsx', role: 'renders the list of sources' },
      { path: 'sources/index.ts', role: 'the list of avatar sources' },
      { path: 'services/uploader.ts', role: 'the Uploader type and the default one' },
    ],
  },
};

export const CHANGE_REQUEST_ORDER: ChangeRequestId[] = ['presigned', 'gravatar', 'navbar', 'textInput', 'layout'];

export const CHANGE_REQUESTS: Record<ChangeRequestId, ChangeRequest> = {
  presigned: {
    id: 'presigned',
    label: 'Upload straight to S3',
    letters: ['D', 'S'],
    edits: {
      tangled: [
        { path: 'ProfileForm.tsx', kind: 'edited', why: 'its fetch call is rewritten' },
        { path: 'SignupForm.tsx', kind: 'edited', why: 'the copied fetch call too' },
        { path: 'ProfileForm.test.tsx', kind: 'edited', why: 'the fetch mock no longer matches' },
      ],
      solid: [{ path: 'services/uploader.ts', kind: 'edited', why: 'a new Uploader body, same type' }],
    },
    lesson: 'Dependency Inversion: the forms and the test know the Uploader type, not fetch, so only the code behind the type changes.',
  },
  gravatar: {
    id: 'gravatar',
    label: 'Add Gravatar as a source',
    letters: ['O'],
    edits: {
      tangled: [
        { path: 'ProfileForm.tsx', kind: 'edited', why: 'add a source switch and the Gravatar download code' },
        { path: 'SignupForm.tsx', kind: 'edited', why: 'the same switch and code, copied' },
      ],
      solid: [
        { path: 'sources/gravatar.tsx', kind: 'new', why: 'the Gravatar source' },
        { path: 'sources/fetchGravatarFile.ts', kind: 'new', why: 'downloads the picture as a File' },
        { path: 'sources/index.ts', kind: 'edited', why: 'an import and 1 entry in the list' },
      ],
    },
    lesson: 'Open/Closed: AvatarPicker renders any source in the list, so the new case is new files plus 2 lines in the list, not an edit to working code.',
  },
  navbar: {
    id: 'navbar',
    label: 'Show the avatar in the navbar',
    letters: ['I'],
    edits: {
      tangled: [
        { path: 'Navbar.tsx', kind: 'edited', why: 'render <AvatarBadge user={user}>' },
        { path: 'api/session.ts', kind: 'edited', why: 'load the full User so the badge can render' },
        { path: 'AvatarBadge.tsx', kind: 'new', why: 'takes a full User' },
      ],
      solid: [
        { path: 'Navbar.tsx', kind: 'edited', why: 'render <AvatarBadge> with session fields' },
        { path: 'AvatarBadge.tsx', kind: 'new', why: 'takes name and avatarUrl only' },
      ],
    },
    lesson:
      'Interface Segregation: both versions add a badge. The tangled one asks for a full User, so the session code has to load one. The SOLID one asks for the 2 fields the navbar already has.',
  },
  textInput: {
    id: 'textInput',
    label: 'Use our TextInput in the forms',
    letters: ['L'],
    edits: {
      tangled: [
        { path: 'ProfileForm.tsx', kind: 'edited', why: 'swap the tag and rewrite every onChange' },
        { path: 'SignupForm.tsx', kind: 'edited', why: 'swap the tag and rewrite every onChange' },
        { path: 'TextInput.tsx', kind: 'edited', why: 'fix disabled and className, found in testing' },
      ],
      solid: [
        { path: 'ProfileForm.tsx', kind: 'edited', why: 'swap the tag, nothing else' },
        { path: 'SignupForm.tsx', kind: 'edited', why: 'swap the tag, nothing else' },
      ],
    },
    lesson: 'Liskov Substitution: both versions edit the 2 forms, since that is the change. Only the TextInput that keeps the <input> contract drops in without other edits.',
  },
  layout: {
    id: 'layout',
    label: 'Change the form layout',
    letters: ['S'],
    edits: {
      tangled: [{ path: 'ProfileForm.tsx', kind: 'edited', why: 'the markup sits next to fetch and file code' }],
      solid: [{ path: 'ProfileForm.tsx', kind: 'edited', why: 'the file holds only layout and submit' }],
    },
    lesson: 'Single Responsibility: the count is the same, but in the tangled file a layout edit sits next to the upload code and can break it.',
  },
};
