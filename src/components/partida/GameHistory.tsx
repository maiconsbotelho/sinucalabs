import { Trophy } from "lucide-react";

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
  team1Player1: Player;
  team1Player2: Player;
  team2Player1: Player;
  team2Player2: Player;
}

interface GameHistoryProps {
  games: Game[];
  match: Match;
}

export default function GameHistory({ games, match }: GameHistoryProps) {
  const getTeamWinner = (game: Game) => {
    const team1PlayerIds = [match.team1Player1.id, match.team1Player2.id];
    return team1PlayerIds.includes(game.winner.id) ? "team1" : "team2";
  };

  if (!games || games.length === 0) {
    return null;
  }

  return (
    <div className="card p-[10px]">
      <h3 className="font-semibold mb-4">Histórico dos Jogos</h3>
      <div className="space-y-2">
        {games.map((game) => {
          const teamWinner = getTeamWinner(game);
          return (
            <div key={game.id} className="flex items-center justify-between p-[10px] bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-[10px]">
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
  );
}