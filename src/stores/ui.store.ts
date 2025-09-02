import { MediaFilters } from '@/types/media';
import { create } from 'zustand';

export type ThemePref = 'light' | 'dark';

interface UIState {
  theme: ThemePref;
  filters: MediaFilters;
  setTheme: (t: ThemePref) => void;
  setFilters: (f: Partial<UIState['filters']>) => void;
}

export const useUI = create<UIState>((set) => ({
  theme: 'light',
  filters: { q: '', status: 'all', type: 'all', sort: { key: 'updatedAt', order: 'desc' } },
  setTheme: (theme) => set({ theme }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
}));
