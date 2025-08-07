"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Plus, Users } from "lucide-react";
import { useParams } from "next/navigation";

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

  const getTeamWinner = (game: Game) => {
    if (!match) return null;

    const team1PlayerIds = [match.team1Player1.id, match.team1Player2.id];
    return team1PlayerIds.includes(game.winner.id) ? "team1" : "team2";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando partida...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Partida não encontrada</p>
          <Link href="/" className="btn btn-primary mt-4">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary">Partida em Andamento</h1>
            <p className="text-sm text-muted-foreground">
              {match.games?.length || 0} jogo{(match.games?.length || 0) !== 1 ? "s" : ""} disputado
              {(match.games?.length || 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="space-y-6 mt-6">
          {/* Placar */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Dupla 1 */}
            <div className="card p-4 text-center">
              <div className="mb-2">
                <Users className="w-6 h-6 mx-auto text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Dupla 1</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>{match.team1Player1?.name || "Jogador 1"}</div>
                <div>{match.team1Player2?.name || "Jogador 2"}</div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-primary">{match.team1Wins}</div>
                <div className="text-xs text-muted-foreground">vitórias</div>
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <span className="text-primary font-bold">VS</span>
              </div>
            </div>

            {/* Dupla 2 */}
            <div className="card p-4 text-center">
              <div className="mb-2">
                <Users className="w-6 h-6 mx-auto text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Dupla 2</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>{match.team2Player1?.name || "Jogador 3"}</div>
                <div>{match.team2Player2?.name || "Jogador 4"}</div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-primary">{match.team2Wins}</div>
                <div className="text-xs text-muted-foreground">vitórias</div>
              </div>
            </div>
          </div>

          {/* Adicionar Novo Jogo */}
          <div className="card p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Registrar Resultado
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Clique na dupla vencedora do jogo:</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addGame(match.team1Player1.id)}
                disabled={addingGame}
                className="p-4 rounded-lg border border-border hover:bg-primary/10 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-medium text-sm">Dupla 1</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {match.team1Player1.name}
                    <br />
                    {match.team1Player2.name}
                  </div>
                </div>
              </button>

              <button
                onClick={() => addGame(match.team2Player1.id)}
                disabled={addingGame}
                className="p-4 rounded-lg border border-border hover:bg-primary/10 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-medium text-sm">Dupla 2</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {match.team2Player1.name}
                    <br />
                    {match.team2Player2.name}
                  </div>
                </div>
              </button>
            </div>

            {addingGame && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Registrando resultado...
                </div>
              </div>
            )}
          </div>

          {/* Histórico de Jogos */}
          {match.games && match.games.length > 0 && (
            <div className="card p-4">
              <h3 className="font-semibold mb-4">Histórico dos Jogos</h3>
              <div className="space-y-2">
                {match.games.map((game) => {
                  const teamWinner = getTeamWinner(game);
                  return (
                    <div key={game.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{game.gameNumber}</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{teamWinner === "team1" ? "Dupla 1" : "Dupla 2"}</div>
                          <div className="text-xs text-muted-foreground">Vencedor: {game.winner.name}</div>
                        </div>
                      </div>
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
