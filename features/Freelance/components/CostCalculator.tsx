import React from 'react';
import { ArrowRight, Cpu, ShieldCheck, Server, Globe } from 'lucide-react';
import { PackageType } from '../hooks/useFreelance';

interface CostCalculatorProps {
  calculatorInputs: {
    selectedPackage: PackageType;
    screenCount: number;
    apiNodes: number;
    selectedAddons: string[];
    timelineSpeed: 'standard' | 'urgent';
    supportCoverage: 'standard' | '24_7';
  };
  estimatedQuote: number;
  formData: {
    name: string;
    email: string;
    projectDesc: string;
  };
  formSubmitted: boolean;
  setCalculatorInputs: React.Dispatch<React.SetStateAction<any>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handlePackageChange: (pkg: PackageType) => void;
  handleAddonToggle: (addonId: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  calculatorInputs,
  estimatedQuote,
  formData,
  formSubmitted,
  setCalculatorInputs,
  setFormData,
  handlePackageChange,
  handleAddonToggle,
  handleFormSubmit,
}) => {
  return (
    <section id="contact-scoping" className="w-full bg-[#0b0b0e] px-6 sm:px-12 md:px-16 lg:px-24 py-16 md:py-24 relative border-b border-zinc-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">// COST_ESTIMATOR_V2</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mt-2">Configure Your Scope</h2>
          </div>
          <p className="text-xs font-mono text-zinc-500 tracking-wider">
            // REAL-TIME SYSTEM ESTIMATE
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Inputs & Selectors (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Package Select */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold">// 1. SELECT BASE ARCHITECTURE PACKAGE</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'crud', label: 'Classic CRUD', desc: 'Admin database, log ledger, standard inventory dashboards.' },
                  { id: 'low-code', label: 'Advanced Low-Code', desc: 'Visual builders, drag & drop schema managers, flow editors.' },
                  { id: 'ai', label: 'AI Agent System', desc: 'Cognitive agent loops, Vector DB memory index, LangGraph orchestration.' },
                  { id: 'saas', label: 'Full SaaS Application', desc: 'Subscription panels, multi-tenant billing structure, robust security.' },
                  { id: 'custom', label: 'Custom Scope / MVP', desc: 'Tailored requirements starting from standard prototypes.' }
                ].map(pkg => {
                  const active = calculatorInputs.selectedPackage === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handlePackageChange(pkg.id as any)}
                      className={`p-4 border text-left transition-all rounded-xl flex flex-col justify-between min-h-[110px] group ${
                        active 
                          ? 'border-red-500 text-white bg-red-950/10 shadow-[0_0_15px_rgba(239,68,68,0.08)]' 
                          : 'border-zinc-800 text-zinc-400 bg-zinc-900/10 hover:border-zinc-700'
                      }`}
                    >
                      <span className={`text-xs font-mono uppercase font-bold tracking-wide transition-colors ${active ? 'text-red-500' : 'text-zinc-400'}`}>
                        {pkg.label}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 leading-snug mt-2">
                        {pkg.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizing Sliders */}
            <div className="space-y-6 border-t border-zinc-800 pt-6">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold">// 2. DEFINE SYSTEM DIMENSIONS</span>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-mono uppercase">
                  <span className="text-zinc-300">Views / Screens Count</span>
                  <span className="text-red-500 font-bold">{calculatorInputs.screenCount} Screens</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="30"
                  value={calculatorInputs.screenCount}
                  onChange={(e) => setCalculatorInputs((prev: any) => ({ ...prev, screenCount: parseInt(e.target.value) }))}
                  className="w-full accent-red-600 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>1 SCREEN</span>
                  <span>30 SCREENS MAX</span>
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <div className="flex justify-between text-xs font-mono uppercase">
                  <span className="text-zinc-300">API Integration Nodes</span>
                  <span className="text-red-500 font-bold">{calculatorInputs.apiNodes} Integrations</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="15"
                  value={calculatorInputs.apiNodes}
                  onChange={(e) => setCalculatorInputs((prev: any) => ({ ...prev, apiNodes: parseInt(e.target.value) }))}
                  className="w-full accent-red-600 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>0 NODES</span>
                  <span>15 NODES MAX</span>
                </div>
              </div>
            </div>

            {/* Add-ons Checklist */}
            <div className="space-y-3 border-t border-zinc-800 pt-6">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold">// 3. ADD SERVICE EXTENSIONS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'uiux', label: 'Premium UI/UX Specifications', cost: '+$1,500', icon: Cpu },
                  { id: 'sla', label: '3-Month Priority SLA Support', cost: '+$2,000', icon: ShieldCheck },
                  { id: 'hosting', label: 'Cloud Deployment Setup', cost: '+$800', icon: Server },
                  { id: 'domain', label: 'Custom DNS & Edge Routing', cost: '+$300', icon: Globe }
                ].map(addon => {
                  const active = calculatorInputs.selectedAddons.includes(addon.id);
                  const Icon = addon.icon;
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleAddonToggle(addon.id)}
                      className={`p-3 border text-left transition-all rounded-xl flex items-center justify-between gap-3 ${
                        active 
                          ? 'border-red-500 text-white bg-red-950/10' 
                          : 'border-zinc-800 text-zinc-400 bg-zinc-900/10 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={active ? 'text-red-500' : 'text-zinc-500'} />
                        <span className="text-xs font-mono font-bold">{addon.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-red-500 font-bold shrink-0">{addon.cost}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Timeline Speed & Night Shift Coverage */}
            <div className="space-y-4 border-t border-zinc-800 pt-6">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold">// 4. SCHEDULE & HOURS COVERAGE</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Timeline speed */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Delivery Schedule</span>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-900/50 p-1 border border-zinc-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCalculatorInputs((prev: any) => ({ ...prev, timelineSpeed: 'standard' }))}
                      className={`py-1.5 text-xs font-mono rounded uppercase ${calculatorInputs.timelineSpeed === 'standard' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalculatorInputs((prev: any) => ({ ...prev, timelineSpeed: 'urgent' }))}
                      className={`py-1.5 text-xs font-mono rounded uppercase ${calculatorInputs.timelineSpeed === 'urgent' ? 'bg-red-600 text-white' : 'text-zinc-500'}`}
                    >
                      Urgent (+35%)
                    </button>
                  </div>
                </div>

                {/* Developer shift hours */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Shift Coverage</span>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-900/50 p-1 border border-zinc-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCalculatorInputs((prev: any) => ({ ...prev, supportCoverage: 'standard' }))}
                      className={`py-1.5 text-xs font-mono rounded uppercase ${calculatorInputs.supportCoverage === 'standard' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                    >
                      Business
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalculatorInputs((prev: any) => ({ ...prev, supportCoverage: '24_7' }))}
                      className={`py-1.5 text-xs font-mono rounded uppercase ${calculatorInputs.supportCoverage === '24_7' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                    >
                      24/7 (+$1k)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Live proposal card & form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Receipt Proposal Card */}
            <div className="border border-zinc-800 bg-[#0f0f13] rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">// INVOICE_ESTIMATE</span>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">SPEC PROPOSAL</h4>
                </div>
                <span className="text-red-500 font-mono text-[10px] bg-red-950/20 border border-red-900/60 px-2 py-0.5 rounded font-bold uppercase tracking-wider">LIVE</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Package:</span>
                  <span className="text-white uppercase font-bold">{calculatorInputs.selectedPackage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Screens:</span>
                  <span className="text-white">{calculatorInputs.screenCount} total</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">API Integrations:</span>
                  <span className="text-white">{calculatorInputs.apiNodes} nodes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Timeline Strategy:</span>
                  <span className="text-white uppercase">{calculatorInputs.timelineSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Availability Shift:</span>
                  <span className="text-white uppercase">{calculatorInputs.supportCoverage === '24_7' ? '24/7 priority' : 'business'}</span>
                </div>

                {calculatorInputs.selectedAddons.length > 0 && (
                  <div className="border-t border-zinc-800 pt-3 mt-3">
                    <span className="text-[10px] text-zinc-500 block uppercase mb-1">Add-ons:</span>
                    <ul className="space-y-1 pl-2">
                      {calculatorInputs.selectedAddons.includes('uiux') && <li className="text-[10px] text-zinc-300">- Premium UI/UX Design</li>}
                      {calculatorInputs.selectedAddons.includes('sla') && <li className="text-[10px] text-zinc-300">- 3-Month Priority SLA Support</li>}
                      {calculatorInputs.selectedAddons.includes('hosting') && <li className="text-[10px] text-zinc-300">- Cloud Deployment Setup</li>}
                      {calculatorInputs.selectedAddons.includes('domain') && <li className="text-[10px] text-zinc-300">- DNS & Edge Security Setup</li>}
                    </ul>
                  </div>
                )}

                <div className="border-t border-zinc-800 pt-4 mt-4 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">TOTAL VALUE</span>
                    <span className="text-2xl font-black text-white">${estimatedQuote.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">USD ESTIMATE</span>
                </div>
              </div>
            </div>

            {/* Submission Scoping Form */}
            <div className="border border-zinc-800 bg-zinc-900/10 rounded-xl p-6 space-y-4">
              <div className="border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold">// SUBMIT PROPOSAL BRIEF</span>
              </div>

              {formSubmitted ? (
                <div className="p-4 border border-red-500 bg-red-950/15 text-center text-xs font-mono text-red-500 rounded-xl">
                  Proposal brief generated! Launching your default email client...
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs p-3 text-white font-mono focus:outline-none focus:border-red-500 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Email Address</label>
                    <input 
                      type="email"
                      required
                      placeholder="e.g. client@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs p-3 text-white font-mono focus:outline-none focus:border-red-500 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Brief Description / Requirements</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Describe your goals, feature list, and target timeline..."
                      value={formData.projectDesc}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, projectDesc: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs p-3 text-white font-mono focus:outline-none focus:border-red-500 rounded-lg resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-white hover:bg-neutral-200 text-black py-3 text-xs font-mono font-bold uppercase transition-colors rounded-lg flex items-center justify-center gap-2"
                  >
                    SUBMIT PROPOSAL <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;
