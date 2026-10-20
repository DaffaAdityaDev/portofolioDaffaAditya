import React from 'react';
import dynamic from 'next/dynamic';
import { isReadOnlyPath } from '../constants';
import { useCvEditor } from '../hooks/useCvEditor';
import CvToolbar from './CvToolbar';
import FileSidebar from './FileSidebar';
import PdfPreview from './PdfPreview';
import CompileErrorPanel from './CompileErrorPanel';

const EditorPlaceholder = () => (
  <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-neutral-600">Loading…</div>
);

// CodeMirror needs the DOM, so it only loads in the browser.
const TexEditor = dynamic(() => import('./TexEditor'), { ssr: false, loading: EditorPlaceholder });

/**
 * Local CV editor: edit the LaTeX in cv-src, compile it with Tectonic through /api/cv/*, preview
 * the PDF and publish it as the site's resume. Development builds only (pages/cv.dev.tsx).
 */
const CvEditor: React.FC = () => {
  const editor = useCvEditor();
  const { openPath, openContent, openFailed } = editor;
  const readOnly = openPath ? isReadOnlyPath(openPath) : false;

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white lg:h-screen">
      <CvToolbar
        mains={editor.mains}
        main={editor.main}
        onMainChange={editor.setMain}
        dirtyCount={editor.dirtyPaths.size}
        compileStatus={editor.compileStatus}
        compileMs={editor.compileMs}
        onCompile={() => void editor.compile()}
        autoCompile={editor.autoCompile}
        onToggleAutoCompile={editor.toggleAutoCompile}
        pdfUrl={editor.pdfUrl}
        publishStatus={editor.publishStatus}
        published={editor.published}
        onPublish={() => void editor.publish()}
      />

      {editor.actionError && (
        <p role="alert" className="border-b border-red-500/40 bg-red-500/5 px-4 py-2 font-mono text-xs text-red-300">
          {editor.actionError}
        </p>
      )}

      {/* Sidebar, source and preview side by side on desktop; stacked on mobile. */}
      <div className="flex flex-col lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[14rem_minmax(0,1fr)_minmax(0,1fr)]">
        <FileSidebar files={editor.files} mains={editor.mains} openPath={openPath} dirtyPaths={editor.dirtyPaths} onOpen={editor.openFile} />

        <section aria-label="Source" className="flex h-[65vh] min-h-0 flex-col border-b border-neutral-800 lg:h-auto lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            <span className="truncate normal-case tracking-normal text-neutral-300">{openPath ?? 'No file'}</span>
            {openPath && editor.dirtyPaths.has(openPath) && <span className="text-red-400">modified</span>}
            {readOnly && <span className="ml-auto">read-only</span>}
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            {openPath && openContent !== undefined ? (
              <TexEditor key={openPath} value={openContent} onChange={editor.editOpenFile} readOnly={readOnly} />
            ) : openFailed ? (
              <p role="alert" className="flex h-full items-center justify-center px-4 text-center font-mono text-xs text-red-300">
                Could not load this file. Open it again to retry.
              </p>
            ) : (
              <EditorPlaceholder />
            )}
          </div>
        </section>

        <section aria-label="Preview" className="flex h-[85vh] min-h-0 flex-col lg:h-auto">
          {editor.compileFailure && <CompileErrorPanel failure={editor.compileFailure} />}
          <div className="min-h-0 flex-1">
            <PdfPreview pdfUrl={editor.pdfUrl} pdfName={editor.pdfName} status={editor.compileStatus} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default CvEditor;
