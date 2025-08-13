"use client";

import { useCallback, useEffect } from "react";
import { useMatchesStore } from "@/stores/matchesStore";
import { useHistoryStore } from "@/stores/historyStore";
import { useRankingsStore } from "@/stores/rankingsStore";

/**
 * Hook para atualizações otimistas
 * Atualiza dados localmente antes da resposta da API
 */
export function useOptimisticUpdates() {
  const { fetchHistory } = useHistoryStore();
  const { fetchRanking } = useRankingsStore();
  const { fetchMatches } = useMatchesStore();

  const invalidateCache = useCallback(
    async (type: "match" | "game" | "all") => {
      switch (type) {
        case "match":
          // Nova partida criada - atualizar histórico e rankings
          await Promise.all([fetchHistory(), fetchRanking("semana"), fetchMatches()]);
          break;

        case "game":
          // Jogo adicionado - atualizar rankings em background para não travar a UI
          Promise.all([fetchRanking("semana"), fetchRanking("mes"), fetchRanking("ano")]).catch((error) => {
            console.log("Erro ao atualizar rankings em background:", error);
          });
          break;

        case "all":
          // Atualizar tudo
          await Promise.all([
            fetchHistory(),
            fetchMatches(),
            fetchRanking("semana"),
            fetchRanking("mes"),
            fetchRanking("ano"),
          ]);
          break;
      }
    },
    [fetchHistory, fetchRanking, fetchMatches]
  );

  return { invalidateCache };
}

/**
 * Hook para sincronização automática
 * Revalida dados quando a aba fica ativa novamente
 */
export function useAutoSync() {
  const { fetchHistory } = useHistoryStore();
  const { fetchRanking } = useRankingsStore();

  useEffect(() => {
    // Verificar se estamos no cliente antes de acessar document
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Usuário voltou para a aba - revalidar dados importantes
        fetchHistory();
        fetchRanking("semana");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchHistory, fetchRanking]);
}
