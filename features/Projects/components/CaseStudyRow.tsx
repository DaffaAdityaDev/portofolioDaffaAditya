import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { projectsData, ColorSpec } from '@/features/Projects/constants';

const DynamicArrow = () => (
  <svg
    className="w-4 h-4 text-zinc-400 group-hover:text-red-400 transition-colors duration-300"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line
      x1="5" y1="12" x2="19" y2="12"
      className="arrow-line"
    />
    <polyline
      points="12 5 19 12 12 19"
      className="arrow-head"
    />
  </svg>
);

interface CaseStudyRowProps {
  proj: typeof projectsData[0];
  colorMap: ColorSpec;
  metricVal: string;
  onMouseEnter: (slug: string) => void;
  onMouseLeave: () => void;
}

const CaseStudyRow = React.memo(({
  proj,
  colorMap,
  metricVal,
  onMouseEnter,
  onMouseLeave
}: CaseStudyRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border-b border-zinc-900/40 py-10 px-4 cursor-pointer overflow-hidden transition-all duration-300"
      onMouseEnter={() => onMouseEnter(proj.slug)}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-zinc-900/60 origin-center pointer-events-none"
      />

      <div className={`absolute inset-0 bg-gradient-to-r ${colorMap.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <Link
        href={`/case-studies/${proj.slug}`}
        className="relative z-10 block"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 space-y-1 text-left">
            <h3 className="text-lg font-extrabold tracking-tight text-zinc-400 group-hover:text-white transition-colors duration-300">
              {proj.title.replace(/_/g, ' ')}
            </h3>
            <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-600">
              // CLIENT: {proj.client} | {proj.type}
            </p>
          </div>

          <div className="md:col-span-3 flex md:flex-col justify-between md:justify-center items-start text-left">
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.18em] block mb-1">METRICS:</span>
            <span className="text-xs font-mono font-bold text-white group-hover:text-red-400 transition-colors duration-300">
              {metricVal}
            </span>
          </div>

          <div className="md:col-span-5 space-y-4 text-left">
            <p className="text-zinc-500 text-xs font-light leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">
              {proj.description}
            </p>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap gap-1.5">
                {proj.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className={`text-[9px] font-mono tracking-widest border ${colorMap.pillsBorder} ${colorMap.pillsText} ${colorMap.pillsBg} px-2.5 py-1 rounded-full uppercase`}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 group-hover:text-red-400 transition-all duration-300 transform group-hover:translate-x-1 shrink-0">
                <span className="font-mono text-[9px] tracking-widest font-bold">ANALYZE</span>
                <DynamicArrow />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

CaseStudyRow.displayName = 'CaseStudyRow';
export default CaseStudyRow;
