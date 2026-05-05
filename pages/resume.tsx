import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Mail, MapPin, Briefcase } from 'lucide-react';
import { useRouter } from 'next/router';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/constant/animations';

const ResumePage = () => {
  const router = useRouter();
  const resumeUrl = "https://drive.google.com/file/d/16bp1lgGaVHe670IO1bR7khk01h6GaXdC/preview";
  const downloadUrl = "https://drive.google.com/file/d/16bp1lgGaVHe670IO1bR7khk01h6GaXdC/view?usp=sharing";

  return (
    <>
      <Head>
        <title>Resume | Daffa Aditya Rahman</title>
        <meta name="description" content="Professional resume of Daffa Aditya Rahman - Software Engineer." />
      </Head>

      <motion.div 
        variants={FADE_IN_UP_CONTAINER}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6 lg:px-20 relative overflow-hidden"
      >
        {/* Background Grain Effect */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Section */}
          <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
            <motion.div variants={FADE_IN_UP_ITEM} className="lg:col-span-8">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-white transition-colors mb-8 uppercase tracking-[0.2em]"
              >
                <ArrowLeft size={14} /> Return to Home
              </button>
              
              <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
                <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-2">
                  RESUME<span className="text-red-500">.</span>
                </h1>
                <div className="flex flex-col border-l border-neutral-800 pl-6 py-1">
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">Status</span>
                    <span className="text-sm md:text-base font-bold text-neutral-200 uppercase tracking-tight">
                      Open to work <br />
                      & Freelance
                    </span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={FADE_IN_UP_ITEM} className="lg:col-span-4 flex justify-start lg:justify-end">
              <a 
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 font-black text-sm hover:bg-neutral-200 transition-all active:scale-95 uppercase tracking-widest overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Download size={18} className="relative z-10 group-hover:text-white transition-colors" /> 
                <span className="relative z-10 group-hover:text-white transition-colors">Capture Copy</span>
              </a>
            </motion.div>
          </div>

          {/* Main Content: Split Layout */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Sidebar: Quick Specs */}
            <motion.div variants={FADE_IN_UP_ITEM} className="lg:col-span-4 xl:col-span-3 space-y-12 order-2 lg:order-1">
              {/* Identification */}
              <div className="space-y-6">
                <h3 className="text-xs font-mono text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold">Identification</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-neutral-300">
                    <Briefcase size={18} className="text-neutral-600 shrink-0" />
                    <span className="text-sm md:text-base font-medium">Software Engineer</span>
                  </div>
                  <div className="flex items-center gap-4 text-neutral-300">
                    <MapPin size={18} className="text-neutral-600 shrink-0" />
                    <span className="text-sm md:text-base font-medium">Jakarta, Indonesia</span>
                  </div>
                  <div className="flex items-center gap-4 text-neutral-300">
                    <Mail size={18} className="text-neutral-600 shrink-0" />
                    <span className="text-sm md:text-base font-medium underline underline-offset-4 decoration-neutral-700">daffaaditya.me@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Core Competencies */}
              <div className="space-y-6">
                <h3 className="text-xs font-mono text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold">Core Competencies</h3>
                <div className="space-y-4">
                  {['Software Engineering', 'Fullstack Development', 'UI/UX Design', 'System Architecture'].map(comp => (
                    <div key={comp} className="flex items-center gap-3 text-neutral-300">
                      <div className="w-1.5 h-1.5 bg-red-500"></div>
                      <span className="text-sm md:text-base font-medium">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="space-y-6">
                <h3 className="text-xs font-mono text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'TypeScript', 'Golang', 'AI Agent', 'Node.js', 'React Native', 'PostgreSQL', 'Docker'].map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-[11px] md:text-xs font-mono text-neutral-400 uppercase tracking-tight hover:border-neutral-600 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extended Stack */}
              <div className="space-y-6">
                <h3 className="text-xs font-mono text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold">Extended Stack</h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-[10px] md:text-xs font-mono text-neutral-500 uppercase tracking-widest font-medium">AI & Automation</span>
                    <p className="text-sm text-neutral-400 font-medium leading-relaxed">LangChain, LangGraph, n8n, Agentic AI</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] md:text-xs font-mono text-neutral-500 uppercase tracking-widest font-medium">DevOps & Cloud</span>
                    <p className="text-sm text-neutral-400 font-medium leading-relaxed">AWS, GCP, Grafana, Kafka, ElasticSearch</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] md:text-xs font-mono text-neutral-500 uppercase tracking-widest font-medium">Design & Tools</span>
                    <p className="text-sm text-neutral-400 font-medium leading-relaxed">Figma, Framer, Photoshop, Adobe XD</p>
                  </div>
                </div>
              </div>

              {/* Verification Note */}
              <div className="p-6 bg-neutral-900/50 border border-neutral-800 border-dashed rounded-lg">
                <p className="text-xs font-mono text-neutral-500 leading-relaxed uppercase tracking-tight">
                  // Note: Document integrity verified. For physical copy, use the 'Capture Copy' button above.
                </p>
              </div>
            </motion.div>

            {/* Document Viewer */}
            <motion.div 
              variants={FADE_IN_UP_ITEM} 
              className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2"
            >
              <div className="relative group rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-neutral-800 bg-neutral-900">
                {/* Custom Toolbar */}
                <div className="bg-neutral-800/50 backdrop-blur-md px-6 py-4 border-b border-neutral-800 flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-[0.2em]">Secure View Active</span>
                  </div>
                </div>

                {/* PDF Frame */}
                <div className="relative bg-neutral-900 h-[700px] md:h-[1000px] w-full">
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-700 font-mono text-sm animate-pulse z-0">
                    ACCESSING_SECURE_STORAGE...
                  </div>
                  <iframe 
                    src={resumeUrl}
                    className="w-full h-full relative z-10 border-none opacity-90 group-hover:opacity-100 transition-opacity duration-500 grayscale-[0.5] hover:grayscale-0"
                    allow="autoplay"
                  ></iframe>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ResumePage;
