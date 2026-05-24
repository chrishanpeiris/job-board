// ─── Bookmark store (Zustand) ─────────────────────────────────────────────────
// Demonstrates: Zustand v5 createStore, immer-style mutations (via set),
// localStorage persistence middleware, and selector pattern.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Shape ─────────────────────────────────────────────────────────────────────

interface BookmarkState {
  /** Set of bookmarked job IDs */
  bookmarkedIds: Set<string>;

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
