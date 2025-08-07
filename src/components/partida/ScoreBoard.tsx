import { Users } from "lucide-react";

interface Player {
  id: string;
  name: string;
}

interface Match {
  team1Player1: Player;
  team1Player2: Player;
  team2Player1: Player;
  team2Player2: Player;
  team1Wins: number;
  team2Wins: number;
}

interface ScoreBoardProps {
  match: Match;
}

export default function ScoreBoard({ match }: ScoreBoardProps) {
  return (
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
  );
}