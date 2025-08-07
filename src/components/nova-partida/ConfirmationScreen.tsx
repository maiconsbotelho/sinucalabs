import { Shield, Sword, Cpu, Play } from "lucide-react";

interface Player {
  id: string;
  name: string;
}

interface ConfirmationScreenProps {
  team1: Player[];
  team2: Player[];
  creating: boolean;
  onCreateMatch: () => void;
}

export default function ConfirmationScreen({ 
  team1, 
  team2, 
  creating, 
  onCreateMatch 
}: ConfirmationScreenProps) {
  return (
    <div className="space-y-4 mt-4">
      {/* Team 1 - Compact */}
      <div className="card p-[10px] border-retro-cyan/50">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-6 h-6 text-retro-cyan" />
          <h3 className="font-display font-bold text-lg text-retro-cyan">TEAM ALPHA</h3>
        </div>
        <div className="space-y-2">
          {team1.map((player, index) => (
            <div key={player.id} className="p-2 bg-retro-cyan/10 rounded-lg border border-retro-cyan/30">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-retro-cyan" />
                <span className="font-display font-semibold text-retro-cyan text-sm">{player.name}</span>
                <span className="font-mono text-xs text-retro-cyan/60">W_{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VS Separator - Compact */}
      <div className="text-center relative py-[10px]">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-retro-cyan via-retro-pink to-retro-purple rounded-full animate-pulse-glow">
          <span className="font-display font-bold text-lg text-white p-[10px]">VS</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-2 border-retro-purple/30 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Team 2 - Compact */}
      <div className="card p-[10px] border-retro-pink/50">
        <div className="flex items-center gap-2 mb-3">
          <Sword className="w-6 h-6 text-retro-pink" />
          <h3 className="font-display font-bold text-lg text-retro-pink">TEAM BETA</h3>
        </div>
        <div className="space-y-2">
          {team2.map((player, index) => (
            <div key={player.id} className="p-2 bg-retro-pink/10 rounded-lg border border-retro-pink/30">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-retro-pink" />
                <span className="font-display font-semibold text-retro-pink text-sm">{player.name}</span>
                <span className="font-mono text-xs text-retro-pink/60">W_{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle Info - Compact */}
      <div className="text-center mt-[32px] p-3 bg-retro-purple/10 rounded-lg border border-retro-purple/30">
        <div className="font-mono text-xs text-retro-purple/80 tracking-wider">
          [SYSTEM] Pool table ready. Awaiting authorization.
        </div>
      </div>
    </div>
  );
}