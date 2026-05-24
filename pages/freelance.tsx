import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { 
  ArrowRight, Sliders, ExternalLink, Cpu, Layers, 
  Workflow, ArrowUpRight, ShieldCheck, HeartHandshake, CheckCircle2, UserCheck,
  Settings, DollarSign, Calendar, Server, Globe, Clock
} from 'lucide-react';

// ----------------------------------------------------
// CORE DATA STRUCTS
// ----------------------------------------------------
interface TimelineNode {
  id: string;
  category: string;
  title: string;
  description: string;
  points: string[];
  techs: string[];
  metric: string;
  image: string;
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    id: "PROJECT_01",
    category: "Run System Enterprise",
    title: "Platform (Enterprise Low-Code Engine)",
    description: "Maintain and develop an enterprise low-code platform using Next.js and Zustand, optimizing application performance by decoupling core UI logic into a proprietary npm library for cross-project reusability; manage end-to-end feature releases and secure 3rd-party integrations to ensure stable, high-scale production performance.",
    points: [
      "Proprietary NPM Component Library",
      "Decoupled UI Logic & Cross-Project Reuse",
      "Next.js & Zustand State Optimization",
      "Visual Drag & Drop & Flowchart System"
    ],
    techs: ["Next.js", "TypeScript", "Zustand State", "Tailwind CSS", "NPM Library", "Framer Motion"],
    metric: "65% Speed Load Increase",
    image: "/image/projects/platform.webp"
  },
  {
    id: "PROJECT_02",
    category: "Run System Enterprise",
    title: "Accounting+ (SaaS Ecosystem)",
    description: "Architected and maintained a multi-service SaaS ecosystem, implemented secure third-party integrations, and delivered performance optimizations to ensure a fast, scalable experience across distributed frontend architectures.",
    points: [
      "Multi-Service SaaS Architecture",
      "TanStack Query Data Synchronization",
      "Secure Third-Party API Gateways",
      "High-Performance Page Load Velocities"
    ],
    techs: ["Next.js", "TypeScript", "TanStack Query", "REST APIs", "Clean Architecture"],
    metric: "99.9% System Uptime",
    image: "/image/projects/accplus.webp"
  },
  {
    id: "PROJECT_03",
    category: "Ombudsman RI",
    title: "Ombudsman Item Management",
    description: "Developed a high-performance inventory management system for the Ombudsman, featuring tracking system, role-based access control, and secure data handling to support government operations.",
    points: [
      "Role-Based Access Control (RBAC)",
      "High-Performance Asset Tracking",
      "Secure Data Auditing Logs",
      "Government Security Compliant"
    ],
    techs: ["React", "TypeScript", "TanStack Query", "Tailwind CSS", "Security Audit"],
    metric: "100% Asset Accuracy",
    image: "/image/projects/ombudsman.webp"
  },
  {
    id: "PROJECT_04",
    category: "QQTech",
    title: "QQTech Corporate & HR System",
    description: "Developed a corporate website, blog system and backend hr system for QQTech, featuring a modern design and smooth animations to showcase the company's products and services.",
    points: [
      "Integrated HR Management Portal",
      "High-Performance Blog & CMS System",
      "Sleek Modern Design & Micro-animations",
      "Relational PostgreSQL Schema Design"
    ],
    techs: ["Laravel", "Vue.js", "PostgreSQL", "Tailwind CSS", "Admin Dashboard"],
    metric: "40% HR Process Automation",
    image: "/image/projects/qltech.webp"
  },
  {
    id: "PROJECT_05",
    category: "Artifyo Creative Studio",
    title: "Lighthouse-100 Design Platform",
    description: "Designed a high-contrast dark UI and optimized Next.js dynamic routing and edge CDN caching to resolve slow visual performance on image-heavy portfolios, maximizing client conversion rates.",
    points: [
      "100/100 Core Web Vitals Score",
      "Edge CDN Caching & Image Optimization",
      "Micro-animations & Interactive UI/UX",
      "Figma Tokens to Tailwind Variables"
    ],
    techs: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Edge CDN"],
    metric: "100/100 Lighthouse Performance",
    image: "/image/projects/artifyo.webp"
  },
  {
    id: "PROJECT_06",
    category: "Aliman Bulus Boarding School",
    title: "Santri Accounting Ledger",
    description: "Designed the UI specifications, implemented a Next.js frontend, and structured the PostgreSQL double-entry backend logic to track complex ledger payments for hundreds of students under tight deadlines.",
    points: [
      "Double-Entry General Ledgers",
      "Dynamic Data Filtering & Searching",
      "Role-Based Access Control (RBAC)",
      "Prisma ORM & PostgreSQL Schema"
    ],
    techs: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Docker"],
    metric: "80% Admin Reconciliation Redux",
    image: "/image/projects/aliman.webp"
  },
  {
    id: "PROJECT_07",
    category: "Side Project",
    title: "Recyclops Mobile App",
    description: "Gamified mobile-first web app to encourage recycling habits in local communities.",
    points: [
      "Gamified Incentive Mechanisms",
      "Mobile-First Offline Native Experience",
      "Firebase Realtime DB Syncing",
      "Interactive Community Maps & Leaderboard"
    ],
    techs: ["Android Native", "Firebase", "Google Maps API", "Gamification Engine"],
    metric: "Community-Led Clean Initiatives",
    image: "/image/projects/recyclops-min.gif"
  }
];


