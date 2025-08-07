import { Trophy, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="p-[10px] border-b border-retro-cyan/30">
      <div className="max-w-sm mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center gap-[10px] bg-red-500 p-[10px] rounded">
            <Trophy className="w-10 h-10 text-retro-cyan animate-pulse-glow" />
            <h1 className="text-xl font-bold text-gradient-cyber ml-[10px]">SINUCA</h1>
            <p className="text-retro-cyan font-display text-sm tracking-[0.3em]">LABS</p>
            <Zap className="w-5 h-5 text-retro-pink animate-pulse" />
          </div>
          <div className="text-retro-light/60 text-xs font-mono tracking-wider mt-1">&gt; RANKING SYSTEM v2.0</div>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-retro-cyan to-transparent mx-auto mt-1"></div>
        </div>
      </div>
    </header>
  );
}