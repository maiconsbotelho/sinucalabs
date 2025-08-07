import { Plus, Trophy } from "lucide-react";

interface Player {
  id: string;
  name: string;
}

interface Match {
  team1Player1: Player;
  team1Player2: Player;
  team2Player1: Player;
  team2Player2: Player;
}

interface AddGameSectionProps {
  match: Match;
  addingGame: boolean;
  onAddGame: (winnerId: string) => void;
}

export default function AddGameSection({ match, addingGame, onAddGame }: AddGameSectionProps) {
  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Registrar Resultado
      </h3>
      <p className="text-sm text-muted-foreground mb-4">Clique na dupla vencedora do jogo:</p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onAddGame(match.team1Player1.id)}
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
          onClick={() => onAddGame(match.team2Player1.id)}
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
  );
}