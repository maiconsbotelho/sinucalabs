"use client";

import { useEffect, useState } from "react";
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
  const [isAddingGame, setIsAddingGame] = useState(false);

  // Zustand stores
  const { currentMatch: match, fetchMatch, addGameToMatch, loading, error } = useMatchesStore();
  const { invalidateCache } = useOptimisticUpdates();

  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      fetchMatch(params.id);
    }
  }, [params.id, fetchMatch]);

  const addGame = async (winnerId: string) => {
    if (isAddingGame) return; // Prevenir múltiplos cliques
    
    // Loading bem curto apenas para feedback visual
    setIsAddingGame(true);
    setTimeout(() => setIsAddingGame(false), 500); // Loading de apenas 500ms
    
    try {
      if (params.id && typeof params.id === "string") {
        // Adicionar o jogo (já tem update otimista)
        await addGameToMatch(params.id, winnerId);

        // Invalidar cache em background sem bloquear a UI
        invalidateCache("game");
      }
    } catch (error) {
      console.error("Erro ao adicionar jogo:", error);
      setIsAddingGame(false); // Para o loading em caso de erro
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!match) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-retro-purple/5 to-background relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-retro-grid bg-retro-grid opacity-5 pointer-events-none"></div>

      {/* Background scanlines */}
      <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none"></div>

      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-retro-cyan/10 rounded-full animate-float opacity-30"></div>
      <div
        className="absolute top-40 right-10 w-20 h-20 border border-retro-pink/10 rounded-full animate-float opacity-20"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-40 left-16 w-24 h-24 border border-retro-purple/10 rounded-full animate-float opacity-25"
        style={{ animationDelay: "2s" }}
      ></div>

      <Header gamesCount={match.games?.length || 0} />

      <main className="relative z-10 p-[10px] max-w-md mx-auto">
        <div className="space-y-6 mt-6">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <AddGameSection match={match} addingGame={isAddingGame} onAddGame={addGame} />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <ScoreBoard match={match} />
          </div>
          <div className="animate-slide-up mt-[30px]" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <GameHistory games={match.games} match={match} />
          </div>
        </div>
      </main>
    </div>
  );
}
