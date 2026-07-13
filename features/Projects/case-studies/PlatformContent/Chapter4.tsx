import React from 'react';
import { Server } from 'lucide-react';

interface Chapter4Props {
  deploymentTarget: string;
  setDeploymentTarget: (target: string) => void;
  releaseNote: string;
  setReleaseNote: (note: string) => void;
  isDeploying: boolean;
  deployProgress: number;
  executeDeployment: () => void;
  scrollToSection: (id: string) => void;
  addLog: (src: string, text: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const Chapter4: React.FC<Chapter4Props> = ({
  deploymentTarget,
  setDeploymentTarget,
  releaseNote,
  setReleaseNote,
  isDeploying,
  deployProgress,
  executeDeployment,
  scrollToSection,
  addLog
}) => {
  return (
    <section id="chapter-4" className="space-y-6 pt-12 scroll-mt-24 text-left border-t-2 border-zinc-900 pb-6">
      <div className="space-y-1">
        <span className="text-[#FFC500] text-xs font-black uppercase tracking-widest block">// CHAPTER 04 // ZERO-DOWNTIME PIPELINES</span>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          Zero-Downtime Rollout &amp; Schema V2 Conversion
        </h2>
      </div>

      <div className="lead text-zinc-300 text-sm leading-relaxed space-y-4">
        <p>
          The final major challenge was migrating live applications from legacy V1 metadata layouts to structured V2 schemas without causing service interruptions.
        </p>
        <p>
          To solve this, we designed the asynchronous <button onClick={() => scrollToSection('chapter-4')} className="text-red-500 hover:text-red-400 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline font-mono">Washington Screen Converter Service</button>. The builder delegates batch conversions to this background worker, which streams real-time status updates back to the editor UI using <strong>WebSockets</strong>.
        </p>
      </div>

      {/* Simulator Bab 4 */}
      <div className="bg-[#0b0b0e] border-2 border-zinc-900 p-5 mt-4 space-y-4 rounded-lg">
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
          <span className="text-[10px] text-zinc-400 font-black uppercase flex items-center gap-1.5">
            <Server className="w-4 h-4 text-[#FFC500]" />
            SIMULATOR 4.1: MULTI-PLATFORM DEPLOYMENT PIPELINE
          </span>
          <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-900 text-[8px] font-bold">ASYNCHRONOUS BUILD</span>
        </div>

        <p className="text-[11px] text-zinc-550 leading-normal">
          Select your compilation target and click **DEPLOY TO PRODUCTION** to trigger the release build.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-black border border-zinc-850 p-4 space-y-3">
            <span className="text-[10px] text-zinc-555 block uppercase font-bold">Target Settings</span>
            
            <div className="grid grid-cols-3 gap-1">
              {['web', 'ios', 'android'].map((tgt) => (
                <button 
                  key={tgt}
                  onClick={() => {
                    setDeploymentTarget(tgt);
                    addLog("BUILD", `Changed release target platform to [${tgt.toUpperCase()}]`, "info");
                  }}
                  className={`py-1 text-[9px] font-black uppercase cursor-pointer border ${
                    deploymentTarget === tgt ? 'bg-[#FFC500] text-black border-black' : 'bg-zinc-950 text-zinc-500 border-zinc-900'
                  }`}
                >
                  {tgt}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <span className="text-[8px] text-zinc-555 block uppercase font-bold">Release Note (Changelog)</span>
              <input 
                type="text" 
                value={releaseNote}
                onChange={(e) => setReleaseNote(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 px-2 py-1 text-[11px] text-white focus:outline-none focus:border-[#FFC500]"
              />
            </div>

            <button 
              onClick={executeDeployment}
              disabled={isDeploying}
              className="w-full py-2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 text-white font-black text-xs uppercase cursor-pointer transition-colors"
            >
              {isDeploying ? 'COMPILING...' : 'DEPLOY TO PRODUCTION'}
            </button>
          </div>

          <div className="bg-black border border-zinc-850 p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-zinc-555 block uppercase font-bold">Compilation Progress</span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-xs font-black text-white">Target: {deploymentTarget.toUpperCase()}</span>
                <span className="text-[#FFC500] font-black text-xs">{deployProgress}%</span>
              </div>
              
              {/* Segmented bar */}
              <div className="flex gap-[1.5px] bg-zinc-950 p-1 border border-zinc-900 mt-2">
                {Array.from({ length: 15 }).map((_, i) => {
                  const step = (i + 1) * 6.6;
                  const isActive = deployProgress >= step;
                  return (
                    <div key={i} className={`h-3 flex-1 ${isActive ? 'bg-[#FFC500]' : 'bg-zinc-900'}`} />
                  );
                })}
              </div>
            </div>

            <div className="text-[9px] text-zinc-555 mt-2">
              • Multi-platform target compilation is active with automated rollback validation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
