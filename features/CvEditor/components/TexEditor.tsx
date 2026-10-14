import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { stex } from '@codemirror/legacy-modes/mode/stex';
import { EditorView } from '@codemirror/view';

// Match the page background instead of the default dark theme's grey.
const EDITOR_THEME = EditorView.theme(
  {
    '&': { backgroundColor: '#0a0a0a', height: '100%', fontSize: '13px' },
    '.cm-gutters': { backgroundColor: '#0a0a0a', borderRight: '1px solid #262626', color: '#525252' },
    '.cm-activeLineGutter, .cm-activeLine': { backgroundColor: 'rgba(239, 68, 68, 0.06)' },
    '.cm-cursor': { borderLeftColor: '#ef4444' },
  },
  { dark: true }
);

const EXTENSIONS = [StreamLanguage.define(stex), EditorView.lineWrapping, EDITOR_THEME];

interface TexEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

/**
 * CodeMirror with LaTeX highlighting. Browser-only: load it with next/dynamic and ssr: false.
 * Uncontrolled: `value` is only the initial text, so remount it (key) to show another file.
 */
const TexEditor: React.FC<TexEditorProps> = ({ value, onChange, readOnly = false }) => {
  const [initial] = useState(value);
  return (
    <CodeMirror
      value={initial}
      onChange={onChange}
      readOnly={readOnly}
      theme="dark"
      extensions={EXTENSIONS}
      height="100%"
      className="h-full"
    />
  );
};

export default TexEditor;
