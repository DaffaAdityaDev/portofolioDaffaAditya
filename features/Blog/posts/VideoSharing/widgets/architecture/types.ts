import type { LucideIcon } from 'lucide-react';
import type { FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';

export type ArchitectureNodeId =
  | 'client'
  | 'lb'
  | 'api'
  | 'broker'
  | 'upload'
  | 'transcoders'
  | 'storage'
  | 'edge'
  | 'midtier'
  | 'db'
  | 'cache';

/** A path through the system that the overview can light up on its own. */
export type ArchitectureFlowId = 'upload' | 'stream';

/** What the overview shows: every route, or only one flow. */
export type ArchitectureView = 'all' | ArchitectureFlowId;

/** Kind of component. Each kind has its own color. */
export type ArchitectureCategory = 'client' | 'network' | 'service' | 'async' | 'data';

export interface ArchitectureCategoryOption {
  label: string;
  color: string;
}

/** A deployable service: the components inside its box are owned and scaled together. */
export type ArchitectureGroupId = 'upload' | 'data' | 'api' | 'delivery';

export interface ArchitectureGroup {
  label: string;
  caption: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ArchitectureNode extends FlowNodeLayout {
  category: ArchitectureCategory;
  /** The service that owns it. Entry components such as the client have none. */
  group?: ArchitectureGroupId;
  icon: LucideIcon;
  /** Runs as many identical copies and scales out by adding more. Drawn as a stack. */
  scalesOut?: boolean;
  /** Full name, used in the component table. */
  name: string;
  description: string;
}

export interface ArchitectureEdge extends FlowEdgeLayout {
  from: ArchitectureNodeId;
  to: ArchitectureNodeId;
  flows: ArchitectureFlowId[];
}

export interface ArchitectureViewOption {
  id: ArchitectureView;
  label: string;
  summary: string;
}
