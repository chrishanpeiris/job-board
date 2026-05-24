// ─── useBookmarks ─────────────────────────────────────────────────────────────
// Thin wrapper over the Zustand bookmark store, exposing a clean API and
// demonstrating selector-based subscriptions (components only re-render when
// their slice of state changes).

import { useBookmarkStore, selectIsBookmarked, selectToggle } from '@/store/bookmarkStore';

export function useBookmarks(jobId: string) {
  // Fine-grained selectors — this component re-renders ONLY when this job's
  // bookmark status changes, not on every unrelated store update.
  const isBookmarked = useBookmarkStore(selectIsBookmarked)(jobId);
  const toggle       = useBookmarkStore(selectToggle);

  return {
    isBookmarked,
    toggle: () => toggle(jobId),
  };
}
