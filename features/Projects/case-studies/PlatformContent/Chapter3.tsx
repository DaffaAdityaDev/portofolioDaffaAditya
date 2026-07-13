import React from 'react';
import { TrendingUp } from 'lucide-react';

interface Chapter3Props {
  timelineMonth: number;
  setTimelineMonth: React.Dispatch<React.SetStateAction<number>>;
  addLog: (src: string, text: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const Chapter3: React.FC<Chapter3Props> = ({
  timelineMonth,
  setTimelineMonth,
  addLog
}) => {
  return (
    <section id="chapter-3" className="space-y-6 pt-12 scroll-mt-24 text-left border-t-2 border-zinc-900">
      <div className="space-y-1">
        <span className="text-[#FFC500] text-xs font-black uppercase tracking-widest block">// CHAPTER 03 // SCALABILITY &amp; OWNERSHIP</span>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          Scalability &amp; Trust Curve Accumulation
        </h2>
      </div>

      <div className="lead text-zinc-300 text-sm leading-relaxed space-y-4">
        <p>
          The most rewarding phase of my work on Runsystem Platform was watching my responsibilities scale alongside my <strong>trust curve</strong>.
        </p>
        <p>
          I initially joined to maintain the core drag-and-drop screen engine. Thanks to clean code standards, low regression rates, and reliable delivery, the management team incrementally expanded my ownership over core systems month after month.
        </p>
        <p>
          Within a year, my responsibilities grew to encompass:
        </p>
        <ul className="list-disc list-inside space-y-1 text-zinc-400 text-xs">
          <li><strong className="text-white">Database Relational Designer:</strong> Visually creating table relations that sync directly with the SQL database.</li>
          <li><strong className="text-white">BPMN Automated Workflows:</strong> Compiling drag-and-drop business rules into cron/SQL triggers.</li>
          <li><strong className="text-white">Enterprise Billing Core:</strong> Structuring multi-tenant gating based on Stripe/Midtrans seat allocations.</li>
        </ul>
      </div>
      
      {/* Simulator Bab 3 */}
      <div className="bg-[#0b0b0e] border-2 border-zinc-900 p-5 mt-4 space-y-4 rounded-lg">
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
          <span className="text-[10px] text-zinc-400 font-black uppercase flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#FFC500]" />
            SIMULATOR 3.1: WORKLOAD &amp; TRUST RELATION CURVE
          </span>
          <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-900 text-[8px] font-bold">12-MONTH HORIZON</span>
        </div>

        <p className="text-[11px] text-zinc-555 leading-normal">
          Move the slider timeline below to see how cumulative engineering trust correlates with the expansion of mission-critical components without developer burnout.
        </p>

        <div className="space-y-4">
          <div className="bg-black border border-zinc-850 p-4">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-zinc-400 font-bold">Development Timeline (Month {timelineMonth})</span>
              <span className="text-[#FFC500] font-black uppercase">
                {timelineMonth <= 3 ? 'PHASE 1: BASIC MODULES' : timelineMonth <= 8 ? 'PHASE 2: SCALING SYSTEM' : 'PHASE 3: FULL SYSTEM OVERLORD'}
              </span>
            </div>
            
            {/* Range slider */}
            <input 
              type="range" 
              min="1" 
              max="12" 
              value={timelineMonth} 
              onChange={(e) => {
                setTimelineMonth(parseInt(e.target.value));
                addLog("TIMELINE", `Checking timeline simulation at Month ${e.target.value}`, "info");
              }}
              className="w-full accent-[#FFC500] bg-zinc-900 rounded-lg cursor-pointer appearance-none h-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black border border-zinc-850 p-4">
              <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-2">Task Assignment Status</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-455">Low-Code UI Canvas:</span>
                  <span className="text-emerald-400 font-bold">✓ DONE</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-455">Database Schema Builder:</span>
                  <span className={timelineMonth > 3 ? 'text-emerald-400 font-bold' : 'text-zinc-600 font-bold'}>
                    {timelineMonth > 3 ? '✓ COMPLETED' : '🔒 LOCKED'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-455">BPMN Workflow Engines:</span>
                  <span className={timelineMonth > 6 ? 'text-emerald-400 font-bold' : 'text-zinc-600 font-bold'}>
                    {timelineMonth > 6 ? '✓ ACTIVE' : '🔒 LOCKED'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-455">Multi-Target Deploy &amp; Billing:</span>
                  <span className={timelineMonth > 9 ? 'text-emerald-400 font-bold' : 'text-zinc-600 font-bold'}>
                    {timelineMonth > 9 ? '✓ OPERATIONAL' : '🔒 LOCKED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-black border border-zinc-850 p-4 flex flex-col justify-between text-left">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-bold mb-1">Business Impact &amp; Team Trust</span>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  {timelineMonth <= 3 && "You successfully demonstrated engineering capability by delivering a modular, bug-free core screen canvas."}
                  {timelineMonth > 3 && timelineMonth <= 8 && "Clean design system and stable database relator layouts established trust, resulting in ownership expansion."}
                  {timelineMonth > 8 && "Exceptional performance. You hold full ownership of payment systems gating and cross-platform native deployment pipelines."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
