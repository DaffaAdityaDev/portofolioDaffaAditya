import type { LucideIcon } from 'lucide-react';

/**
 * Navigation Item Model
 */
export interface NavItem {
  label: string;
  id?: string;
  path?: string;
}

/**
 * Architectural Spine Section Node
 */
export interface SectionNode {
  id: string;
  number: string;
  label: string;
}

/**
 * Social Connection Link
 */
export interface SocialLink {
  label: string;
  href: string;
  Icon?: LucideIcon;
  external?: boolean;
  aria?: string;
}
