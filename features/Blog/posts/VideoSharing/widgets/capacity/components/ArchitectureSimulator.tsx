import React, { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useVideoDesignStore } from '@/features/Blog/posts/VideoSharing/widgets/capacity/store';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import { SIM } from '../constants';
import { useSimulationLoop } from '../hooks/useSimulationLoop';
import { DesignControls, TrafficControls } from './SimulatorControls';
import SimulatorDiagram from './SimulatorDiagram';
import SimulatorReadout from './SimulatorReadout';

/**
 * Interactive traffic simulator for the video service. It only ticks while it
 * is on screen, so it costs nothing once the reader scrolls past.
 */
const ArchitectureSimulator: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { margin: SIM.viewportMargin });
  const resetSimulation = useVideoDesignStore((state) => state.resetSimulation);

  useSimulationLoop(isVisible);

  // A spike still in progress should not greet the reader on their next visit.
  useEffect(() => resetSimulation, [resetSimulation]);

  return (
    <WidgetFrame ref={ref} title="Traffic simulator" icon={Activity}>
      <div className="flex flex-col gap-6 p-4">
        <TrafficControls />
        <SimulatorDiagram />
        <SimulatorReadout />
        <div className="border-t border-neutral-800 pt-5">
          <DesignControls />
        </div>
      </div>
    </WidgetFrame>
  );
};

export default ArchitectureSimulator;
