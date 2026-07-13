import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Hash } from 'lucide-react';
import { 
  INITIAL_COMPONENTS, 
  INITIAL_DB_SCHEMAS, 
  MODULE_DETAILS 
} from './constants';
import { Chapter1 } from './Chapter1';
import { Chapter2 } from './Chapter2';
import { Chapter3 } from './Chapter3';
import { Chapter4 } from './Chapter4';

const PlatformContent: React.FC = () => {
  // --- State untuk Screen Builder ---
  const [screenComponents, setScreenComponents] = useState(INITIAL_COMPONENTS);

  // --- State untuk Database ---
  const [dbSchemas, setDbSchemas] = useState(INITIAL_DB_SCHEMAS);
  const [newTableName, setNewTableName] = useState('');
  const [relations, setRelations] = useState([
    { from: 'orders_entity.user_id', to: 'users_entity.id', type: '1-to-N' }
  ]);

  // --- State untuk Automated Workflow ---
  const [workflows, setWorkflows] = useState([
    { id: 'wf_1', trigger: 'ON_INSERT_USER', action: 'SEND_WELCOME_EMAIL', interval: 'Every 5 Mins', sql: "SELECT * FROM users_entity WHERE created_at > NOW() - INTERVAL '5 minutes'" }
  ]);
  const [newWorkflowTrigger, setNewWorkflowTrigger] = useState('ON_INSERT_USER');
  const [newWorkflowSql, setNewWorkflowSql] = useState('');

  // --- State untuk Pipeline Deployment ---
  const [deploymentTarget, setDeploymentTarget] = useState('web'); // web | ios | android
  const [appVersion, setAppVersion] = useState('v2.4.1');
  const [releaseNote, setReleaseNote] = useState('Pembaruan modul screen engine & optimasi drag-and-drop');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  // --- State untuk Manajemen Lisensi/Billing ---
  const [activeSeats, setActiveSeats] = useState(18);
  const seatLimit = 25;

  // --- State Timeline Kepercayaan (Bulan ke-1 s/d 12) ---
  const [timelineMonth, setTimelineMonth] = useState(1); // 1 sampai 12

  // --- State Terminal & Logs ---
  const [logs, setLogs] = useState([
    { id: 1, time: "15:38:00", src: "SYSTEM", text: "Runsystem Engine v2.0 connected securely.", type: "success" },
    { id: 2, time: "15:38:02", src: "YALC_MGR", text: "Successfully synced Oxford UI components from local Yalc cache.", type: "info" }
  ]);
  const logTerminalRef = useRef<HTMLDivElement>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk menambahkan log baru ke terminal konsol
  const addLog = useCallback((src: string, text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [
      ...prev.slice(-35),
      { id: Date.now() + Math.random(), time: timeStr, src, text, type }
    ]);
  }, []);

  // Menggulung otomatis terminal log saat ada entri baru
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Penanganan interaksi screen builder
  const addComponentToScreen = useCallback((type: string) => {
    const newId = `comp_${Date.now()}`;
    let label = `Custom ${type}`;
    let config = {};

    if (type === 'DataTable') {
      label = 'Sales Report Grid';
      config = { sourceTable: 'orders_entity', pages: 10 };
    } else if (type === 'PieChart') {
      label = 'User Segment Analytics';
      config = { dataRef: 'users_entity.role' };
    }

    setScreenComponents(prev => [...prev, { id: newId, type, label, config }]);
    addLog("OXFORD_COMP", `Added component [${type.toUpperCase()}] to UI JSON scheme tree.`, "success");
  }, [addLog]);

  const removeComponent = useCallback((id: string) => {
    setScreenComponents(prev => prev.filter(c => c.id !== id));
    addLog("OXFORD_COMP", `Removed component [${id}] from visual canvas state.`, "warning");
  }, [addLog]);

  // Simulasi eksekusi pipeline rilis asinkron
  const executeDeployment = useCallback(() => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployProgress(5);
    addLog("WASHINGTON_BUILD", `Initiating release build pipeline for [${deploymentTarget.toUpperCase()}] version ${appVersion}...`, "warning");

    const steps = [
      { p: 20, msg: "Validating application configuration JSON scheme v2..." },
      { p: 45, msg: "Invoking Washington Screen Converter Service..." },
      { p: 70, msg: "Compiling JSON metadata into static production bundles..." },
      { p: 90, msg: deploymentTarget === 'web' ? "Uploading static assets to AWS Cloudfront CDN..." : `Bundling device binary [${deploymentTarget === 'ios' ? 'IPA' : 'APK'}] via Capacitor wrapper...` },
      { p: 100, msg: `Pipeline complete! Version ${appVersion} is now live in Production.` }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setDeployProgress(step.p);
        addLog("WASHINGTON_BUILD", step.msg, step.p === 100 ? "success" : "info");
        if (step.p === 100) {
          setIsDeploying(false);
          setAppVersion(prev => {
            const parts = prev.replace('v', '').split('.').map(Number);
            parts[2] += 1;
            return `v${parts.join('.')}`;
          });
        }
      }, step.p * 35);
    });
  }, [isDeploying, deploymentTarget, appVersion, addLog]);

  // --- State untuk Interactive Module Selector ---
  const [diagStatus, setDiagStatus] = useState<Record<string, 'idle' | 'running' | 'success'>>({});
  const [activeModule, setActiveModule] = useState(0);
  const [openedModules, setOpenedModules] = useState<Record<string, boolean>>({ '01': true });

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const runDiagnostic = useCallback((modId: string, title: string, code: string, msg: string) => {
    if (diagStatus[modId] === 'running') return;
    setDiagStatus(prev => ({ ...prev, [modId]: 'running' }));
    addLog("DIAGNOSTIC", `Initiating visual probe on module [${code}]...`, "warning");
    
    setTimeout(() => {
      setDiagStatus(prev => ({ ...prev, [modId]: 'success' }));
      addLog("DIAGNOSTIC", `[${title}] ${msg}`, "success");
    }, 800);
  }, [diagStatus, addLog]);

  return (
    <div ref={storyContainerRef} className="w-full bg-black border-4 border-zinc-900 p-5 md:p-8 shadow-[8px_8px_0px_#111] relative space-y-12 overflow-y-visible text-zinc-100 font-mono antialiased text-left">
      
      {/* Quick Jump Daftar Ini */}
      <div className="bg-zinc-950 p-4 border-2 border-zinc-900 text-left">
        <span className="text-[10px] text-[#FFC500] font-black uppercase tracking-wider block mb-3 flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5" />
          TABLE OF CONTENTS // QUICK NAVIGATION
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button onClick={() => scrollToSection('chapter-1')} className="py-2 px-3 bg-zinc-900 hover:bg-[#FFC500] hover:text-black text-zinc-300 text-left border border-zinc-800 transition-all cursor-pointer flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-zinc-500">01</span> BACKGROUND &amp; ASSIGNMENT
          </button>
          <button onClick={() => scrollToSection('chapter-2')} className="py-2 px-3 bg-zinc-900 hover:bg-[#FFC500] hover:text-black text-zinc-300 text-left border border-zinc-800 transition-all cursor-pointer flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-zinc-500">02</span> DECOUPLING &amp; STATE ISOLATION
          </button>
          <button onClick={() => scrollToSection('chapter-3')} className="py-2 px-3 bg-zinc-900 hover:bg-[#FFC500] hover:text-black text-zinc-300 text-left border border-zinc-800 transition-all cursor-pointer flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-zinc-500">03</span> MANAGING SCALE &amp; TRUST
          </button>
          <button onClick={() => scrollToSection('chapter-4')} className="py-2 px-3 bg-zinc-900 hover:bg-[#FFC500] hover:text-black text-zinc-300 text-left border border-zinc-800 transition-all cursor-pointer flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-zinc-500">04</span> MULTI-TARGET DEPLOYMENT
          </button>
        </div>
      </div>

      {/* Chapters Component Split */}
      <Chapter1
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        openedModules={openedModules}
        setOpenedModules={setOpenedModules}
        diagStatus={diagStatus}
        runDiagnostic={runDiagnostic}
        scrollToSection={scrollToSection}
        addLog={addLog}
      />


      <Chapter2
        screenComponents={screenComponents}
        addComponentToScreen={addComponentToScreen}
        removeComponent={removeComponent}
        scrollToSection={scrollToSection}
      />

      <Chapter3
        timelineMonth={timelineMonth}
        setTimelineMonth={setTimelineMonth}
        addLog={addLog}
      />

      <Chapter4
        deploymentTarget={deploymentTarget}
        setDeploymentTarget={setDeploymentTarget}
        releaseNote={releaseNote}
        setReleaseNote={setReleaseNote}
        isDeploying={isDeploying}
        deployProgress={deployProgress}
        executeDeployment={executeDeployment}
        scrollToSection={scrollToSection}
        addLog={addLog}
      />

      {/* Console Terminal Logs Viewer */}
      <div className="bg-[#08080c] border border-zinc-850 p-4 rounded-md font-mono text-[10px]">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-2">
          <span className="text-zinc-400 font-bold uppercase flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#FFC500]" />
            SYSTEM LOG CONSOLE // TELEMETRY
          </span>
          <button 
            onClick={() => {
              setLogs([{ id: 1, time: "15:38:00", src: "SYSTEM", text: "Logs cleared.", type: "info" }]);
            }}
            className="text-[8px] text-zinc-500 hover:text-white uppercase font-bold cursor-pointer bg-transparent border-none p-0"
          >
            Clear Console
          </button>
        </div>

        <div 
          ref={logTerminalRef}
          className="max-h-32 overflow-y-auto space-y-1 scrollbar-thin text-[10px]"
        >
          {logs.map((log) => {
            const typeColor = 
              log.type === 'success' ? 'text-emerald-400' :
              log.type === 'warning' ? 'text-amber-500' :
              log.type === 'error' ? 'text-red-500' : 'text-blue-400';
            return (
              <div key={log.id} className="flex gap-2 text-left">
                <span className="text-zinc-650 flex-shrink-0">[{log.time}]</span>
                <span className={`font-semibold flex-shrink-0 uppercase ${typeColor}`}>[{log.src}]</span>
                <span className="text-zinc-300 break-all">{log.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHIP DEKORATIF BRUTALIS */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-[#FFC500]" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#FFC500]" />

      {/* CSS Brutalis Tambahan */}
      <style>{`
        /* Pola Hazard Stripes ribbon */
        .hazard-ribbon {
          background: repeating-linear-gradient(
            -45deg,
            #FFC500,
            #FFC500 10px,
            #000 10px,
            #000 20px
          );
        }

        /* Desain Scrollbar Custom */
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #000;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #1f1f22;
          border: 1px solid #000;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #FFC500;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default PlatformContent;
