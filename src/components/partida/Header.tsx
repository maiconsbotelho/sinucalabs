import Link from "next/link";
import { ArrowLeft, Zap, Timer } from "lucide-react";

interface Game {
  id: string;
  gameNumber: number;
  winner: { id: string; name: string };
  createdAt: string;
}

interface HeaderProps {
  gamesCount: number;
}

export default function Header({ gamesCount }: HeaderProps) {
  return (
    <header className="p-[10px] border-b border-retro-cyan/30 relative bg-gradient-to-r from-background via-retro-purple/5 to-background">
      {/* Background scanlines effect */}
      <div className="absolute inset-0 bg-scanlines opacity-30 pointer-events-none"></div>

      <div className="max-w-md mx-auto flex items-center gap-[30px] relative z-10">
        <Link
          href="/"
          className="p-[10px] rounded-lg border border-retro-cyan/30 hover:border-retro-cyan hover:bg-retro-cyan/10 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 text-retro-cyan group-hover:scale-110 transition-transform" />
        </Link>

        <div className="flex">
          <div className="flex items-center gap-[10px]">
            <div>
              <h1 className="text-xl font-display font-bold text-gradient-cyber">Pool Arena</h1>
              <div className="flex items-center gap-2 -mt-[30px]">
                <p className="font-mono text-[14px] text-retro-light/70">
                  [{gamesCount.toString().padStart(2, "0")}] JOGO{gamesCount !== 1 ? "S" : ""} DISPUTADO
                  {gamesCount !== 1 ? "S" : ""}
                </p>
              </div>
            </div>
            <Timer className="w-[62px] h-[62px] text-retro-pink animate-float" />
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-cyan to-transparent"></div>
    </header>
  );
}
