import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Player } from "@/core";

interface PlayersState {
  players: Player[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
}

interface PlayersActions {
  fetchPlayers: () => Promise<void>;
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  clearError: () => void;
  shouldRefetch: () => boolean;
}

type PlayersStore = PlayersState & PlayersActions;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const usePlayersStore = create<PlayersStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        players: [],
        loading: false,
        error: null,
        lastFetch: 0,

        // Actions
        fetchPlayers: async () => {
          const { shouldRefetch, loading } = get();

          // Evitar múltiplas requisições simultâneas
          if (loading || !shouldRefetch()) return;

          set({ loading: true, error: null });

          try {
            const response = await fetch("/api/players");

            if (!response.ok) {
              throw new Error("Erro ao buscar jogadores");
            }

            const players = await response.json();

            set({
              players,
              loading: false,
              lastFetch: Date.now(),
              error: null,
            });
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : "Erro desconhecido",
            });
          }
        },

        addPlayer: (player) => {
          set((state) => ({
            players: [...state.players, player],
          }));
        },

        updatePlayer: (player) => {
          set((state) => ({
            players: state.players.map((p) => (p.id === player.id ? { ...p, name: player.name } : p)),
          }));
        },

        clearError: () => set({ error: null }),

        shouldRefetch: () => {
          const { players, lastFetch } = get();
          return players.length === 0 || Date.now() - lastFetch > CACHE_DURATION;
        },
      }),
      {
        name: "players-store",
        partialize: (state) => ({
          players: state.players,
          lastFetch: state.lastFetch,
        }),
      }
    ),
    { name: "players-store" }
  )
);
