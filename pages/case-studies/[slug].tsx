import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { projectsData } from '@/features/Projects/constants';

// Loading skeleton fallback for dynamic rendering transitions
const CaseStudySkeleton = () => (
  <div className="animate-pulse space-y-8 max-w-2xl mx-auto py-10">
    <div className="h-4 bg-zinc-800 rounded w-3/4 mx-auto" />
    <div className="h-4 bg-zinc-800 rounded w-5/6 mx-auto" />
    <div className="h-4 bg-zinc-800 rounded w-2/3 mx-auto" />
    <div className="h-32 bg-zinc-900/50 border border-zinc-800 rounded mx-auto" />
    <div className="h-4 bg-zinc-800 rounded w-1/2 mx-auto" />
  </div>
);

// Crisp inline SVG icons for layout navigation and interface signals
const Icons = {
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
};

// ==========================================
// CENTRAL MAPPER FOR PROJECT SLUGS -> JSX CONTENT
// ==========================================
const MAPPED_CASE_STUDIES: Record<string, React.ComponentType> = {
  'platform': dynamic(() => import('@/features/Projects/case-studies/PlatformContent'), {
    loading: () => <CaseStudySkeleton />
  }),
  'accounting-plus': dynamic(() => import('@/features/Projects/case-studies/AccountingContent'), {
    loading: () => <CaseStudySkeleton />
  }),
  'ombudsman-item-management': dynamic(() => import('@/features/Projects/case-studies/OmbudsmanContent'), {
    loading: () => <CaseStudySkeleton />
  }),
  'qqtech-website': dynamic(() => import('@/features/Projects/case-studies/QQTechContent'), {
    loading: () => <CaseStudySkeleton />
  }),
  'recyclops': dynamic(() => import('@/features/Projects/case-studies/RecyclopsContent'), {
    loading: () => <CaseStudySkeleton />
  }),
  'artifyo': dynamic(() => import('@/features/Projects/case-studies/ArtifyoContent'), {
    loading: () => <CaseStudySkeleton />
  }),
  'aliman-bulus': dynamic(() => import('@/features/Projects/case-studies/AlimanBulusContent'), {
    loading: () => <CaseStudySkeleton />
  }),
  'rivian-mobile-companion': dynamic(() => import('@/features/Projects/case-studies/RivianContent'), {
    loading: () => <CaseStudySkeleton />
  }),
  'help-scout-beacon': dynamic(() => import('@/features/Projects/case-studies/BeaconContent'), {
    loading: () => <CaseStudySkeleton />
  }),
  'prevue-vector-sharing': dynamic(() => import('@/features/Projects/case-studies/PrevueContent'), {
    loading: () => <CaseStudySkeleton />
  })
};

// ==========================================
// UNIFIED CASE STUDY LAYOUT CONTAINER (THE BASE)
// ==========================================
interface CaseStudyLayoutProps {
  project: typeof projectsData[0];
  children: React.ReactNode;
}

