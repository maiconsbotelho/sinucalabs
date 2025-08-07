import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

interface HeaderProps {
  step: "team1" | "team2" | "confirm";
}

export default function Header({ step }: HeaderProps) {
  const getStepMessage = () => {
    switch (step) {
      case "team1": return "[SYSTEM] Select Team Alpha";
      case "team2": return "[SYSTEM] Select Team Beta";
      case "confirm": return "[SYSTEM] Initialize Battle";
      default: return "";
    }
  };

  return (
    <header className="p-3 border-b border-retro-cyan/30 relative">
      <div className="max-w-sm mx-auto flex items-center gap-[30px] relative z-10">
        <Link
          href="/"
          className="p-2 rounded-lg border border-retro-cyan/30 hover:border-retro-cyan hover:bg-retro-cyan/10 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 text-retro-cyan group-hover:scale-110 transition-transform" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-display font-bold text-retro-cyan flex items-center gap-2">
            <Zap className="w-5 h-5" />
            NOVA PARTIDA
          </h1>
          <p className="text-xs font-mono text-retro-light/60 tracking-wider">
            {getStepMessage()}
          </p>
        </div>
      </div>
    </header>
  );
}