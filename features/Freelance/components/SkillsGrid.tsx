import React from 'react';
import { Layers, Sliders, Server, Cpu, Workflow, ShieldCheck } from 'lucide-react';
import AmbientGlowCard from './AmbientGlowCard';

export const SkillsGrid = () => {
  return (
    <section aria-labelledby="skills-heading" className="w-full border-b border-zinc-800 bg-[#0a0a0c]">
      <div className="w-full bg-[#0f0f13] px-6 sm:px-12 md:px-16 lg:px-24 py-6 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">// TECH_CAPABILITIES</span>
          <h2 id="skills-heading" className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-1">Engineering & Design Skills</h2>
        </div>
        <span className="text-xs font-mono text-zinc-500 tracking-wider">// FULL-STACK CAPABILITIES</span>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Frontend Card */}
          <AmbientGlowCard className="h-full">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-zinc-800 bg-zinc-900/30 rounded-lg text-zinc-400 group-hover:border-red-500/40 group-hover:bg-red-500/5 group-hover:text-red-500 transition-all duration-300 shrink-0">
                    <Layers size={20} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">Frontend Engineering</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">// INTERACTIVE</span>
              </div>
              <p className="text-sm font-sans text-zinc-300 leading-relaxed font-medium antialiased">
                High-performance React and Next.js interfaces featuring fluid animations and optimal Lighthouse scores.
              </p>
            </div>
            <div className="border-t border-zinc-900 pt-4 mt-6 flex flex-wrap gap-1.5">
              {["Next.js", "React 19", "TypeScript", "Zustand", "Framer Motion", "Tailwind CSS"].map(tech => (
                <span key={tech} className="bg-zinc-950/80 border border-zinc-800/80 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono transition-colors duration-300 group-hover:border-red-500/20 group-hover:text-zinc-200">{tech}</span>
              ))}
            </div>
          </AmbientGlowCard>

          {/* 2. UI/UX Card */}
          <AmbientGlowCard className="h-full">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-zinc-800 bg-zinc-900/30 rounded-lg text-zinc-400 group-hover:border-red-500/40 group-hover:bg-red-500/5 group-hover:text-red-500 transition-all duration-300 shrink-0">
                    <Sliders size={20} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">UI/UX Design</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">// DESIGN SYSTEM</span>
              </div>
              <p className="text-sm font-sans text-zinc-300 leading-relaxed font-medium antialiased">
                Intuitive user journeys and developer-friendly design systems mapped from high-fidelity Figma prototypes.
              </p>
            </div>
            <div className="border-t border-zinc-900 pt-4 mt-6 flex flex-wrap gap-1.5">
              {["Figma", "Design Tokens", "Wireframing", "Prototypes", "Typography"].map(tech => (
                <span key={tech} className="bg-zinc-950/80 border border-zinc-800/80 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono transition-colors duration-300 group-hover:border-red-500/20 group-hover:text-zinc-200">{tech}</span>
              ))}
            </div>
          </AmbientGlowCard>

          {/* 3. Backend Card */}
          <AmbientGlowCard className="h-full">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-zinc-800 bg-zinc-900/30 rounded-lg text-zinc-400 group-hover:border-red-500/40 group-hover:bg-red-500/5 group-hover:text-red-500 transition-all duration-300 shrink-0">
                    <Server size={20} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">Backend Infrastructure</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">// ROBUST & SECURE</span>
              </div>
              <p className="text-sm font-sans text-zinc-300 leading-relaxed font-medium antialiased">
                Secure API services, transactional general ledgers, and optimized SQL databases engineered with Go and Node.js.
              </p>
            </div>
            <div className="border-t border-zinc-900 pt-4 mt-6 flex flex-wrap gap-1.5">
              {["Go (Golang)", "Node.js", "PostgreSQL", "Prisma ORM", "gRPC", "Redis"].map(tech => (
                <span key={tech} className="bg-zinc-950/80 border border-zinc-800/80 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono transition-colors duration-300 group-hover:border-red-500/20 group-hover:text-zinc-200">{tech}</span>
              ))}
            </div>
          </AmbientGlowCard>

          {/* 4. AI Agent Card */}
          <AmbientGlowCard className="h-full">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-zinc-800 bg-zinc-900/30 rounded-lg text-zinc-400 group-hover:border-red-500/40 group-hover:bg-red-500/5 group-hover:text-red-500 transition-all duration-300 shrink-0">
                    <Cpu size={20} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">AI Agent Workflows</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">// INTELLIGENT</span>
              </div>
              <p className="text-sm font-sans text-zinc-300 leading-relaxed font-medium antialiased">
                State-persisted cognitive loops, vector search systems, and cooperative multi-agent architectures integrated into web platforms.
              </p>
            </div>
            <div className="border-t border-zinc-900 pt-4 mt-6 flex flex-wrap gap-1.5">
              {["LangGraph", "Vector DBs", "Claude / GPT APIs", "Semantic Search", "Python"].map(tech => (
                <span key={tech} className="bg-zinc-950/80 border border-zinc-800/80 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono transition-colors duration-300 group-hover:border-red-500/20 group-hover:text-zinc-200">{tech}</span>
              ))}
            </div>
          </AmbientGlowCard>

          {/* 5. Mobile Card */}
          <AmbientGlowCard className="h-full">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-zinc-800 bg-zinc-900/30 rounded-lg text-zinc-400 group-hover:border-red-500/40 group-hover:bg-red-500/5 group-hover:text-red-500 transition-all duration-300 shrink-0">
                    <Workflow size={20} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">Mobile Engineering</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">// CROSS-PLATFORM</span>
              </div>
              <p className="text-sm font-sans text-zinc-300 leading-relaxed font-medium antialiased">
                Sleek native mobile apps featuring responsive design, secure authentication, and offline data syncing.
              </p>
            </div>
            <div className="border-t border-zinc-900 pt-4 mt-6 flex flex-wrap gap-1.5">
              {["React Native", "Expo", "Native Bridges", "Offline Syncing", "iOS & Android"].map(tech => (
                <span key={tech} className="bg-zinc-950/80 border border-zinc-800/80 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono transition-colors duration-300 group-hover:border-red-500/20 group-hover:text-zinc-200">{tech}</span>
              ))}
            </div>
          </AmbientGlowCard>

          {/* 6. DevOps Card */}
          <AmbientGlowCard className="h-full">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-zinc-800 bg-zinc-900/30 rounded-lg text-zinc-400 group-hover:border-red-500/40 group-hover:bg-red-500/5 group-hover:text-red-500 transition-all duration-300 shrink-0">
                    <ShieldCheck size={20} className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">DevOps & Deployments</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">// AUTOMATED CI/CD</span>
              </div>
              <p className="text-sm font-sans text-zinc-300 leading-relaxed font-medium antialiased">
                Automated CI/CD delivery pipelines, secure Docker container hosting, and Cloudflare edge caches.
              </p>
            </div>
            <div className="border-t border-zinc-900 pt-4 mt-6 flex flex-wrap gap-1.5">
              {["Docker", "CI/CD Pipelines", "AWS / Vercel", "DNS Security", "Cloudflare CDN"].map(tech => (
                <span key={tech} className="bg-zinc-950/80 border border-zinc-800/80 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono transition-colors duration-300 group-hover:border-red-500/20 group-hover:text-zinc-200">{tech}</span>
              ))}
            </div>
          </AmbientGlowCard>

        </div>
      </div>
    </section>
  );
};

export default SkillsGrid;
