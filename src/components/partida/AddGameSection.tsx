import { Plus, Trophy, Target, Users, Zap, Award } from "lucide-react";

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
    <div className="relative rounded-xl  bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm py-[20px] overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-cyan to-transparent"></div>

      {/* Section Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-[10px] mb-3">
          <div className="w-12 h-12 rounded-full border-2 border-retro-cyan/50 bg-retro-cyan/10 flex items-center justify-center animate-float">
            <Award className="w-6 h-6 text-retro-cyan animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-gradient-cyber uppercase tracking-wider">Match Point</h3>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm">
          <p className="font-mono text-retro-light/70 uppercase tracking-wide">Selecione o time vencedor:</p>
        </div>
      </div>

      {/* Team Selection - Side by Side */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Team 1 Button */}
        <button
          onClick={() => onAddGame(match.team1Player1.id)}
          disabled={addingGame}
          className="relative group p-4 rounded-xl border-2 border-retro-cyan/30 bg-transparent hover:from-retro-cyan/15 hover:to-retro-purple/10 hover:border-retro-cyan/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="mx-auto w-14 h-14 rounded-full border-2 border-retro-cyan  flex items-center justify-between px-[16px] group-hover:border-retro-cyan group-hover:bg-retro-cyan/20 transition-all duration-300">
            <Trophy className="w-7 h-7 text-retro-cyan group-hover:scale-110 transition-transform" />
            <h2 className="font-display font-bold text-lg text-retro-cyan uppercase tracking-wider">ALPHA</h2>
          </div>

          {/* Corner accent */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-retro-cyan/30 rounded-full group-hover:bg-retro-cyan animate-pulse"></div>
        </button>

        {/* Team 2 Button */}
        <button
          onClick={() => onAddGame(match.team2Player1.id)}
          disabled={addingGame}
          className="relative group p-4 rounded-xl border-2 border-retro-pink/30 bg-transparent hover:from-retro-pink/15 hover:to-retro-purple/10 hover:border-retro-pink/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="mx-auto w-14 h-14 rounded-full border-2 border-retro-pink  flex items-center justify-between px-[16px] group-hover:border-retro-pink group-hover:bg-retro-pink/20 transition-all duration-300">
            <h2 className="font-display font-bold text-lg text-retro-pink uppercase tracking-wider">OMEGA</h2>
            <Trophy className="w-7 h-7 text-retro-pink group-hover:scale-110 transition-transform" />
          </div>

          {/* Corner accent */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-retro-pink/30 rounded-full group-hover:bg-retro-pink animate-pulse"></div>
        </button>
      </div>

      {/* Loading State */}
      {addingGame && (
        <div className="text-center p-4 rounded-lg border border-retro-yellow/30 bg-retro-yellow/5 animate-pulse">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-6 h-6 border-2 border-retro-yellow border-t-transparent rounded-full animate-spin"></div>
            <Zap className="w-5 h-5 text-retro-yellow animate-pulse" />
          </div>
          <div className="font-mono text-sm text-retro-yellow uppercase tracking-wider font-bold">
            [PROCESSING] Registrando Resultado...
          </div>
          <div className="font-mono text-xs text-retro-yellow/70 uppercase tracking-wide mt-1">
            Sistema atualizando placar
          </div>
        </div>
      )}
    </div>
  );
}
