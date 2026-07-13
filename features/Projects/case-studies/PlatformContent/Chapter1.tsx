import React from 'react';
import { Activity, Play, Pause } from 'lucide-react';
import { MODULE_DETAILS } from './constants';

interface Chapter1Props {
  activeModule: number;
  setActiveModule: (idx: number) => void;
  openedModules: Record<string, boolean>;
  setOpenedModules: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  diagStatus: Record<string, 'idle' | 'running' | 'success'>;
  runDiagnostic: (modId: string, title: string, code: string, msg: string) => void;
  scrollToSection: (id: string) => void;
  addLog: (src: string, text: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const Chapter1: React.FC<Chapter1Props> = ({
  activeModule,
  setActiveModule,
  openedModules,
  setOpenedModules,
  diagStatus,
  runDiagnostic,
  scrollToSection,
  addLog
}) => {
  interface CanvasItem {
    id: string;
    type: string;
    colSpan: number;
    labelText?: string;
    accentColor?: string; // 'default' | 'yellow' | 'red'
  }

  const [canvasComponents, setCanvasComponents] = React.useState<CanvasItem[]>([
    { id: 'initial-1', type: 'Navbar', colSpan: 2, labelText: '▲ RUNSYSTEM', accentColor: 'default' },
    { id: 'initial-2', type: 'Hero', colSpan: 2, labelText: 'DECOUPLED BUILDER CANVAS', accentColor: 'yellow' }
  ]);
  const [layoutMode, setLayoutMode] = React.useState<'flex-col' | 'grid-2' | 'flex-row'>('flex-col');
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null);
  const dragCounter = React.useRef(0);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      setDragOverIndex(canvasComponents.length);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setDragOverIndex(canvasComponents.length);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    const targetIdx = dragOverIndex;
    setDragOverIndex(null);
    
    // Check if dropping an existing component on the canvas background
    const sourceIdxStr = e.dataTransfer.getData('text/canvas-index');
    if (sourceIdxStr !== '') {
      const sourceIdx = parseInt(sourceIdxStr);
      setCanvasComponents(prev => {
        const result = [...prev];
        const [removed] = result.splice(sourceIdx, 1);
        const insertAt = targetIdx !== null ? (targetIdx > sourceIdx ? targetIdx - 1 : targetIdx) : result.length;
        result.splice(insertAt, 0, removed);
        return result;
      });
      addLog("CANVAS", "Reordered component location.", "success");
      return;
    }

    const type = e.dataTransfer.getData('text/plain');
    if (type && !type.startsWith('canvas:')) {
      const newId = `comp_${Date.now()}_${Math.random()}`;
      const defaultSpan = (type === 'Navbar' || type === 'Footer') ? 2 : 1;
      const defaultLabel = type === 'Navbar' ? '▲ RUNSYSTEM' : 
                           type === 'Hero' ? 'DECOUPLED BUILDER CANVAS' :
                           type === 'Form' ? 'Form Gating' :
                           type === 'Grid' ? 'Data Query Grid' :
                           type === 'Footer' ? '© 2026 Runsystem Platform Inc.' : 'Custom Card';
      setCanvasComponents(prev => {
        const result = [...prev];
        const insertAt = targetIdx !== null ? targetIdx : result.length;
        result.splice(insertAt, 0, { id: newId, type, colSpan: defaultSpan, labelText: defaultLabel, accentColor: 'default' });
        return result;
      });
      setSelectedComponentId(newId);
      addLog("CANVAS", `Added visual component: [${type.toUpperCase()}]`, "success");
    }
  };

