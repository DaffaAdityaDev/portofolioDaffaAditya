import React from 'react';
import { Layers, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import ActionButton from '@/features/Blog/components/ActionButton';
import ToggleButton from '@/features/Blog/components/ToggleButton';
import SliderField from '@/features/Blog/components/SliderField';
import AnimatedNumber from '@/features/Blog/components/AnimatedNumber';
import { WIDGET_LABEL_CLASS } from '@/features/Blog/components/widgetStyles';
import { LATENCY_RANGE, RENDER_MODE_ORDER, RENDER_MODES, SHELL_RENDER_MS } from '../constants';
import { usePprTimeline } from '../hooks/usePprTimeline';
import StorePreview from './StorePreview';
import TimelineChart from './TimelineChart';

const formatMs = (value: number): string => `${Math.round(value)} ms`;

const Stat: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <div className={cn('mb-0.5', WIDGET_LABEL_CLASS)}>{label}</div>
    <div className="font-mono text-lg font-bold tabular-nums text-neutral-100">{children}</div>
  </div>
);

/**
 * One store page with a personal cart, rendered four ways. Move the data
 * latencies and see when the first content and the user's own cart appear.
 */
const PprTimeline: React.FC = () => {
  const { mode, cartMs, productsMs, response, clockMs, setMode, setCartMs, setProductsMs, replay } =
    usePprTimeline();

  return (
    <WidgetFrame title="Four ways to render one page" icon={Layers}>
      <div className="overflow-x-auto">
        <div className="flex min-w-[320px] flex-col gap-5 p-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Render mode">
            {RENDER_MODE_ORDER.map((id) => {
              const isSelected = id === mode;
              return (
                <ToggleButton key={id} selected={isSelected} onClick={() => setMode(id)}>
                  {RENDER_MODES[id].label}
                </ToggleButton>
              );
            })}
            <ActionButton
              variant="light"
              onClick={replay}
              className="ml-auto font-mono uppercase tracking-wider text-muted-foreground"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Replay
            </ActionButton>
          </div>
          <div className="text-xs leading-relaxed text-neutral-500">{RENDER_MODES[mode].summary}</div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SliderField
              label="Cart service latency"
              value={cartMs}
              {...LATENCY_RANGE}
              onChange={setCartMs}
              format={formatMs}
            />
            <SliderField
              label="Product list latency"
              value={productsMs}
              {...LATENCY_RANGE}
              onChange={setProductsMs}
              format={formatMs}
            />
          </div>

          <div className="grid items-start gap-5 sm:grid-cols-[220px_1fr]">
            <StorePreview response={response} clockMs={clockMs} />

            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <Stat label="First content">
                  <AnimatedNumber value={response.firstContentMs} format={formatMs} />
                </Stat>
                <Stat label="Cart shows your items">
                  {response.personalCartMs === null ? (
                    <span className="text-neutral-500">never</span>
                  ) : (
                    <AnimatedNumber value={response.personalCartMs} format={formatMs} />
                  )}
                </Stat>
              </div>

              <TimelineChart response={response} clockMs={clockMs} />

              <div className="text-xs leading-relaxed text-neutral-500">
                {(mode === 'ppr' || mode === 'stream') && (
                  <span className="text-neutral-300">Holes fill in later in the same HTTP response. </span>
                )}
                A model, not a benchmark: times start when the request reaches the server, the network is
                left out, cached HTML counts as 0 ms, and rendering the shell on a request is set to{' '}
                {SHELL_RENDER_MS} ms. The red mark is the first paint.
              </div>
            </div>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
};

export default PprTimeline;
