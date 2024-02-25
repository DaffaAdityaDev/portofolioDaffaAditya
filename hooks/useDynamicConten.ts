import { useEffect, useState, useRef } from 'react';

type LoadContent = () => JSX.Element | null;

function useDynamicContent(loadContent: LoadContent) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold:   0.1 }
    );

    const currentRef = ref.current; // Capture the current value of ref.current

    if (currentRef) {
        observer.observe(currentRef);
      }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return {
    ref,
    content: isVisible ? loadContent() : null,
  };
}

export default useDynamicContent;