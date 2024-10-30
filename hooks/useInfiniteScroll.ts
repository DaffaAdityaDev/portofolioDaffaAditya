import { useEffect, useCallback, useRef } from 'react';

export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  hasMore: boolean,
  loading: boolean,
  threshold: number = 100
) {
  const loadingRef = useRef(false);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  const handleScroll = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;

    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      try {
        loadingRef.current = true;
        await loadMore();
        retryCount.current = 0; // Reset retry count on success
      } catch (error) {
        console.error('Error in infinite scroll:', error);
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current++;
          // Retry after a delay
          setTimeout(() => {
            loadingRef.current = false;
          }, 2000);
        }
      } finally {
        loadingRef.current = false;
      }
    }
  }, [loadMore, hasMore, threshold]);

  // Debounce scroll handler
  const debounce = (fn: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  useEffect(() => {
    const debouncedHandler = debounce(handleScroll, 150);
    window.addEventListener('scroll', debouncedHandler);

    // Initial check in case the content doesn't fill the page
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      handleScroll();
    }

    return () => window.removeEventListener('scroll', debouncedHandler);
  }, [handleScroll]);
}
