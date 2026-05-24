// ─── useBookmarks ─────────────────────────────────────────────────────────────
// Thin wrapper over the Zustand bookmark store, exposing a clean API and
// demonstrating selector-based subscriptions (components only re-render when
// their slice of state changes).

import { useBookmarkStore, selectIsBookmarked, selectToggle, selectHasHydrated } from '@/store/bookmarkStore';

export function useBookmarks(jobId: string) {
  // Wait for persist middleware to rehydrate from localStorage before trusting
  // isBookmarked. Without this guard the server (empty store) and client
  // (rehydrated store) disagree on the first render → React hydration error.
  const hasHydrated  = useBookmarkStore(selectHasHydrated);
  const isBookmarked = useBookmarkStore(selectIsBookmarked)(jobId);
  const toggle       = useBookmarkStore(selectToggle);

  return {
    // Return false until localStorage has been read — matches what the server rendered.
    isBookmarked: hasHydrated && isBookmarked,
    toggle: () => toggle(jobId),
  };
}
