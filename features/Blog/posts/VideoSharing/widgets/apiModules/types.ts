import type { LucideIcon } from 'lucide-react';
import type { ArchitectureCategory } from '../architecture/types';
import type { FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';

export type ApiModuleNodeId =
  | 'client'
  | 'lb'
  | 'accounts'
  | 'watch'
  | 'comments'
  | 'counters'
  | 'dashboard'
  | 'userDb'
  | 'metadataCache'
  | 'metadataDb'
  | 'commentsDb'
  | 'events'
  | 'analytics'
  | 'aggregator';

export interface ApiModuleNode extends FlowNodeLayout {
  category: ArchitectureCategory;
  icon: LucideIcon;
  /** Runs as many identical copies. Drawn as a stack. */
  scalesOut?: boolean;
  /** Full name, used in the detail panel. */
  name: string;
  description: string;
}

export interface ApiModuleEdge extends FlowEdgeLayout {
  from: ApiModuleNodeId;
  to: ApiModuleNodeId;
}
