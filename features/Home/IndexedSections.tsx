import React, { useEffect } from 'react';
import AboutMe from '@/features/AboutMe';
import Experience from '@/features/Experience';
import Projects from '@/features/Projects';
import TechStack from '@/features/TechStack';

interface IndexedSectionsProps {
  /** Runs once the client copy has replaced the static markup (the old section nodes are gone by then). */
  onMount?: () => void;
}

/**
 * The home sections the ArchitecturalSpine indexes by id, loaded as one lazyOnView chunk.
 *
 * They swap in together on purpose: the spine looks its sections up once when it mounts, so every
 * swap means remounting it. One swap happens near the top of the page, where the spine is hidden;
 * per-section swaps would happen while it is on screen and replay its entrance each time.
 */
const IndexedSections: React.FC<IndexedSectionsProps> = ({ onMount }) => {
  useEffect(() => {
    onMount?.();
  }, [onMount]);

  return (
    <>
      <AboutMe />
      <Experience />
      <Projects />
      <TechStack />
    </>
  );
};

export default IndexedSections;
