import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Match, EnrichedMatch } from "@/core";

interface MatchesState {
  matches: any[];
  currentMatch: any | null;
  loading: boolean;
  error: string | null;
  cache: Map<string, { data: any; timestamp: number }>;
}

interface MatchesActions {
  fetchMatches: () => Promise<void>;
  fetchMatch: (id: string) => Promise<void>;
  createMatch: (matchData: any) => Promise<string>;
  addGameToMatch: (matchId: string, winnerId: string) => Promise<void>;
  clearError: () => void;
  clearCurrentMatch: () => void;
}

type MatchesStore = MatchesState & MatchesActions;

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

export const useMatchesStore = create<MatchesStore>()(
  devtools(
    (set, get) => ({
      // State
      matches: [],
      currentMatch: null,
      loading: false,
      error: null,
      cache: new Map(),

      // Actions
      fetchMatches: async () => {
        const { loading } = get();
        if (loading) return;

        set({ loading: true, error: null });

        try {
          const response = await fetch("/api/matches");

          if (!response.ok) {
            throw new Error("Erro ao buscar partidas");
          }

          const matches = await response.json();

          set({
            matches,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          });
        }
      },

      fetchMatch: async (id: string) => {
        const { cache, loading } = get();

        // Verificar cache
        const cached = cache.get(id);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          set({ currentMatch: cached.data });
          return;
        }

        if (loading) return;

        set({ loading: true, error: null });

        try {
          const response = await fetch(`/api/matches/${id}`);

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Partida não encontrada");
            }
            throw new Error("Erro ao buscar partida");
          }

          const match = await response.json();

          // Atualizar cache
          const newCache = new Map(cache);
          newCache.set(id, { data: match, timestamp: Date.now() });

          set({
            currentMatch: match,
            cache: newCache,
            loading: false,
            error: null,
          });
        } catch (error) {
          set({
            loading: false,
            currentMatch: null,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          });
        }
      },

      createMatch: async (matchData: any): Promise<string> => {
        set({ loading: true, error: null });

        try {
          const response = await fetch("/api/matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(matchData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao criar partida");
          }

          const match = await response.json();

          // Atualizar lista de partidas
          set((state) => ({
            matches: [match, ...state.matches],
            loading: false,
            error: null,
          }));

          return match.id;
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          });
          throw error;
        }
      },

      addGameToMatch: async (matchId: string, winnerId: string) => {
        const { currentMatch, cache } = get();

        // Update otimista imediato
        if (currentMatch && currentMatch.id === matchId) {
          // Determinar qual team ganhou
          const isTeam1Winner =
            currentMatch.team1Player1.id === winnerId ||
            (currentMatch.team1Player2 && currentMatch.team1Player2.id === winnerId);

          const optimisticMatch = {
            ...currentMatch,
            team1Wins: isTeam1Winner ? currentMatch.team1Wins + 1 : currentMatch.team1Wins,
            team2Wins: isTeam1Winner ? currentMatch.team2Wins : currentMatch.team2Wins + 1,
            games: [
              ...currentMatch.games,
              {
                id: `temp-${Date.now()}`,
                gameNumber: currentMatch.games.length + 1,
                winner: isTeam1Winner
                  ? winnerId === currentMatch.team1Player1.id
                    ? currentMatch.team1Player1
                    : currentMatch.team1Player2
                  : winnerId === currentMatch.team2Player1.id
                  ? currentMatch.team2Player1
                  : currentMatch.team2Player2,
                createdAt: new Date().toISOString(),
              },
            ],
          };

          // Update imediato na UI
          set({ currentMatch: optimisticMatch, loading: true });
        }

        try {
          const response = await fetch(`/api/matches/${matchId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "add_game",
              winnerId,
            }),
          });

          if (!response.ok) {
            // Reverter o update otimista em caso de erro
            if (currentMatch && currentMatch.id === matchId) {
              set({ currentMatch });
            }
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao adicionar jogo");
          }

          const updatedMatch = await response.json();

          // Atualizar com dados reais do servidor
          const newCache = new Map(cache);
          newCache.set(matchId, { data: updatedMatch, timestamp: Date.now() });

          set({
            currentMatch: updatedMatch,
            cache: newCache,
            loading: false,
            error: null,
          });
        } catch (error) {
          // Reverter para o estado original em caso de erro
          if (currentMatch && currentMatch.id === matchId) {
            set({ currentMatch });
          }
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Erro desconhecido",
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      clearCurrentMatch: () => set({ currentMatch: null }),
    }),
    { name: "matches-store" }
  )
);
