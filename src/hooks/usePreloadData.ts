'use client';

import { useEffect } from 'react';
import { usePlayersStore } from '@/stores/playersStore';
import { useRankingsStore } from '@/stores/rankingsStore';
import { useHistoryStore } from '@/stores/historyStore';

/**
 * Hook para pré-carregar dados essenciais da aplicação
 * Use no layout principal ou páginas que precisam de dados globais
 */
export function usePreloadData() {
  const fetchPlayers = usePlayersStore((state) => state.fetchPlayers);
  const fetchHistory = useHistoryStore((state) => state.fetchHistory);
  const fetchWeeklyRanking = useRankingsStore((state) => state.fetchRanking);

  useEffect(() => {
    // Pré-carregar jogadores (sempre necessários)
    fetchPlayers();

    // Pré-carregar dados mais usados
    fetchHistory();
    fetchWeeklyRanking('semana'); // Ranking mais consultado
  }, [fetchPlayers, fetchHistory, fetchWeeklyRanking]);
}

/**
 * Hook para pré-carregar dados específicos de uma página
 */
export function usePreloadPageData(page: 'home' | 'ranking' | 'history' | 'nova-partida') {
  const fetchPlayers = usePlayersStore((state) => state.fetchPlayers);
  const fetchHistory = useHistoryStore((state) => state.fetchHistory);
  const fetchRanking = useRankingsStore((state) => state.fetchRanking);

  useEffect(() => {
    switch (page) {
      case 'home':
        fetchPlayers();
        fetchHistory(); // Para exibir últimas partidas
        break;
      
      case 'ranking':
        fetchRanking('semana');
        fetchRanking('mes');
        fetchRanking('ano');
        break;
      
      case 'history':
        fetchHistory();
        break;
      
      case 'nova-partida':
        fetchPlayers(); // Essencial para seleção de jogadores
        break;
    }
  }, [page, fetchPlayers, fetchHistory, fetchRanking]);
}