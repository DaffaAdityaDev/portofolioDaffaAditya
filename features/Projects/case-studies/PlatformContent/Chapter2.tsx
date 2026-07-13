import React from 'react';
import { Code, Plus, Trash2 } from 'lucide-react';

interface ComponentItem {
  id: string;
  type: string;
  label: string;
  config: Record<string, any>;
}

interface Chapter2Props {
  screenComponents: ComponentItem[];
  addComponentToScreen: (type: string) => void;
  removeComponent: (id: string) => void;
  scrollToSection: (id: string) => void;
}

export const Chapter2: React.FC<Chapter2Props> = ({
  screenComponents,
  addComponentToScreen,
  removeComponent,
  scrollToSection
}) => {
  return (
    <section id="chapter-2" className="space-y-6 pt-12 scroll-mt-24 text-left border-t-2 border-zinc-900">
      <div className="space-y-1">
        <span className="text-[#FFC500] text-xs font-black uppercase tracking-widest block">// CHAPTER 02 // ARCHITECTURAL DECISION</span>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          State Isolation &amp; Bounded Library (Oxford Core)
        </h2>
      </div>

      <div className="lead text-zinc-300 text-sm leading-relaxed space-y-4">
        <p>
          As a Frontend Engineer, my decision went beyond simple code refactoring. We engineered a full <strong>decoupling</strong> architecture:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-zinc-400">
          <li>
            Extracting all 54 standard visual components into a dedicated, standalone repository: the <button onClick={() => scrollToSection('chapter-2')} className="text-red-500 hover:text-red-400 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline font-mono">Oxford UI Library</button>.
          </li>
          <li>
            Leveraging <span className="text-red-500 font-bold">Zustand</span> to isolate transient editor state transitions, enabling zero-latency undo/redo actions without triggering cascading re-renders on the parent Next.js application tree.
          </li>
          <li>
            Implementing a rapid local package sync pipeline via <span className="text-red-500 font-bold">yalc</span> to bypass package cache issues common in traditional NPM link workflows.
          </li>
        </ol>
      </div>

      {/* Simulator Bab 2 */}
      <div className="bg-[#0b0b0e] border-2 border-zinc-900 p-5 mt-4 space-y-4 rounded-lg">
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
          <span className="text-[10px] text-zinc-400 font-black uppercase flex items-center gap-1.5">
            <Code className="w-4 h-4 text-[#FFC500]" />
            SIMULATOR 2.1: WORKSPACE STATE ISOLATION
          </span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 text-[8px] font-bold">V2.0 SCHEMA</span>
        </div>

        <p className="text-[11px] text-zinc-555 leading-normal">
          Try adding components from the toolbox below to see how the Oxford Engine renders layouts dynamically and generates clean metadata contracts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black border border-zinc-850 p-3 space-y-2">
            <span className="text-[9px] text-zinc-500 block uppercase font-bold">Component Toolbox</span>
            <div className="grid grid-cols-1 gap-1.5 text-[10px]">
              <button onClick={() => addComponentToScreen('Navbar')} className="py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-900 cursor-pointer flex items-center justify-center gap-1">
                <Plus className="w-3 h-3 text-[#FFC500]" /> Navbar
              </button>
              <button onClick={() => addComponentToScreen('FormCard')} className="py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-900 cursor-pointer flex items-center justify-center gap-1">
                <Plus className="w-3 h-3 text-[#FFC500]" /> Form Card
              </button>
              <button onClick={() => addComponentToScreen('DataTable')} className="py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-900 cursor-pointer flex items-center justify-center gap-1">
                <Plus className="w-3 h-3 text-[#FFC500]" /> Data Table
              </button>
            </div>
          </div>

          <div className="md:col-span-2 bg-black border border-zinc-850 p-3 flex flex-col justify-between">
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase font-bold border-b border-zinc-900 pb-1">Live Canvas Preview</span>
              <div className="space-y-1.5 mt-2 max-h-24 overflow-y-auto scrollbar-thin">
                {screenComponents.map((comp) => (
                  <div key={comp.id} className="bg-zinc-950 border border-zinc-900 p-2 flex items-center justify-between text-[10px]">
                    <span className="text-zinc-300 font-bold">[{comp.type}] {comp.label}</span>
                    <button onClick={() => removeComponent(comp.id)} className="text-zinc-600 hover:text-red-500 p-1 cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-zinc-900">
              <span className="text-[8px] text-zinc-500 block uppercase font-bold">Generated JSON Metadata Contract:</span>
              <pre className="text-[8px] text-emerald-400 bg-zinc-950 p-1.5 mt-1 border border-zinc-900 max-h-16 overflow-y-auto">
                {JSON.stringify(screenComponents)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
