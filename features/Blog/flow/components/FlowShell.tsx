import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { FlowConfig, FlowStep } from '@/features/Blog/flow/types';
import { FLOW_AUTOPLAY_VISIBLE_AMOUNT } from '../constants';
import { useFlowAutoplay } from '../hooks/useFlowAutoplay';
import WidgetFrame from '../../components/WidgetFrame';
import FlowCaption from './FlowCaption';
import FlowDiagram from './FlowDiagram';
import { PlaybackControls, ScenarioPicker } from './FlowControls';

interface FlowShellProps<TStep extends FlowStep> {
  flow: FlowConfig<TStep>;
  title: string;
  icon: LucideIcon;
  /** Extra panel between the diagram and the caption, such as progress meters. */
  children?: React.ReactNode;
}

/**
 * Frame for a step-by-step flow: scenario picker, diagram, optional panel,
 * caption and playback controls. Playback only runs while the flow is on screen.
 */
const FlowShell = <TStep extends FlowStep>({ flow, title, icon, children }: FlowShellProps<TStep>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { amount: FLOW_AUTOPLAY_VISIBLE_AMOUNT });

  useFlowAutoplay(flow, isVisible);

  return (
    <WidgetFrame ref={ref} title={title} icon={icon}>
      <div className="flex flex-col gap-5 p-4">
        <ScenarioPicker flow={flow} />
        <FlowDiagram flow={flow} />
        {children}
        <FlowCaption flow={flow} />
        <PlaybackControls flow={flow} />
      </div>
    </WidgetFrame>
  );
};

export default FlowShell;
