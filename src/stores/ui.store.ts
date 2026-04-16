import { MediaFilters } from '@/features/media/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePref = 'light' | 'dark';

interface UIState {
  theme: ThemePref;
  filters: MediaFilters;
  setTheme: (t: ThemePref) => void;
  setFilters: (f: Partial<UIState['filters']>) => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      filters: { q: '', status: 'all', type: 'all', sort: { key: 'updatedAt', order: 'desc' } },
      setTheme: (theme) => set({ theme }),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
    }),
    {
      name: 'media-tracker-ui',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