const FAQS = [
  {
    q: 'How do we maintain alignment and communication?',
    a: 'We leverage Slack for daily async status updates, a shared Notion dashboard for clear task tracking, and weekly milestones. We integrate our workflow with transparent Git branches so you can view actual code commits live.'
  },
  {
    q: 'What happens if project requirements change mid-flight?',
    a: 'We work in agile milestones. If requirements change, we discuss the impact on timelines and budgets transparently, adjusting the milestone specs before writing code.'
  },
  {
    q: 'Will I be locked to your services indefinitely?',
    a: 'Absolutely not. I deliver highly documented codebases, clean components conforming to storybook layouts, and clear deployment recipes (like Docker/Vercel pipelines) so your internal engineering team can take over.'
  }
];

const TESTIMONIALS = [
  {
    author: 'Government App System Lead',
    quote: "Daffa has an exceptional ability to jump into complex codebases and immediately establish type safety, modular structures, and fast API layers. He delivered our audit portals ahead of schedule."
  },
  {
    author: 'Creative Director, Artifyo Studio',
    quote: "Daffa bridged the gap between our complex design layouts and raw page performance. Achieving a perfect 100/100 Lighthouse score transformed our client conversion rates."
  },
  {
    author: 'CEO, Aliman Boarding School',
    quote: "The ledger system Daffa built saved our finance team countless hours of manual balancing. Reliable, secure, and completed exactly on time."
  }
];



// ----------------------------------------------------
// HOVER GRADIENT CONTAINER
// ----------------------------------------------------
interface AmbientGlowCardProps {
  children: React.ReactNode;
  className?: string;
}

function AmbientGlowCard({ children, className = '' }: AmbientGlowCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md rounded-xl overflow-hidden transition-all duration-500 group hover:border-red-500/30 hover:shadow-[0_0_40px_rgba(239,68,68,0.08)] ${className}`}
    >
      {/* Dynamic Hover Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(239, 68, 68, 0.07), transparent 80%)`
        }}
      />
      
      {/* Design accents: Subtle red corner lines */}
      <div className="absolute top-0 left-0 w-[20px] h-[1px] bg-gradient-to-r from-red-500/20 to-transparent group-hover:from-red-500/70 transition-all duration-500" />
      <div className="absolute top-0 left-0 w-[1px] h-[20px] bg-gradient-to-b from-red-500/20 to-transparent group-hover:from-red-500/70 transition-all duration-500" />
      <div className="absolute bottom-0 right-0 w-[20px] h-[1px] bg-gradient-to-l from-red-500/10 to-transparent group-hover:from-red-500/40 transition-all duration-500" />
      <div className="absolute bottom-0 right-0 w-[1px] h-[20px] bg-gradient-to-t from-red-500/10 to-transparent group-hover:from-red-500/40 transition-all duration-500" />

      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TIMELINE CURSOR IMAGE PREVIEW
// ----------------------------------------------------
interface TimelineCursorPreviewProps {
  hoveredNode: TimelineNode | null;
}

