import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useHydrated } from '@/hooks/useHydrated';

interface PortalProps {
  children: ReactNode;
}

/** Renders into document.body; nothing in the static HTML or during hydration, where there is no body to portal into. */
const Portal: React.FC<PortalProps> = ({ children }) => {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return createPortal(children, document.body);
};

export default Portal;
