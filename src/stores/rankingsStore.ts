import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface RankingData {
  period: string;
  startDate: string;
  endDate: string;
  rankings: any[];
  totalGames: number;
  totalMatches: number;
  totalTeams: number;
}

interface RankingsState {
  rankings: Record<string, RankingData>;
  loading: boolean;
  error: string | null;
  cache: Map<string, { data: RankingData; timestamp: number }>;
}

interface RankingsActions {
  fetchRanking: (period: 'semana' | 'mes' | 'ano', mode?: '1x1' | '2x2' | 'individual') => Promise<void>;
  clearError: () => void;
  shouldRefetch: (rankingKey: string) => boolean;
}

type RankingsStore = RankingsState & RankingsActions;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos (rankings mudam menos)

export const useRankingsStore = create<RankingsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        rankings: {},
        loading: false,
        error: null,
        cache: new Map(),

        // Actions
        fetchRanking: async (period: 'semana' | 'mes' | 'ano', mode: '1x1' | '2x2' | 'individual' = '2x2') => {
          const { cache, shouldRefetch, loading } = get();
          
          const rankingKey = `${period}_${mode}`;
          
          // Verificar cache
          const cached = cache.get(rankingKey);
          if (cached && !shouldRefetch(rankingKey)) {
            set((state) => ({
              rankings: { ...state.rankings, [rankingKey]: cached.data },
            }));
            return;
          }

          if (loading) return;

          set({ loading: true, error: null });

          try {
            const response = await fetch(`/api/rankings/${period}?mode=${mode}`);
            
            if (!response.ok) {
              throw new Error(`Erro ao buscar ranking ${period} ${mode}`);
            }

            const rankingData = await response.json();
            
            // Atualizar cache
            const newCache = new Map(cache);
            newCache.set(rankingKey, { data: rankingData, timestamp: Date.now() });
            
            set((state) => ({
              rankings: { ...state.rankings, [rankingKey]: rankingData },
              cache: newCache,
              loading: false,
              error: null,
            }));
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Erro desconhecido',
            });
          }
        },

        clearError: () => set({ error: null }),

        shouldRefetch: (rankingKey: string) => {
          const { cache } = get();
          const cached = cache.get(rankingKey);
          return !cached || Date.now() - cached.timestamp > CACHE_DURATION;
        },
      }),
      {
        name: 'rankings-store',
        partialize: (state) => ({
          rankings: state.rankings,
          cache: Array.from(state.cache.entries()), // Persist Map as array
        }),
        onRehydrateStorage: () => (state) => {
          // Reconstruct Map from persisted array
          if (state) {
            if (Array.isArray(state.cache)) {
              state.cache = new Map(state.cache as any);
            } else {
              state.cache = new Map();
            }
          }
        },
      }
    ),
    { name: 'rankings-store' }
  )
);