/**
 * Timeline, Freelance & Service Domain Types
 * Shared models for career milestones, clients, and technical audits.
 */

export interface TimelineNode {
  id: string;
  category: string;
  title: string;
  description: string;
  points: string[];
  techs: string[];
  metric: string;
  image: string;
}

export interface FaqItem {
  q: string;
  a: string;
}


export type PackageType = 'crud' | 'low-code' | 'ai' | 'saas' | 'custom';

export interface CalculatorInputs {
  selectedPackage: PackageType;
  screenCount: number;
  apiNodes: number;
  selectedAddons: string[];
  timelineSpeed: 'standard' | 'urgent';
  supportCoverage: 'standard' | '24_7';
}

export interface FreelanceFormData {
  name: string;
  email: string;
  projectDesc: string;
}
