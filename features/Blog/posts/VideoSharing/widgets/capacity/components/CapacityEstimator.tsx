import React from 'react';
import { Calculator } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { VideoConstraints } from '@/features/Blog/posts/VideoSharing/widgets/capacity/types';
import AnimatedNumber from '@/features/Blog/components/AnimatedNumber';
import SliderField from '@/features/Blog/components/SliderField';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import { CONSTRAINT_LIMITS, DAYS_PER_YEAR } from '../constants';
import { useVideoConstraints } from '../hooks/useVideoDesignSlices';
import CdnPriceSlider from './CdnPriceSlider';
import {
  formatCompact,
  formatIdr,
  formatStorage,
  formatBandwidth,
  formatUsd,
} from '../utils/format';

interface ConstraintField {
  key: keyof VideoConstraints;
  label: string;
  /** Defaults to the plain number. */
  format?: (value: number) => string;
}

const CONSTRAINT_FIELDS: ConstraintField[] = [
  { key: 'dailyActiveUsersM', label: 'Daily active users', format: (v) => `${v}M` },
  { key: 'viewsPerUserPerDay', label: 'Videos watched / user / day' },
  { key: 'readWriteRatio', label: 'Views per upload', format: (v) => `${v} : 1` },
  { key: 'avgVideoSizeMb', label: 'Average video size', format: (v) => `${v} MB` },
];

interface ResultTileProps {
  label: string;
  value: number;
  format: (value: number) => string;
  hint: string;
  accent?: boolean;
}

const ResultTile: React.FC<ResultTileProps> = ({ label, value, format, hint, accent }) => (
  <div className="border border-neutral-800 bg-[#0a0a0a] p-3">
    <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{label}</div>
    <AnimatedNumber
      value={value}
      format={format}
      className={cn('block text-2xl font-black tabular-nums', accent ? 'text-red-500' : 'text-white')}
    />
    <div className="mt-1 text-xs leading-snug text-neutral-500">{hint}</div>
  </div>
);

/** Sliders for the product constraints, with the capacity numbers they imply. */
const CapacityEstimator: React.FC = () => {
  const { constraints, estimates, setConstraint } = useVideoConstraints();

  return (
    <WidgetFrame title="Capacity estimator" icon={Calculator}>
      <div className="grid gap-6 p-4 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          {CONSTRAINT_FIELDS.map(({ key, label, format }) => (
            <SliderField
              key={key}
              label={label}
              value={constraints[key]}
              format={format}
              onChange={(value) => setConstraint(key, value)}
              {...CONSTRAINT_LIMITS[key]}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 content-start gap-3">
          <ResultTile
            label="Views / day"
            value={estimates.viewsPerDay}
            format={formatCompact}
            hint={`${formatCompact(estimates.viewsPerSecond)} playback starts per second`}
          />
          <ResultTile
            label="Uploads / day"
            value={estimates.uploadsPerDay}
            format={formatCompact}
            hint={`1 upload for every ${constraints.readWriteRatio} views`}
          />
          <ResultTile
            label="New storage / day"
            value={estimates.storageMbPerDay}
            format={formatStorage}
            hint="Before compression and replication"
          />
          <ResultTile
            label="Outbound traffic"
            value={estimates.avgEgressTbps}
            format={formatBandwidth}
            hint="Average, if every view streams a full video"
          />
          <div className="col-span-2">
            <ResultTile
              label="Bandwidth bill / day"
              value={estimates.egressCostPerDayUsd}
              format={formatUsd}
              hint={`About ${formatIdr(estimates.egressCostPerDayUsd)} a day, or ${formatUsd(estimates.egressCostPerDayUsd * DAYS_PER_YEAR)} a year, just to move bytes`}
              accent
            />
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-5 md:col-span-2">
          <CdnPriceSlider />
        </div>
      </div>

      <div className="border-t border-neutral-800 px-4 py-2 text-xs text-neutral-500">
        These numbers also set the baseline traffic in the simulator further down.
      </div>
    </WidgetFrame>
  );
};

export default CapacityEstimator;
