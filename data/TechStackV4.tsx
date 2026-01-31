import { Code2, Server, Database, Box, Cpu, FileJson, Layers, PenTool } from 'lucide-react';

export const techStackData = [
  { 
    icon: <Code2 size={32} />, 
    label: 'Frontend', 
    techs: ['React', 'Next.js', 'Vue.js', 'Astro', 'Tailwind', 'Laravel'] 
  },
  { 
    icon: <Server size={32} />, 
    label: 'Backend', 
    techs: ['Node.js', 'Express', 'PostgreSQL', 'Firebase', 'MongoDB', 'Linux'] 
  },
  { 
    icon: <Cpu size={32} />, 
    label: 'Mobile', 
    techs: ['Kotlin', 'Jetpack Compose', 'React Native', 'Retrofit', 'Room'] 
  },
  { 
    icon: <Box size={32} />, 
    label: 'DevOps', 
    techs: ['Docker', 'Git', 'GitHub', 'Microservices'] 
  },
  { 
    icon: <PenTool size={32} />, 
    label: 'UI/UX & Tools', 
    techs: ['Figma', 'Photoshop', 'Blender', 'Responsive Design'] 
  }
];
