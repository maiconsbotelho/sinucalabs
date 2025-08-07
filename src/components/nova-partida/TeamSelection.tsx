import { Shield, Sword } from "lucide-react";

interface Player {
  id: string;
  name: string;
}

interface TeamSelectionProps {
  step: "team1" | "team2";
  team1: Player[];
  team2: Player[];
}

export default function TeamSelection({ step, team1, team2 }: TeamSelectionProps) {
  return (
    <div className="card-glow p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        {step === "team1" ? (
          <>
            <Shield className="w-6 h-6 text-retro-cyan" />
            <div>
              <h2 className="font-display font-bold text-lg text-retro-cyan">TEAM ALPHA</h2>
              <div className="font-mono text-xs text-retro-cyan/60">Select 2 warriors [{team1.length}/2]</div>
            </div>
          </>
        ) : (
          <>
            <Sword className="w-6 h-6 text-retro-pink" />
            <div>
              <h2 className="font-display font-bold text-lg text-retro-pink">TEAM BETA</h2>
              <div className="font-mono text-xs text-retro-pink/60">Select 2 warriors [{team2.length}/2]</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}