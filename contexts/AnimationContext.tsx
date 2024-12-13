import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface AnimationState {
  isAnimating: boolean;
  prevPath: string;
  duration: {
    base: number;
    delay: number;
    total: number;
  };
  columns: number;
  scrollPosition: number;
  isTransitioning: boolean;
}

interface AnimationContextType {
  state: AnimationState;
  setIsAnimating: (value: boolean) => void;
  setPrevPath: (value: string) => void;
  startPageTransition: (path: string) => void;
  resetAnimation: () => void;
  saveScrollPosition: () => void;
  restoreScrollPosition: () => void;
}

const defaultState: AnimationState = {
  isAnimating: false,
  prevPath: '',
  duration: {
    base: 1.2,
    delay: 0.08,
    total: 1500,
  },
  columns: 5,
  scrollPosition: 0,
  isTransitioning: false,
};

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AnimationState>(defaultState);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState(prev => ({ ...prev, isTransitioning: true }));
    };

    const handleRouteChangeComplete = () => {
      if (!state.isTransitioning) {
        // If not transitioning (direct load), scroll to top
        window.scrollTo(0, 0);
      }
      setState(prev => ({ ...prev, isTransitioning: false }));
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  const setIsAnimating = (value: boolean) => {
    setState(prev => ({ ...prev, isAnimating: value }));
  };

  const setPrevPath = (value: string) => {
    setState(prev => ({ ...prev, prevPath: value }));
  };

  const saveScrollPosition = () => {
    setState(prev => ({
      ...prev,
      scrollPosition: window.scrollY
    }));
  };

  const restoreScrollPosition = () => {
    window.scrollTo(0, state.scrollPosition);
  };

  const startPageTransition = (path: string) => {
    saveScrollPosition();
    setState(prev => ({
      ...prev,
      isAnimating: true,
      prevPath: path,
      isTransitioning: true
    }));
  };

  const resetAnimation = () => {
    setState(prev => ({
      ...prev,
      isAnimating: false
    }));
    if (state.isTransitioning) {
      restoreScrollPosition();
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <AnimationContext.Provider value={{ 
      state,
      setIsAnimating,
      setPrevPath,
      startPageTransition,
      resetAnimation,
      saveScrollPosition,
      restoreScrollPosition
    }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
}
