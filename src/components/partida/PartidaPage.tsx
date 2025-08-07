"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useMatchesStore, useOptimisticUpdates } from "@/stores";
import Header from "./Header";
import LoadingState from "./LoadingState";
import NotFoundState from "./NotFoundState";
import ScoreBoard from "./ScoreBoard";
import AddGameSection from "./AddGameSection";
import GameHistory from "./GameHistory";

interface Player {
  id: string;
  name: string;
}

interface Game {
  id: string;
  gameNumber: number;
  winner: Player;
  createdAt: string;
}

interface Match {
  id: string;
  team1Player1: Player;
  team1Player2: Player;
  team2Player1: Player;
  team2Player2: Player;
  team1Wins: number;
  team2Wins: number;
  games: Game[];
  isActive: boolean;
}

export default function PartidaPage() {
  const params = useParams();
  
  // Zustand stores
  const { currentMatch: match, fetchMatch, addGameToMatch, loading, error } = useMatchesStore();
  const { invalidateCache } = useOptimisticUpdates();

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      fetchMatch(params.id);
    }
  }, [params.id, fetchMatch]);

  const addGame = async (winnerId: string) => {
    try {
      if (params.id && typeof params.id === 'string') {
        await addGameToMatch(params.id, winnerId);
        
        // Invalidar cache para atualizar rankings
        await invalidateCache('game');
      }
    } catch (error) {
      console.error("Erro ao adicionar jogo:", error);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!match) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header gamesCount={match.games?.length || 0} />

      <main className="p-[10px] max-w-md mx-auto">
        <div className="space-y-6 mt-6">
          <ScoreBoard match={match} />
          <AddGameSection match={match} addingGame={loading} onAddGame={addGame} />
          <GameHistory games={match.games} match={match} />
        </div>
      </main>
    </div>
  );
}