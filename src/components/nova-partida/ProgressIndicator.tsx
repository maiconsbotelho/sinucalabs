import { Shield, Sword } from "lucide-react";

interface ProgressIndicatorProps {
  step: "team1" | "team2" | "confirm";
}

export default function ProgressIndicator({ step }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-[10px] mb-6">
      <div className="flex-1 flex items-center gap-[10px]">
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-display text-xs font-bold transition-all duration-300 ${
            step === "team1"
              ? "border-retro-cyan bg-retro-cyan/20 text-retro-cyan animate-pulse-glow"
              : "border-retro-cyan/50 bg-retro-cyan/10 text-retro-cyan"
          }`}
        >
          <Shield className="w-4 h-4" />
        </div>
        <div className="flex-1 h-1 bg-gradient-to-r from-retro-cyan/30 to-retro-pink/30 rounded"></div>
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-display text-xs font-bold transition-all duration-300 ${
            step === "team2"
              ? "border-retro-pink bg-retro-pink/20 text-retro-pink animate-pulse-glow"
              : step !== "team1"
              ? "border-retro-pink/50 bg-retro-pink/10 text-retro-pink"
              : "border-secondary bg-secondary/20 text-secondary"
          }`}
        >
          <Sword className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}