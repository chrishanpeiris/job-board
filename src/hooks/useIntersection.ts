// ─── useIntersection ─────────────────────────────────────────────────────────
// Demonstrates: useRef, useEffect, IntersectionObserver API, cleanup pattern.
// Used for lazy-loading / infinite-scroll trigger.

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionOptions extends IntersectionObserverInit {
  /** Once the element intersects, stop observing (fire once). Default: false */
  once?: boolean;
}

export function useIntersection<T extends Element>(
  options: UseIntersectionOptions = {},
): [React.RefObject<T>, boolean] {
  const { once = false, ...observerOptions } = options;
  const ref       = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && once) observer.disconnect();
    }, observerOptions);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, observerOptions.root, observerOptions.rootMargin, observerOptions.threshold]);

  return [ref, isIntersecting];
}