  const renderMockComponent = (item: CanvasItem, index: number) => {
    const { type, colSpan, labelText, accentColor, id } = item;
    const isFlexRow = layoutMode === 'flex-row';
    const isGrid = layoutMode === 'grid-2';
    const isSelected = selectedComponentId === id;
    
    // Grid spanning classes
    const gridSpanClass = isGrid ? (colSpan === 2 ? 'col-span-1 sm:col-span-2' : 'col-span-1') : '';
    // Border colors depending on selection and accent color
    const accentBorder = 
      isSelected ? 'border-[#FFC500] ring-1 ring-[#FFC500]/30' :
      accentColor === 'yellow' ? 'border-amber-400 bg-amber-50/10' :
      accentColor === 'red' ? 'border-red-400 bg-red-50/10' : 'border-zinc-200';

    // Adjust height and sizing depending on the layout mode to keep it extremely balanced
    const baseStyle = `rounded bg-white p-3 text-left relative group/comp transition-all duration-300 cursor-pointer ${gridSpanClass} ${accentBorder} ${
      isFlexRow ? 'flex-1 min-w-[160px] max-w-[280px] h-[100px] flex flex-col justify-between' : 
      isGrid ? 'h-[110px] flex flex-col justify-between' : ''
    } border`;

    const dragHandlers = {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        // Set both index and type prefix to allow browser drag initiation and distinguish source
        e.dataTransfer.setData('text/canvas-index', String(index));
        e.dataTransfer.setData('text/plain', `canvas:${item.type}`);
        addLog("CANVAS", `Started dragging canvas component [${type.toUpperCase()}].`, "info");
      },
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragOverIndex !== index) {
          setDragOverIndex(index);
        }
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverIndex(null);
        const sourceIdxStr = e.dataTransfer.getData('text/canvas-index');
        if (sourceIdxStr !== '') {
          const sourceIdx = parseInt(sourceIdxStr);
          if (sourceIdx !== index) {
            setCanvasComponents(prev => {
              const result = [...prev];
              const [removed] = result.splice(sourceIdx, 1);
              result.splice(index, 0, removed);
              return result;
            });
            addLog("CANVAS", `Reordered component: moved to position ${index + 1}.`, "success");
          }
        } else {
          const paletteType = e.dataTransfer.getData('text/plain');
          if (paletteType && !paletteType.startsWith('canvas:')) {
            const newId = `comp_${Date.now()}_${Math.random()}`;
            const defaultSpan = (paletteType === 'Navbar' || paletteType === 'Footer') ? 2 : 1;
            const defaultLabel = paletteType === 'Navbar' ? '▲ RUNSYSTEM' : 
                                 paletteType === 'Hero' ? 'DECOUPLED BUILDER CANVAS' :
                                 paletteType === 'Form' ? 'Form Gating' :
                                 paletteType === 'Grid' ? 'Data Query Grid' :
                                 paletteType === 'Footer' ? '© 2026 Runsystem Platform Inc.' : 'Custom Card';
            setCanvasComponents(prev => {
              const result = [...prev];
              result.splice(index, 0, { id: newId, type: paletteType, colSpan: defaultSpan, labelText: defaultLabel, accentColor: 'default' });
              return result;
            });
            setSelectedComponentId(newId);
            addLog("CANVAS", `Inserted [${paletteType.toUpperCase()}] at position ${index + 1}.`, "success");
          }
        }
      }
    };
    
    const deleteBtn = (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setCanvasComponents(prev => prev.filter(c => c.id !== id));
          if (isSelected) setSelectedComponentId(null);
          addLog("CANVAS", `Removed component [${type.toUpperCase()}] from layout tree.`, "warning");
        }}
        className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 cursor-pointer hidden group-hover/comp:block text-[9px] font-bold leading-none bg-white px-1 py-0.5 border border-zinc-200 rounded z-10 font-mono"
      >
        ×
      </button>
    );

    if (type === 'Navbar') {
      return (
        <div key={id} onClick={() => setSelectedComponentId(id)} {...dragHandlers} className={`${baseStyle} ${isFlexRow || isGrid ? 'w-full max-w-none' : ''}`}>
          {deleteBtn}
          <div className="flex justify-between items-center text-[9px] font-mono">
            <span className={`font-bold tracking-wider ${accentColor === 'yellow' ? 'text-amber-600' : accentColor === 'red' ? 'text-red-600' : 'text-zinc-900'}`}>
              {labelText || '▲ RUNSYSTEM'}
            </span>
            <div className="flex gap-2 text-zinc-400 font-sans">
              <span>Home</span>
              {!isFlexRow && <span>Analytics</span>}
            </div>
          </div>
        </div>
      );
    }
    
    if (type === 'Hero') {
      return (
        <div key={id} onClick={() => setSelectedComponentId(id)} {...dragHandlers} className={`${baseStyle} ${isFlexRow || isGrid ? 'py-3' : 'py-6'} text-center border-dashed`}>
          {deleteBtn}
          <h4 className={`text-[9px] font-black uppercase tracking-widest ${accentColor === 'yellow' ? 'text-amber-600' : accentColor === 'red' ? 'text-red-600' : 'text-zinc-900'}`}>
            // {labelText || 'SANDBOX'} //
          </h4>
          <div className="text-[8px] text-zinc-500 font-sans max-w-xs mx-auto mt-0.5 leading-snug">
            Empowering builders to orchestrate interfaces visually.
          </div>
        </div>
      );
    }

    if (type === 'Form') {
      return (
        <div key={id} onClick={() => setSelectedComponentId(id)} {...dragHandlers} className={baseStyle}>
          {deleteBtn}
          <span className={`text-[8px] uppercase tracking-wider block mb-1 font-mono ${accentColor === 'yellow' ? 'text-amber-600' : accentColor === 'red' ? 'text-red-600' : 'text-zinc-400'}`}>
            {labelText || 'Form Gating'}
          </span>
          <div className="flex gap-1">
            <input 
              type="text" 
              placeholder="Email..." 
              disabled 
              className="flex-1 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 text-[8px] text-zinc-600 rounded cursor-pointer"
            />
            <button className="px-2 bg-zinc-100 border border-zinc-200 text-zinc-600 font-bold text-[8px] uppercase tracking-wider rounded cursor-pointer">
              GO
            </button>
          </div>
        </div>
      );
    }

    if (type === 'Grid') {
      return (
        <div key={id} onClick={() => setSelectedComponentId(id)} {...dragHandlers} className={baseStyle}>
          {deleteBtn}
          <span className={`text-[8px] uppercase tracking-wider block mb-1 font-mono ${accentColor === 'yellow' ? 'text-amber-600' : accentColor === 'red' ? 'text-red-600' : 'text-zinc-400'}`}>
            {labelText || 'Data Query Grid'}
          </span>
          <div className="border border-zinc-200 text-[7px] font-mono text-zinc-500 leading-normal">
            <div className="bg-zinc-50 flex justify-between px-1 border-b border-zinc-200 font-bold">
              <span>RESOURCE</span>
              <span>STATUS</span>
            </div>
            <div className="flex justify-between px-1">
              <span>orders_entity</span>
              <span className="text-emerald-600 font-bold">● LIVE</span>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'Footer') {
      return (
        <div key={id} onClick={() => setSelectedComponentId(id)} {...dragHandlers} className={`${baseStyle} py-2 text-center flex items-center justify-center`}>
          {deleteBtn}
          <span className={`text-[8px] font-mono ${accentColor === 'yellow' ? 'text-amber-600' : accentColor === 'red' ? 'text-red-600' : 'text-zinc-400'}`}>
            {labelText || '© 2026 Runsystem Platform Inc.'}
          </span>
        </div>
      );
    }

    return null;
  };

  const selectedComp = canvasComponents.find(c => c.id === selectedComponentId);

  return (
    <section id="chapter-1" className="space-y-6 pt-6 scroll-mt-24 text-left border-t-2 border-zinc-900">
      <div className="space-y-1">
        <span className="text-[#FFC500] text-xs font-black uppercase tracking-widest block">// CHAPTER 01 // BACKGROUND &amp; ASSIGNMENT</span>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          Runtime Engine Improvement &amp; Maintenance
        </h2>
      </div>

      <div className="lead text-zinc-300 text-sm leading-relaxed space-y-4">
        <p>
          As a <strong className="text-red-500 font-bold">Frontend Engineer</strong> at <span className="text-blue-500 font-bold">Runsystem Platform</span>, I owned the client-side architecture for our enterprise-scale <em>low-code/no-code builder</em> ecosystem. The core mission of the platform was to empower customers to visually orchestrate custom business tools (including screen layout grids, BPMN 2.0 workflow pipelines, and relational database schemas) without manually writing code.
        </p>
        <p>
          The primary focus of my assignment was to resolve latency bottlenecks when dragging heavy interface nodes inside the <strong className="text-red-500 font-bold">editor</strong>. Architecturally, all UI components are packaged in a separate, <button onClick={() => scrollToSection('chapter-2')} className="text-red-500 hover:text-red-400 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline font-mono">external NPM library</button> and installed modularly. This decoupled structure offers massive benefits for code <em>maintainability</em> and isolates the rendering thread. From deep runtime profiling, we targeted and resolved <em>main-thread starvation</em> caused by synchronous DOM layout calculations (<em>cascading renders</em>) triggered inside the component package.
        </p>
        <p>
          Beyond optimizing the visual drag-and-drop editor canvas, my development and maintenance coverage spanned the builder's entire feature set. Probe the subsystem modules below to inspect the architectural specifications and trigger active diagnostics:
        </p>
        
        <div className="flex flex-col md:flex-row border border-zinc-850 bg-[#050507] rounded-md overflow-hidden font-mono mt-6 min-h-[340px]">
          {/* Sidebar File Tree */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-900 bg-[#08080c] p-3 text-[11px] select-none flex-shrink-0 flex flex-col justify-between">
            <div>
              <span className="text-[9px] text-zinc-655 block font-bold uppercase tracking-wider mb-2">// WORKSPACE EXPLORER</span>
              <div className="text-zinc-500 mb-2 font-semibold">📂 src/platform/modules</div>
              <div className="space-y-0.5 pl-2">
                {MODULE_DETAILS.map((mod, idx) => {
                  const statusState = diagStatus[mod.id] || 'idle';
                  const isActive = activeModule === idx;
                  const isOpened = openedModules[mod.id] || isActive;
                  const FileIcon = mod.icon;
                  const fileName = `${mod.title.toLowerCase().replace(/\s+/g, '_')}${idx === 0 || idx === 3 ? '.tsx' : '.ts'}`;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setActiveModule(idx);
                        setOpenedModules(prev => ({ ...prev, [mod.id]: true }));
                      }}
                      className={`w-full text-left py-1 px-1.5 rounded transition-all cursor-pointer flex items-center justify-between ${
                        isActive 
                          ? 'bg-zinc-900 text-[#FFC500] font-bold border-l-2 border-[#FFC500] pl-1' 
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/40'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <FileIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#FFC500]' : 'text-zinc-555'}`} />
                        {fileName}
                      </span>
                      
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {statusState !== 'idle' && (
                          <span className={`w-1 h-1 rounded-full ${
                            statusState === 'running' 
                              ? 'bg-amber-500 animate-ping' 
                              : 'bg-emerald-400'
                          }`} />
                        )}
                        {!isOpened && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-900 text-[8px] text-zinc-655 hidden md:block">
              SYSTEM: ONLINE<br />
              STACK: NEXTJS v14
            </div>
          </div>

          {/* Editor Workspace View */}
          {(() => {
            const activeMod = MODULE_DETAILS[activeModule] || MODULE_DETAILS[0];
            const IconComp = activeMod.icon;
            const statusState = diagStatus[activeMod.id] || 'idle';
            const fileName = `${activeMod.title.toLowerCase().replace(/\s+/g, '_')}${activeModule === 0 || activeModule === 3 ? '.tsx' : '.ts'}`;
            
            return (
              <div className="flex-1 flex flex-col bg-black">
                {/* File Tab Header */}
                <div className="flex bg-[#08080c] border-b border-zinc-900 text-[10px] text-zinc-400 select-none">
                  <div className="bg-black border-r border-zinc-900 px-3 py-1.5 text-[#FFC500] font-semibold flex items-center gap-1.5 border-t-2 border-[#FFC500]">
                    <span>{fileName}</span>
                    <span className="text-zinc-655 text-[8px]">×</span>
                  </div>
                  <div className="flex-1" />
                  <div className="px-3 py-1.5 text-zinc-600 text-[9px] flex items-center gap-1 border-l border-zinc-900">
                    <span>Ref:</span>
                    <span className="text-zinc-400">{activeMod.code}</span>
                  </div>
                </div>

                {/* Code Body Container */}
                <div className="flex-1 p-4 flex gap-3 text-[11px] leading-relaxed font-mono min-h-[220px]">
                  {/* Line numbers gutter */}
                  <div className="text-zinc-700 text-right pr-3 border-r border-zinc-900 select-none hidden sm:block">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Text container */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="text-zinc-600 text-left">
                        <span className="text-red-500 font-bold">import</span> &#123; <span className="text-blue-450">{activeMod.title.replace(/\s+/g, '')}</span> &#125; <span className="text-red-500 font-bold">from</span> <span className="text-emerald-400">"@/features/platform"</span>;
                      </div>
                      <div className="text-[#6A9955] font-semibold mt-2 text-left">
                        /**
                      </div>
                      <div className="pl-3 text-[#6A9955] whitespace-pre-line leading-relaxed text-left font-mono text-[10px] tracking-tight">
                        * <span className="text-[#569CD6] font-bold">@module</span> <span className="text-[#9CDCFE]">{activeMod.title}</span>
                        * <span className="text-[#569CD6] font-bold">@stack</span> <span className="text-[#9CDCFE]">{activeMod.stack}</span>
                        * <span className="text-[#569CD6] font-bold">@status</span> <span className="text-[#9CDCFE]">{activeMod.status}</span>
                        *
                        * {activeMod.desc}
                      </div>
                      <div className="text-[#6A9955] font-semibold text-left">
                        */
                      </div>
                    </div>

                    {/* Action trigger button inside editor footer */}
                    <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-left">
                        <IconComp className="w-4 h-4 text-[#FFC500] opacity-80" />
                        <span className="text-[9px] text-zinc-500">Diagnostic code matches V2 schema targets</span>
                      </div>
                      <button
                        onClick={() => runDiagnostic(activeMod.id, activeMod.title, activeMod.code, activeMod.diagnosticMsg)}
                        disabled={statusState === 'running'}
                        className={`px-3 py-1 text-[9px] font-mono border uppercase tracking-wider font-bold transition-all cursor-pointer ${
                          statusState === 'running' 
                            ? 'bg-amber-950/20 text-amber-500 border-amber-900' 
                            : statusState === 'success'
                              ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900 hover:bg-zinc-900'
                              : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-800 hover:text-white'
                        }`}
                      >
                        {statusState === 'running' 
                          ? '● EXECUTING PROBE...' 
                          : statusState === 'success'
                            ? '✓ PROBE SUCCESSFUL'
                            : '⚡ RUN DIAGNOSTIC'
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Simulator Bab 1 */}
      <div className="bg-[#0b0b0e] border-2 border-zinc-900 p-5 mt-4 space-y-4 rounded-lg">
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
          <span className="text-[10px] text-zinc-400 font-black uppercase flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#FFC500]" />
            SIMULATOR 1.1: NO-CODE WEB PAGE BUILDER
          </span>
          <span className="px-2 py-0.5 bg-[#FFC500] text-black text-[8px] font-bold">DRAG &amp; DROP SANDBOX</span>
        </div>

        <div className="text-[11px] text-zinc-500 leading-normal">
          Drag component widgets from the **Toolbox Palette** on the left, and drop them into the **Live Browser Workspace** on the right to compose custom interface layouts.
        </div>

        <div className="border border-zinc-200 rounded-md overflow-hidden bg-white shadow-sm flex flex-col mt-4">
          {/* Single Mock Browser Header wrapping the entire 3-panel builder */}
          <div className="bg-zinc-100 border-b border-zinc-200 px-3 py-2 flex items-center gap-2 select-none">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
            </div>
            <div className="flex-1 bg-white border border-zinc-200 px-2 py-0.5 rounded text-[8px] text-zinc-500 font-mono flex items-center justify-between shadow-inner">
              <span>http://runsystem.platform/editor/builder-workspace</span>
              <span className="text-emerald-600 text-[7px] font-bold">🔒 VERIFIED WORKSPACE IDE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 bg-white">
            {/* Draggable Components Toolbox (Left Panel: col-span-3) */}
            <div className="lg:col-span-3 p-4 flex flex-col justify-between bg-zinc-50/40 space-y-3">
              <div>
                <span className="text-[10px] text-zinc-700 block uppercase font-bold tracking-wider font-mono">// COMPONENT PALETTE</span>
                <div className="text-[10px] text-zinc-500 leading-relaxed font-sans mt-2 mb-3">Hold and drag these modules directly into the browser viewport canvas:</div>
                <div className="flex flex-col gap-2 text-[10px]">
                  {[
                    { type: 'Navbar', label: 'Main Menu Header' },
                    { type: 'Hero', label: 'Centered Landing Banner' },
                    { type: 'Form', label: 'Email Input Form' },
                    { type: 'Grid', label: 'Data Report Table' },
                    { type: 'Footer', label: 'Sub-text Copyright footer' }
                  ].map((comp) => (
                    <div
                      key={comp.type}
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', comp.type);
                        addLog("PALETTE", `Picked up component: [${comp.type.toUpperCase()}]`, "info");
                      }}
                      className="p-2 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded cursor-grab active:cursor-grabbing flex flex-col gap-0.5 select-none shadow-sm transition-all"
                    >
                      <span className="font-bold text-zinc-800 text-[10px]">:: {comp.type.toUpperCase()}</span>
                      <span className="text-[8px] text-zinc-400 font-sans">{comp.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[8px] text-zinc-400 font-mono pt-3 border-t border-zinc-150 mt-4 text-left hidden lg:block">
                PALETTE READY //
              </div>
            </div>

            {/* Browser Workspace drop zone (Center Panel: col-span-6) */}
            <div className="lg:col-span-6 flex flex-col min-h-[350px]">
              {/* Canvas Area (with dots background) */}
              <div 
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-1 min-h-[300px] p-3 relative flex flex-col gap-2 overflow-y-auto scrollbar-thin bg-white bg-[radial-gradient(#e4e4e7_1.2px,transparent_1.2px)] [background-size:12px_12px] transition-colors duration-200 ${
                  dragOverIndex !== null ? 'bg-amber-50/10 border-2 border-dashed border-[#FFC500]/30' : ''
                }`}
              >
                {canvasComponents.length === 0 && dragOverIndex === null ? (
                  <div className="m-auto text-center space-y-1">
                    <span className="text-[9px] text-zinc-400 block uppercase font-bold font-mono">CANVAS DROPZONE</span>
                    <span className="text-[8px] text-zinc-500 block font-sans">Drag widgets from the palette and drop them here to compose the page.</span>
                  </div>
                ) : (
                  <div className={
                    layoutMode === 'grid-2' ? 'grid grid-cols-1 sm:grid-cols-2 grid-flow-dense gap-2 transition-all duration-300' :
                    layoutMode === 'flex-row' ? 'flex flex-row flex-wrap gap-2 transition-all duration-300' :
                    'flex flex-col gap-2 transition-all duration-300'
                  }>
                    {canvasComponents.reduce<React.ReactNode[]>((acc, comp, idx) => {
                      if (dragOverIndex === idx) {
                        acc.push(
                          <div 
                            key={`drop-placeholder-${idx}`}
                            className={`border-2 border-dashed border-[#FFC500] bg-[#FFC500]/5 rounded p-4 text-center text-[10px] text-[#FFC500] font-mono animate-pulse flex items-center justify-center min-h-[50px] ${
                              layoutMode === 'flex-row' ? 'flex-1 min-w-[160px] max-w-[280px] h-[100px]' : 
                              layoutMode === 'grid-2' ? 'h-[110px]' : ''
                            }`}
                          >
                            [ DROP HERE ]
                          </div>
                        );
                      }
                      acc.push(renderMockComponent(comp, idx));
                      return acc;
                    }, [])}
                    
                    {/* Visual drag-over preview item at the end */}
                    {dragOverIndex === canvasComponents.length && (
                      <div className={`border-2 border-dashed border-[#FFC500] bg-[#FFC500]/5 rounded p-4 text-center text-[10px] text-[#FFC500] font-mono animate-pulse flex items-center justify-center min-h-[50px] ${
                        layoutMode === 'flex-row' ? 'flex-1 min-w-[160px] max-w-[280px] h-[100px]' : 
                        layoutMode === 'grid-2' ? 'h-[110px]' : ''
                      }`}>
                        [ DROP HERE ]
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Controls Panel (Right Panel: col-span-3) */}
            <div className="lg:col-span-3 p-4 flex flex-col justify-between bg-zinc-50/40 space-y-4">
              <div className="space-y-4">
                <span className="text-[10px] text-zinc-700 block uppercase font-bold tracking-wider font-mono">// PROPERTY EDITOR</span>
                
                {/* Global Workspace Settings Section */}
                <div className="bg-white p-3 border border-zinc-200 rounded space-y-3 shadow-sm text-left text-[10px]">
                  <span className="text-[9px] text-zinc-400 block uppercase font-bold font-mono">Global settings</span>
                  
                  {/* Layout selector */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 block uppercase text-[8px] font-bold">Canvas Layout Mode</label>
                    <div className="flex flex-col gap-1">
                      {[
                        { mode: 'flex-col', label: 'Flex Column (Stack)' },
                        { mode: 'grid-2', label: 'Grid (2x2 Column)' },
                        { mode: 'flex-row', label: 'Flex Row (Wrap Flow)' }
                      ].map((item) => (
                        <button 
                          key={item.mode}
                          onClick={() => {
                            setLayoutMode(item.mode as any);
                            addLog("LAYOUT", `Adjusted canvas layout to: ${item.label.toUpperCase()}`, "info");
                          }}
                          className={`w-full text-left px-2 py-1 border rounded cursor-pointer transition-all border font-mono text-[9px] ${
                            layoutMode === item.mode 
                              ? 'bg-[#FFC500] text-black border-[#FFC500] font-bold' 
                              : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions (Clear Page) */}
                  <div className="pt-2 border-t border-zinc-150">
                    <button 
                      onClick={() => {
                        setCanvasComponents([]);
                        setSelectedComponentId(null);
                        addLog("CANVAS", "Cleared visual layout builder canvas.", "warning");
                      }}
                      className="w-full text-center py-1 border border-red-200 rounded bg-red-50 hover:bg-red-655 hover:text-white text-red-500 text-[8px] uppercase tracking-wider font-mono cursor-pointer font-bold"
                    >
                      🗑 Clear Entire Page
                    </button>
                  </div>
                </div>

                {selectedComp ? (
                  <div className="space-y-4 text-[10px] text-left">
                    <div className="bg-white p-2.5 border border-zinc-200 rounded space-y-1 shadow-sm">
                      <div className="text-zinc-400 font-mono text-[8px] uppercase">Selected ID:</div>
                      <div className="text-zinc-800 font-mono font-bold truncate text-[9px]">{selectedComp.id}</div>
                      <div className="text-amber-600 font-mono text-[9px] uppercase mt-1">{selectedComp.type} Component</div>
                    </div>

                    {/* Text Input properties */}
                    <div className="space-y-1">
                      <label className="text-zinc-400 block uppercase text-[8px] font-bold">Custom Title</label>
                      <input 
                        type="text" 
                        value={selectedComp.labelText || ''} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setCanvasComponents(prev => prev.map(c => c.id === selectedComp.id ? { ...c, labelText: val } : c));
                        }}
                        className="w-full bg-white border border-zinc-200 px-2 py-1 text-zinc-700 text-[10px] font-mono rounded focus:border-[#FFC500] outline-none shadow-inner"
                      />
                    </div>

                    {/* Theme styling switcher */}
                    <div className="space-y-1">
                      <label className="text-zinc-400 block uppercase text-[8px] font-bold">Accent Style</label>
                      <div className="grid grid-cols-3 gap-1">
                        {['default', 'yellow', 'red'].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              setCanvasComponents(prev => prev.map(c => c.id === selectedComp.id ? { ...c, accentColor: color } : c));
                              addLog("PROPERTY", `Changed accent color for component [${selectedComp.type.toUpperCase()}] to ${color.toUpperCase()}.`, "info");
                            }}
                            className={`py-1 text-[8px] uppercase tracking-wider font-mono font-bold border rounded cursor-pointer transition-all ${
                              (selectedComp.accentColor || 'default') === color 
                                ? 'bg-zinc-100 text-zinc-800 border-zinc-400 font-bold' 
                                : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Column width controller (Grid Mode only) */}
                    {layoutMode === 'grid-2' && (
                      <div className="space-y-1">
                        <label className="text-zinc-400 block uppercase text-[8px] font-bold">Grid Column Width</label>
                        <div className="grid grid-cols-2 gap-1 font-mono">
                          {[1, 2].map((span) => (
                            <button
                              key={span}
                              onClick={() => {
                                setCanvasComponents(prev => prev.map(c => c.id === selectedComp.id ? { ...c, colSpan: span } : c));
                                addLog("PROPERTY", `Updated grid colspan of component [${selectedComp.type.toUpperCase()}] to ${span} col(s).`, "info");
                              }}
                              className={`py-1 text-[8px] uppercase font-bold border rounded cursor-pointer transition-all ${
                                selectedComp.colSpan === span 
                                  ? 'bg-[#FFC500] text-black border-[#FFC500] font-black' 
                                  : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300'
                              }`}
                            >
                              {span} {span === 1 ? 'COL' : 'COLS'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Delete option inside right panel */}
                    <div className="pt-2 border-t border-zinc-200">
                      <button
                        onClick={() => {
                          setCanvasComponents(prev => prev.filter(c => c.id !== selectedComp.id));
                          setSelectedComponentId(null);
                          addLog("CANVAS", `Deleted selected component [${selectedComp.type.toUpperCase()}].`, "warning");
                        }}
                        className="w-full py-1.5 bg-red-50 text-red-500 border border-red-200 hover:bg-red-655 hover:text-white font-mono font-bold uppercase tracking-wider rounded cursor-pointer text-[9px] transition-all"
                      >
                        🗑 DELETE NODE
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-[9px] text-zinc-400 font-mono py-12 text-center border border-dashed border-zinc-200 rounded bg-zinc-50/50">
                    ⚡ SELECT A CANVAS ELEMENT TO CUSTOMIZE ITS PROPERTIES
                  </div>
                )}
              </div>
              
              <div className="text-[8px] font-mono text-zinc-400 border-t border-zinc-150 pt-2 text-left">
                LAYOUT ENGINE ACTIVE<br />
                SELECTED: {selectedComponentId ? 'YES' : 'NO'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
