// ─── Bookmark store (Zustand) ─────────────────────────────────────────────────
// Demonstrates: Zustand v5 createStore, immer-style mutations (via set),
// localStorage persistence middleware, and selector pattern.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Shape ─────────────────────────────────────────────────────────────────────

interface BookmarkState {
  /** Set of bookmarked job IDs */
  bookmarkedIds: Set<string>;

  /**
   * True after the persist middleware has rehydrated from localStorage.
   * Use this to avoid SSR/client hydration mismatches: on the server the
   * store always starts empty, so components must treat bookmark state as
   * unknown until _hasHydrated is true.
   */
  _hasHydrated: boolean;
  _setHasHydrated: (v: boolean) => void;

  // Actions
  bookmark:    (jobId: string) => void;
  unbookmark:  (jobId: string) => void;
  toggle:      (jobId: string) => void;
  isBookmarked:(jobId: string) => boolean;
  clear:       () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedIds: new Set<string>(),

      _hasHydrated: false,
      _setHasHydrated: (v) => set({ _hasHydrated: v }),

      bookmark: (jobId) =>
        set((state) => ({ bookmarkedIds: new Set([...state.bookmarkedIds, jobId]) })),

      unbookmark: (jobId) =>
        set((state) => {
          const next = new Set(state.bookmarkedIds);
          next.delete(jobId);
          return { bookmarkedIds: next };
        }),

      toggle: (jobId) => {
        if (get().bookmarkedIds.has(jobId)) get().unbookmark(jobId);
        else                                 get().bookmark(jobId);
      },

      isBookmarked: (jobId) => get().bookmarkedIds.has(jobId),

      clear: () => set({ bookmarkedIds: new Set() }),
    }),
    {
      name: 'job-board-bookmarks',
      // Called after persist has finished reading from storage.
      // Flipping _hasHydrated lets components know it's safe to trust isBookmarked.
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
      // Zustand persist serialises to JSON; Set → Array → Set
      storage: {
        getItem: (key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          const parsed = JSON.parse(raw) as { state: { bookmarkedIds: string[] } };
          return {
            state: { bookmarkedIds: new Set(parsed.state.bookmarkedIds) },
          };
        },
        setItem: (key, value) => {
          const serialisable = {
            state: { bookmarkedIds: [...value.state.bookmarkedIds] },
          };
          localStorage.setItem(key, JSON.stringify(serialisable));
        },
        removeItem: (key) => localStorage.removeItem(key),
      },
    },
  ),
);

// ── Fine-grained selectors (avoid re-renders on unrelated state changes) ──────

export const selectBookmarkedIds = (s: BookmarkState) => s.bookmarkedIds;
export const selectToggle        = (s: BookmarkState) => s.toggle;
export const selectIsBookmarked  = (s: BookmarkState) => s.isBookmarked;
export const selectHasHydrated   = (s: BookmarkState) => s._hasHydrated;
