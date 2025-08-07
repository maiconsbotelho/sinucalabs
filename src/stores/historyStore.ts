import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface HistoryState {
  matches: any[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
}

interface HistoryActions {
  fetchHistory: () => Promise<void>;
  clearError: () => void;
  shouldRefetch: () => boolean;
}

type HistoryStore = HistoryState & HistoryActions;

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutos

export const useHistoryStore = create<HistoryStore>()(
  devtools(
    (set, get) => ({
      // State
      matches: [],
      loading: false,
      error: null,
      lastFetch: 0,

      // Actions
      fetchHistory: async () => {
        const { shouldRefetch, loading } = get();
        
        if (loading || !shouldRefetch()) return;

        set({ loading: true, error: null });

        try {
          const response = await fetch('/api/historico');
          
          if (!response.ok) {
            throw new Error('Erro ao buscar histórico');
          }

          const matches = await response.json();
          
          set({
            matches,
            loading: false,
            lastFetch: Date.now(),
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
          });
        }
      },

      clearError: () => set({ error: null }),

      shouldRefetch: () => {
        const { matches, lastFetch } = get();
        return matches.length === 0 || Date.now() - lastFetch > CACHE_DURATION;
      },
    }),
    { name: 'history-store' }
  )
);