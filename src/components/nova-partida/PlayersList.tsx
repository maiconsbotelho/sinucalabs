import { Check } from "lucide-react";

interface Player {
  id: string;
  name: string;
}

interface PlayersListProps {
  players: Player[];
  step: "team1" | "team2";
  team1: Player[];
  team2: Player[];
  onPlayerSelect: (player: Player) => void;
}

export default function PlayersList({ 
  players, 
  step, 
  team1, 
  team2, 
  onPlayerSelect 
}: PlayersListProps) {
  const isPlayerSelected = (player: Player) => {
    if (step === "team1") {
      return !!team1.find((p) => p.id === player.id);
    } else {
      return !!team2.find((p) => p.id === player.id);
    }
  };

  const isPlayerDisabled = (player: Player) => {
    if (step === "team2") {
      return !!team1.find((p) => p.id === player.id);
    }
    return false;
  };

  return (
    <div className="space-y-2">
      {players.map((player) => {
        const selected = isPlayerSelected(player);
        const disabled = isPlayerDisabled(player);

        return (
          <button
            key={player.id}
            onClick={() => !disabled && onPlayerSelect(player)}
            disabled={disabled}
            className={`w-full p-[10px] rounded-lg border-2 transition-all duration-300 relative group ${
              disabled
                ? "bg-muted/20 border-muted/30 text-muted-foreground cursor-not-allowed opacity-50"
                : selected
                ? step === "team1"
                  ? "bg-retro-cyan/10 border-retro-cyan text-retro-cyan shadow-retro"
                  : "bg-retro-pink/10 border-retro-pink text-retro-pink shadow-neon-pink"
                : "bg-card/50 border-retro-purple/30 hover:border-retro-purple hover:bg-retro-purple/10 hover:scale-[1.02]"
            }`}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-[10px]">
                <div
                  className={`w-2 h-2 rounded-full ${
                    selected ? (step === "team1" ? "bg-retro-cyan" : "bg-retro-pink") : "bg-retro-purple/50"
                  } ${selected ? "animate-pulse" : ""}`}
                ></div>
                <span className="font-display font-semibold text-sm">{player.name}</span>
              </div>
              {selected && <Check className="w-5 h-5" />}
              {disabled && <div className="font-mono text-xs text-muted-foreground">TEAM_ALPHA</div>}
            </div>

            {selected && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}