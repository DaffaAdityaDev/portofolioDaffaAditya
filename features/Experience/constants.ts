export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  image: string;
  description: string;
  milestones: string[];
}

export const experienceData: ExperienceItem[] = [
  { 
    year: `2024 - NOW (${new Date().getFullYear() - 2024 > 1 ? `${new Date().getFullYear() - 2024}+ years` : '1+ year'})`, 
    role: 'Frontend Engineer', 
    company: 'PT Global Sukses Solusi Tbk (Run System)', 
    image: '/image/experience/RUNS.webp',
    description: 'Pushing the boundaries of enterprise-grade solutions by building robust, scalable frontend architectures. Bridging the gap between design and complex technical constraints to deliver polished, production-ready software.',
    milestones: [
      'Architected and delivered modular, scalable enterprise-grade frontend web systems.',
      'Optimized complex UI workflows, responsive state architectures, and mission-critical ERP data pipelines.',
      'Enforced code quality, reusable design system component standards, and cross-team review practices.'
    ]
  },
  { 
    year: '2023 (3 months)', 
    role: 'Software Engineer (Internship)', 
    company: 'Ombudsman Republik Indonesia', 
    image: '/image/experience/ombudsman.webp',
    description: 'Developed critical infrastructure and built high-availability internal management systems for government use using Laravel and React.',
    milestones: [
      'Developed critical internal infrastructure and high-availability systems for public service governance.',
      'Engineered secure Laravel and React web applications with strict role-based access control.',
      'Ensured public sector data integrity, reliable reporting features, and clean database workflows.'
    ]
  },
  { 
    year: '2023 (6 months)', 
    role: 'Frontend Developer (Internship)', 
    company: 'PT. Quantum Leap', 
    image: '/image/experience/quantum_leap.webp',
    description: 'Developed responsive corporate websites, integrated RESTful APIs, and worked closely within a dynamic agency environment on collaborative teams.',
    milestones: [
      'Developed high-converting responsive corporate websites and interactive client web solutions.',
      'Integrated RESTful APIs, optimized asset delivery, and collaborated in fast-paced agency sprint cycles.',
      'Partnered closely with UI/UX designers to translate Figma prototypes into pixel-perfect interfaces.'
    ]
  },
  { 
    year: '2023 (6 months)', 
    role: 'Mobile Developer Cohort', 
    company: 'Bangkit Academy (Google, Goto, Traveloka)', 
    image: '/image/experience/bangkit.webp',
    description: 'Trained directly by senior industry engineers from Google, GoTo, and Traveloka, building real-world production applications with modern architecture standards.',
    milestones: [
      'Completed intensive engineering curriculum in modern Android Architecture, Kotlin, and Clean Architecture patterns.',
      'Integrated high-performance on-device Machine Learning models directly into production-grade mobile applications.',
      'Mentored directly by industry professionals to build, review, and ship real-world production applications.'
    ]
  },
  { 
    year: '2017 - 2018 (6 months)', 
    role: 'IT Support (Internship)', 
    company: 'PT Jasa Marga (Persero) Tbk', 
    image: '/image/experience/jasa_marga.webp',
    description: 'Provided essential technical support and maintained core IT infrastructure across the enterprise organization.',
    milestones: [
      'Delivered mission-critical hardware and networking technical support across enterprise departments.',
      'Maintained operational uptime for internal corporate workstations, printers, and core networks.',
      'Assisted in software deployment, system troubleshooting, and IT infrastructure health monitoring.'
    ]
  }
];