const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({ project, children }) => {
  return (
    <div className="bg-[#0a0a0c] text-zinc-100 min-h-screen relative font-sans select-none pb-24">
      {/* Immersive Panoramic Header using the Project's visual accent or cover image */}
      <div className="relative w-full h-[60vh] overflow-hidden flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/40 z-10" />
        <div className="absolute inset-0 z-0">
          <Image 
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            className="opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10" />

        <div className="relative z-20 max-w-5xl mx-auto px-6 w-full pt-32 pb-16">
          <Link 
            href="/case-studies"
            className="group flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors mb-8 cursor-pointer w-fit"
          >
            <Icons.ArrowLeft /> Back to Archive
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold">CASE STUDY // {project.client.toUpperCase()}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-black tracking-tight max-w-4xl leading-[1.05] uppercase text-white">
            {project.title.replace(/_/g, ' ')}
          </h1>
          <p className="text-zinc-400 font-light text-base md:text-xl mt-6 max-w-2xl leading-relaxed text-left">
            {project.description}
          </p>
        </div>
      </div>

      {/* Narrative Section - Large typography & asymmetrical grid layout */}
      <div className="max-w-5xl mx-auto px-6 mt-20 space-y-24">
        
        {/* Metas Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-zinc-900/60 font-mono text-[11px] text-left">
          <div>
            <span className="text-zinc-600 block mb-1 uppercase tracking-wider">PROJECT CATEGORY</span>
            <span className="text-zinc-200 font-semibold text-xs">{project.type}</span>
          </div>
          <div>
            <span className="text-zinc-600 block mb-1 uppercase tracking-wider">ROLE & FOCUS</span>
            <span className="text-zinc-200 font-semibold text-xs">Systems Architect Core</span>
          </div>
          <div>
            <span className="text-zinc-600 block mb-1 uppercase tracking-wider">PRIMARY DISCIPLINE</span>
            <span className="text-zinc-200 font-semibold text-xs">{project.tech.slice(0, 2).join(' / ')}</span>
          </div>
          <div>
            <span className="text-zinc-600 block mb-1 uppercase tracking-wider">TIMELINE / RELEASE</span>
            <span className="text-zinc-200 font-semibold text-xs">Released {project.year}</span>
          </div>
        </div>

        {/* Injecting Editorial Style System */}
        <style dangerouslySetInnerHTML={{ __html: `
          .case-study-content {
            width: 100%;
            margin-top: 2rem;
          }

          .case-study-content p {
            font-family: var(--font-inter), sans-serif;
            font-size: clamp(0.95rem, 1.1vw, 1.05rem);
            line-height: 1.85;
            color: #a1a1aa;
            max-width: 42rem;
            margin: 1.5rem auto;
            font-weight: 300;
            text-align: justify;
          }

          /* Dropcap style for the very first letter of a narrative section */
          .case-study-content p.lead::first-letter {
            float: left;
            font-family: var(--font-display), sans-serif;
            font-size: 3.5rem;
            line-height: 0.82;
            font-weight: 900;
            margin-right: 0.75rem;
            margin-top: 0.2rem;
            color: #ef4444; /* Site Accent Red */
          }

          .case-study-content h2.font-serif,
          .case-study-content .serif-title {
            font-family: Georgia, Cambria, "Times New Roman", Times, serif;
            font-size: clamp(2rem, 4vw + 1rem, 3rem);
            font-weight: 400;
            letter-spacing: -0.02em;
            line-height: 1.2;
            text-transform: none;
            color: #ffffff;
            text-align: center;
            margin-top: 4.5rem;
            margin-bottom: 2rem;
            max-width: 46rem;
            margin-left: auto;
            margin-right: auto;
          }

          .case-study-content h3 {
            font-family: var(--font-outfit), sans-serif;
            font-size: 1.35rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            color: #ffffff;
            text-align: center;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
          }

          .case-study-content .mono-specs {
            font-family: var(--font-mono), monospace;
            font-size: 10px;
            letter-spacing: 0.15em;
            color: #ef4444; /* Brand highlight red */
            text-transform: uppercase;
            text-align: center;
            line-height: 2;
            margin: 1.5rem auto;
          }

          .case-study-content .sandbox-container {
            width: 100%;
            max-width: 44rem;
            margin: 3.5rem auto;
            text-align: left;
          }
        `}} />

        {/* Mapped Dynamic Content (Playground / Visualizations) */}
        <div className="pt-8 case-study-content">
          {children}
        </div>

        {/* Live Project Link redirect if liveLink exists */}
        {project.liveLink && (
          <div className="pt-12 border-t border-zinc-900/60 flex justify-between items-center">
            <div className="text-left">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Live Interface Access</span>
              <p className="text-sm font-light text-zinc-400 mt-1">Review the live production environment for {project.client}.</p>
            </div>
            <a 
              href={project.liveLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-3 rounded-full bg-white text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              Visit Live Site <Icons.ExternalLink />
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

// ==========================================
// STATIC SITE GENERATION PATHS & PROPS
// ==========================================
export const getStaticPaths = async () => {
  const paths = projectsData.map((project) => ({
    params: { slug: project.slug },
  }));

  return {
    paths,
    fallback: false // Return 404 for unknown case study slugs
  };
};

export const getStaticProps = async ({ params }: { params: { slug: string } }) => {
  const project = projectsData.find((p) => p.slug === params.slug) || null;

  return {
    props: {
      project
    }
  };
};

// ==========================================
// DYNAMIC PAGE DEFAULT COMPONENT
// ==========================================
interface CaseStudyPageProps {
  project: typeof projectsData[0];
}

export default function CaseStudyDynamicPage({ project }: CaseStudyPageProps) {
  if (!project) return null;

  // Resolve the custom TSX content component mapped to the project slug
  const SpecificContent = MAPPED_CASE_STUDIES[project.slug] || (() => (
    <div className="py-20 text-center text-zinc-500 font-mono text-sm uppercase">
      Case study details are being written. Experimental playground coming soon.
    </div>
  ));

  return (
    <>
      <Head>
        <title>{`${project.title.replace(/_/g, ' ')} | Daffa Aditya`}</title>
        <meta name="description" content={`Case study exploring systems engineering, performance bottlenecks and interactive visualizers for ${project.title}.`} />
      </Head>
      <div className="selection:bg-red-600 selection:text-white">
        <CaseStudyLayout project={project}>
          <SpecificContent />
        </CaseStudyLayout>
      </div>
    </>
  );
}