const TimelineCursorPreview: React.FC<TimelineCursorPreviewProps> = ({ hoveredNode }) => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 250, mass: 0.6 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const [activeNode, setActiveNode] = useState<TimelineNode | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (hoveredNode) {
      setActiveNode(hoveredNode);
    }
  }, [hoveredNode]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  if (!isMounted) return null;

  return createPortal(
    <motion.div 
      className="fixed pointer-events-none z-[100] w-[320px] h-[200px] rounded-xl overflow-hidden hidden lg:block border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] bg-zinc-950"
      style={{ 
        x, 
        y,
        translateX: 25,
        translateY: 25,
        left: 0,
        top: 0
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
      animate={{ 
        opacity: hoveredNode ? 1 : 0,
        scale: hoveredNode ? 1 : 0.8,
        rotate: hoveredNode ? 0 : -2
      }}
      transition={{
        opacity: { duration: 0.25, ease: "easeOut" },
        scale: { duration: 0.25, ease: "easeOut" },
        rotate: { duration: 0.25, ease: "easeOut" }
      }}
    >
      <div className="relative w-full h-full">
        {activeNode && (
          <>
            <img 
              src={activeNode.image} 
              alt={activeNode.title}
              className="w-full h-full object-cover"
            />
            
            {/* Dark & Red Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-transparent to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-900/50 bg-zinc-950/80 backdrop-blur-sm">
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest block font-bold mb-0.5">
                {activeNode.category}
              </span>
              <span className="text-white text-xs font-black uppercase tracking-tight block truncate">
                {activeNode.title}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>,
    document.body
  );
};

// ----------------------------------------------------
// MAIN GRID FREELANCE SHOWCASE
// ----------------------------------------------------
export default function FreelancePage() {
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<TimelineNode | null>(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Advanced package-based calculator inputs
  const [calculatorInputs, setCalculatorInputs] = useState({
    selectedPackage: 'crud' as 'crud' | 'low-code' | 'ai' | 'saas' | 'custom',
    screenCount: 5,
    apiNodes: 3,
    selectedAddons: [] as string[],
    timelineSpeed: 'standard' as 'standard' | 'urgent',
    supportCoverage: 'standard' as 'standard' | '24_7'
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectDesc: ''
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Dynamic cost calculation focused on software engineer deliverables
  const estimatedQuote = useMemo(() => {
    let basePrice = 0;
    let includedScreens = 0;
    let includedApis = 0;

    switch (calculatorInputs.selectedPackage) {
      case 'crud':
        basePrice = 3000;
        includedScreens = 5;
        includedApis = 3;
        break;
      case 'low-code':
        basePrice = 5000;
        includedScreens = 8;
        includedApis = 5;
        break;
      case 'ai':
        basePrice = 7000;
        includedScreens = 6;
        includedApis = 8;
        break;
      case 'saas':
        basePrice = 8500;
        includedScreens = 12;
        includedApis = 10;
        break;
      case 'custom':
        basePrice = 1500;
        includedScreens = 2;
        includedApis = 2;
        break;
    }

    const extraScreens = Math.max(0, calculatorInputs.screenCount - includedScreens);
    const extraApis = Math.max(0, calculatorInputs.apiNodes - includedApis);

    const devSubtotal = basePrice + (extraScreens * 250) + (extraApis * 400);

    // Apply speed multiplier
    const speedMultiplier = calculatorInputs.timelineSpeed === 'urgent' ? 1.35 : 1.0;
    let subtotal = devSubtotal * speedMultiplier;

    // Addons
    if (calculatorInputs.selectedAddons.includes('uiux')) subtotal += 1500;
    if (calculatorInputs.selectedAddons.includes('sla')) subtotal += 2000;
    if (calculatorInputs.selectedAddons.includes('hosting')) subtotal += 800;
    if (calculatorInputs.selectedAddons.includes('domain')) subtotal += 300;

    // Extra hours coverage
    if (calculatorInputs.supportCoverage === '24_7') subtotal += 1000;

    return Math.round(subtotal);
  }, [calculatorInputs]);

  const handlePackageChange = (pkg: 'crud' | 'low-code' | 'ai' | 'saas' | 'custom') => {
    let screens = 5;
    let apis = 3;
    if (pkg === 'low-code') { screens = 8; apis = 5; }
    else if (pkg === 'ai') { screens = 6; apis = 8; }
    else if (pkg === 'saas') { screens = 12; apis = 10; }
    else if (pkg === 'custom') { screens = 2; apis = 2; }
    
    setCalculatorInputs(prev => ({
      ...prev,
      selectedPackage: pkg,
      screenCount: screens,
      apiNodes: apis
    }));
  };

  const handleAddonToggle = (addonId: string) => {
    setCalculatorInputs(prev => {
      const active = prev.selectedAddons.includes(addonId);
      return {
        ...prev,
        selectedAddons: active 
          ? prev.selectedAddons.filter(id => id !== addonId)
          : [...prev.selectedAddons, addonId]
      };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pkgLabel = {
      crud: 'Classic CRUD & Warehouse Systems',
      'low-code': 'Advanced Low-Code Engine',
      ai: 'Autonomous AI Agent Integration',
      saas: 'Full SaaS Application Suite',
      custom: 'Custom Scope / MVP'
    }[calculatorInputs.selectedPackage];

    const addonsList = [];
    if (calculatorInputs.selectedAddons.includes('uiux')) addonsList.push('- Premium UI/UX Figma Design Specs (+$1,500)');
    if (calculatorInputs.selectedAddons.includes('sla')) addonsList.push('- 3-Month SLA Priority Support (+$2,000)');
    if (calculatorInputs.selectedAddons.includes('hosting')) addonsList.push('- Automated Cloud Deployment & SLA Setup (+$800)');
    if (calculatorInputs.selectedAddons.includes('domain')) addonsList.push('- Custom DNS Security & Global Edge Routing (+$300)');
    
    const addonsStr = addonsList.length > 0 ? addonsList.join('\n') : 'None selected';

    const emailSubject = `Project Inquiry: ${pkgLabel} - ${formData.name}`;
    const emailBody = `Hi Daffa,

I would like to initiate a new project. Below is the specification from your Freelance Configurator:

## PROJECT OVERVIEW
- Selected Configuration: ${pkgLabel}
- Screen Count: ${calculatorInputs.screenCount}
- API Integration Nodes: ${calculatorInputs.apiNodes}
- Timeline Delivery: ${calculatorInputs.timelineSpeed === 'urgent' ? 'Urgent / Fast-Track (1.35x multiplier)' : 'Standard'}
- Support Coverage: ${calculatorInputs.supportCoverage === '24_7' ? '24/7 Night/Weekend Shift Coverage (+$1,000)' : 'Standard Business Hours'}
- Add-ons Selected:
${addonsStr}

## ESTIMATED COST
- Total Proposal: $${estimatedQuote.toLocaleString()} USD

## CLIENT DETAILS
- Client Name: ${formData.name}
- Email Address: ${formData.email}

## BRIEF / REQUIREMENT SPEC
${formData.projectDesc}

---
Generated from Freelance Configurator Portal`;

    const mailtoUrl = `mailto:daffaaditya.me@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoUrl;

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', projectDesc: '' });
    }, 4000);
  };

  return (
    <>
      <Head>
        <title>Freelance Full-Stack Developer & UI/UX Designer | Daffa Aditya Rahman</title>
        <meta 
          name="description" 
          content="Hire Daffa Aditya Rahman, a freelance Full-Stack Software Engineer and UI/UX Designer specialized in building high-performance Next.js websites, custom APIs, and autonomous AI workflows." 
        />
        <meta name="keywords" content="Freelance Software Engineer, Full-Stack Developer, UI/UX Designer, Next.js Developer, React Developer, Node.js API, Go API, Custom AI Integration, Jakarta Developer, Freelance Next.js Developer Indonesia, Hire Web Developer Jakarta, Freelance Software Engineer Indonesia, Custom AI Workflow Integration, UI UX Designer Jakarta" />
        <meta name="author" content="Daffa Aditya Rahman" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://daffaaditya.id/freelance" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daffaaditya.id/freelance" />
        <meta property="og:title" content="Freelance Full-Stack Developer & UI/UX Designer | Daffa Aditya Rahman" />
        <meta property="og:description" content="Build high-performance web systems and AI applications with clean architecture and perfect Lighthouse scores. Check out case studies and get an instant cost estimate." />
        <meta property="og:image" content="/image/Profile.jpg" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://daffaaditya.id/freelance" />
        <meta property="twitter:title" content="Freelance Full-Stack Developer & UI/UX Designer | Daffa Aditya Rahman" />
        <meta property="twitter:description" content="Build high-performance web systems and AI applications with clean architecture and perfect Lighthouse scores. Check out case studies and get an instant cost estimate." />
        <meta property="twitter:image" content="/image/Profile.jpg" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Daffa Aditya Rahman | Freelance Full-Stack Developer & UI/UX Designer",
              "image": "https://daffaaditya.id/image/Profile.jpg",
              "url": "https://daffaaditya.id/freelance",
              "email": "daffaaditya.me@gmail.com",
              "description": "Professional freelance software engineer and UI/UX designer specializing in high-performance Next.js web applications, custom API backend systems, and autonomous AI agent integrations.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Jakarta",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-6.2088",
                "longitude": "106.8456"
              },
              "priceRange": "$$$",
              "knowsAbout": [
                "Full-Stack Web Development",
                "UI/UX Design",
                "Next.js & React",
                "Node.js & Go API Development",
                "AI Agents & LangGraph Integration",
                "PostgreSQL & MongoDB Database Design",
                "Performance Optimization & Core Web Vitals"
              ],
              "sameAs": [
                "https://github.com/DaffaAdityaDev",
                "https://www.linkedin.com/in/daffaadityarahman-14b588192/"
              ]
            })
          }}
        />
      </Head>

      <TimelineCursorPreview hoveredNode={hoveredNode} />

      {/* Edge-to-edge layout wrapper spanning full screen width up to 4K */}
      <div className="min-h-screen bg-[#070709] text-white pt-16 relative flex flex-col selection:bg-red-600 selection:text-white w-full overflow-x-hidden">
        
        {/* Subtle background grids */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
             style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Dynamic glows */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-950/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-zinc-900/20 rounded-full blur-[180px] pointer-events-none" />

        <main className="flex-1 w-full flex flex-col relative z-10">
          
          {/* =================================--------------------
              SECTION 1: HERO SECTION (The Hook + Primary CTA)
             =================================-------------------- */}
          <section aria-label="Hero Introduction" className="w-full bg-[#0a0a0c] p-6 sm:p-12 md:p-16 lg:p-24 border-b border-zinc-800 relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 min-h-[460px]">
            <div className="absolute top-0 bottom-0 left-[33.3%] w-[1px] bg-zinc-800/40 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-[66.6%] w-[1px] bg-zinc-800/40 pointer-events-none" />
            <div className="absolute inset-0 z-0 opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="space-y-6 max-w-5xl relative z-10">
              <div className="inline-flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <span className="text-red-500 text-xs font-bold font-mono tracking-widest uppercase">
                  PRODUCTION SYSTEMS ENGINE ACTIVE
                </span>
              </div>
              
              {/* Massive high-contrast award-grade heading scaling beautifully to 4k */}
              <h1 className="text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black text-white uppercase tracking-tighter leading-[0.82] mix-blend-difference">
                autonomous engineer <br />
                <span className="text-zinc-500">shaping performance</span> <br />
                from figma to scale.
              </h1>
              
              <p className="text-sm md:text-base text-zinc-400 font-mono leading-relaxed max-w-3xl">
                {/* Value Proposition / Hook */}
                I design and engineer high-performance, conversion-optimized web applications, custom API backend systems, and autonomous AI workflows using Next.js, Go, and Node.js. Optimized for speed, reliability, and clean developer handoffs.
              </p>
            </div>

            <div className="shrink-0 relative z-10 mt-8 lg:mt-0">
              <a href="#contact-scoping" className="group flex h-16 px-10 bg-white text-black font-bold tracking-tight hover:bg-neutral-200 transition-all items-center gap-3 active:scale-95 text-sm uppercase">
                DISCUSS PROJECT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <div className="absolute bottom-4 right-6 font-mono text-xs text-zinc-500 hidden md:block">
              MODEL: FREELANCE_GRID_V4.0 <br />
              SYS_REF: 4K_SUPPORTED_SCALE
            </div>
          </section>

          {/* =================================--------------------
              SECTION 2: PROJECTS PIPELINE TIMELINE (Scroll-Linked Projects Roadmap)
             =================================-------------------- */}
          <section ref={scrollContainerRef} className="w-full bg-[#0a0a0c] px-6 sm:px-12 md:px-16 lg:px-24 py-16 md:py-24 border-b border-zinc-800 relative">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">// SOLUTIONS_ROADMAP</span>
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mt-2">What I Offer & Tech Stack</h2>
                </div>
                <p className="text-xs font-mono text-zinc-500 tracking-wider md:max-w-xs text-left md:text-right">
                  // SCROLL TO TRACE ENGINE ALIGNMENT
                </p>
              </div>

              <div className="relative pl-8 md:pl-16 space-y-16">
                {/* SVG Vertical Track */}
                <div className="absolute left-[9px] md:left-[17px] top-4 bottom-4 w-[2px]">
                  {/* Backdrop line */}
                  <div className="absolute inset-0 bg-zinc-800" />
                  {/* Animated fill line using Framer Motion */}
                  <motion.div 
                    style={{ scaleY: scaleY, originY: 0 }}
                    className="absolute inset-0 bg-gradient-to-b from-red-600 via-red-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.7)]"
                  />
                </div>

                {(showAllProjects ? TIMELINE_NODES : TIMELINE_NODES.slice(0, 3)).map((node, idx) => {
                  return (
                    <div 
                      key={node.id} 
                      className="relative flex flex-col md:flex-row gap-6 md:gap-12 group cursor-crosshair"
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Timeline Anchor Node Dot */}
                      <div className="absolute -left-[31px] md:-left-[47px] top-1.5 z-10 flex items-center justify-center">
                        {/* Pulsing indicator */}
                        <div className="w-[16px] h-[16px] md:w-[20px] h-[20px] rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center transition-all duration-300 group-hover:border-red-500 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                          <div className="w-[6px] h-[6px] md:w-[8px] h-[8px] rounded-full bg-zinc-600 transition-colors duration-300 group-hover:bg-red-500" />
                        </div>
                      </div>

                      {/* Left Content Column (Category & Tech Stack) */}
                      <div className="w-full md:w-1/3 shrink-0">
                        <span className="text-xs font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">
                          {node.id}: {node.category}
                        </span>
                        <div className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors duration-300">
                          {node.title}
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {node.techs.map(tech => (
                            <span key={tech} className="bg-zinc-900/50 border border-zinc-800 px-2 py-1 text-zinc-300 font-mono text-[10px] rounded hover:border-zinc-700 hover:text-white transition-colors">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Content Column (Description, Details Card, Metric) */}
                      <div className="flex-1 p-6 md:p-8 border border-zinc-800 bg-zinc-900/20 rounded-xl group-hover:border-zinc-700 group-hover:bg-zinc-900/40 transition-all duration-300 relative overflow-hidden">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-950/10 transition-colors" />

                        <p className="text-zinc-300 font-mono text-sm leading-relaxed mb-6">
                          {node.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                          {node.points.map(pt => (
                            <div key={pt} className="flex items-start gap-2 text-xs font-mono text-zinc-400">
                              <span className="text-red-500 mt-0.5 shrink-0">✔</span>
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-xs font-mono text-zinc-400">
                          <span>SYSTEM PARAMETER</span>
                          <span className="text-red-500 font-bold uppercase tracking-wider">{node.metric}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show More / Show Less Button */}
              {TIMELINE_NODES.length > 3 && (
                <div className="mt-12 flex justify-center relative z-20">
                  <button
                    onClick={() => setShowAllProjects(!showAllProjects)}
                    className="group px-6 py-3 border border-zinc-800 bg-[#0f0f13] text-zinc-300 font-mono text-xs uppercase tracking-widest hover:border-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all duration-300 rounded-lg flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>{showAllProjects ? 'Collapse Projects [-]' : 'Expand Full Roadmap [+]'}</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* =================================--------------------
              SECTION 3: GRID SKILLS (High-Contrast Tech Stack Capabilities)
             =================================-------------------- */}
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

          {/* =================================--------------------
              SECTION 5: DE-RISKING & TRUST BUILDERS (Handoff & Testimonials)
             =================================-------------------- */}
          <section aria-label="Trust & Testimonials" className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-zinc-800 border-b border-zinc-800">
            
            {/* The "Clean Handoff" Guarantee Cell */}
            <div className="bg-[#0f0f13] p-8 md:p-12 xl:p-16 space-y-6 border-b lg:border-b-0 border-zinc-800 lg:border-r border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4 mb-6">
                  <ShieldCheck size={18} className="text-red-500" />
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">The Clean Handoff Guarantee</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-snug mb-4">
                  Write code once. Maintain it forever.
                </h3>
                
                <p className="text-sm font-mono text-zinc-400 leading-relaxed mb-6">
                  Freelance clients are terrified of hiring engineers who deliver unmaintainable black boxes. 
                  I design all custom logic with robust JSDoc declarations, standard TypeScript configurations, 
                  and modular directory boundaries.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-sm text-zinc-300">
                  <div className="p-3 border border-zinc-800 rounded bg-zinc-900/30 flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Comprehensive README, env setups & deploy docs</span>
                  </div>
                  <div className="p-3 border border-zinc-800 rounded bg-zinc-900/30 flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Modular state management with zero tight-coupling</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-zinc-800 pt-6 mt-6 font-mono text-xs text-zinc-400 uppercase flex justify-between">
                <span>Maintainability Index: 100/100</span>
                <span>Type Coverage: Strict-True</span>
              </div>
            </div>

            {/* Testimonials / Technical Commendations Cell */}
            <div className="bg-[#0f0f13] p-8 md:p-12 xl:p-16 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4 mb-6">
                  <UserCheck size={18} className="text-red-500" />
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Technical Commendations</span>
                </div>
                
                <div className="space-y-6">
                  {TESTIMONIALS.map((t, idx) => (
                    <div key={idx} className="border-l-2 border-red-500 pl-4 space-y-2">
                      <p className="text-sm md:text-base font-mono text-zinc-300 italic leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <span className="text-xs font-mono text-zinc-400 uppercase block font-bold">
                        // {t.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>

          {/* =================================--------------------
              SECTION 6: RISK FAQ MATRIX (Full-Width Accordion)
             =================================-------------------- */}
          <section className="w-full bg-[#0b0b0e] px-6 sm:px-12 md:px-16 lg:px-24 py-16 md:py-24 border-b border-zinc-800">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12 border-b border-zinc-800 pb-6 text-center sm:text-left">
                <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">// SYSTEM_RISK_ASSESSMENT</span>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mt-2">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border border-zinc-800 bg-zinc-900/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-zinc-700">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full flex justify-between items-center text-left p-6 font-mono font-bold uppercase text-white hover:text-red-500 transition-colors gap-4"
                    >
                      <span className="text-sm md:text-base">{faq.q}</span>
                      <span className="text-red-500 font-bold shrink-0">{activeFaq === idx ? '[-]' : '[+]'}</span>
                    </button>
                    {activeFaq === idx && (
                      <div className="px-6 pb-6 text-sm font-mono text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-4 bg-zinc-900/10">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =================================--------------------
              SECTION 7: INTERACTIVE SCOPE CONFIGURATOR (2-Column Layout)
             =================================-------------------- */}
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
                  </div>                  {/* Sizing Sliders */}
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
                        onChange={(e) => setCalculatorInputs(prev => ({ ...prev, screenCount: parseInt(e.target.value) }))}
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
                        onChange={(e) => setCalculatorInputs(prev => ({ ...prev, apiNodes: parseInt(e.target.value) }))}
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
                            onClick={() => setCalculatorInputs(prev => ({ ...prev, timelineSpeed: 'standard' }))}
                            className={`py-1.5 text-xs font-mono rounded uppercase ${calculatorInputs.timelineSpeed === 'standard' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                          >
                            Standard
                          </button>
                          <button
                            type="button"
                            onClick={() => setCalculatorInputs(prev => ({ ...prev, timelineSpeed: 'urgent' }))}
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
                            onClick={() => setCalculatorInputs(prev => ({ ...prev, supportCoverage: 'standard' }))}
                            className={`py-1.5 text-xs font-mono rounded uppercase ${calculatorInputs.supportCoverage === 'standard' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                          >
                            Business
                          </button>
                          <button
                            type="button"
                            onClick={() => setCalculatorInputs(prev => ({ ...prev, supportCoverage: '24_7' }))}
                            className={`py-1.5 text-xs font-mono rounded uppercase ${calculatorInputs.supportCoverage === '24_7' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                          >
                            24/7 (+$1k)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>                {/* Column 2: Live proposal card & form (5 cols) */}
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
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                            onChange={(e) => setFormData(prev => ({ ...prev, projectDesc: e.target.value }))}
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

        </main>
      </div>
    </>
  );
}
