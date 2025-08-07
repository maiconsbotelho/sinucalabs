"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingGame, setAddingGame] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMatch();
    }
  }, [params.id]);

  const fetchMatch = async () => {
    try {
      const response = await fetch(`/api/matches/${params.id}`);
      const data = await response.json();
      setMatch(data);
    } catch (error) {
      console.error("Erro ao buscar partida:", error);
    } finally {
      setLoading(false);
    }
  };

  const addGame = async (winnerId: string) => {
    setAddingGame(true);
    try {
      const response = await fetch(`/api/matches/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add_game",
          winnerId,
        }),
      });

      const updatedMatch = await response.json();
      setMatch(updatedMatch);
    } catch (error) {
      console.error("Erro ao adicionar jogo:", error);
    } finally {
      setAddingGame(false);
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

      <main className="p-4 max-w-md mx-auto">
        <div className="space-y-6 mt-6">
          <ScoreBoard match={match} />
          <AddGameSection match={match} addingGame={addingGame} onAddGame={addGame} />
          <GameHistory games={match.games} match={match} />
        </div>
      </main>
    </div>
  );
}