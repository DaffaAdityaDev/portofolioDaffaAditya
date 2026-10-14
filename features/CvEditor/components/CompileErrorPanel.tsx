import React from 'react';
import type { CvCompileFailure } from '../types';

/** The 422 from /api/cv/compile: the error line and the tail of the Tectonic log. */
const CompileErrorPanel: React.FC<{ failure: CvCompileFailure }> = ({ failure }) => (
  <section role="alert" className="border-b border-red-500/40 bg-red-500/5">
    <p className="px-4 pt-3 font-mono text-[10px] uppercase tracking-widest text-red-400">Compile failed</p>
    <p className="px-4 pt-1 pb-3 font-mono text-xs text-red-200">{failure.error}</p>
    {failure.log && (
      <pre className="max-h-64 overflow-auto border-t border-red-500/20 px-4 py-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-neutral-300">
        {failure.log}
      </pre>
    )}
  </section>
);

export default CompileErrorPanel;
