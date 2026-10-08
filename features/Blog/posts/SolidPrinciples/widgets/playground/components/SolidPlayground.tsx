import React from 'react';
import ReactPlayground from '@/features/Blog/components/ReactPlayground';
import {
  SOLID_PLAYGROUND_ACTIVE_FILE,
  SOLID_PLAYGROUND_FILES,
  SOLID_PLAYGROUND_HEIGHT,
} from '../constants';

/** The refactored avatar form in the live editor. The reader swaps uploaders in uploader.ts. */
const SolidPlayground: React.FC = () => (
  <ReactPlayground
    title="Swap the uploader"
    template="react-ts"
    files={SOLID_PLAYGROUND_FILES}
    activeFile={SOLID_PLAYGROUND_ACTIVE_FILE}
    height={SOLID_PLAYGROUND_HEIGHT}
    showConsole
  />
);

export default SolidPlayground;
