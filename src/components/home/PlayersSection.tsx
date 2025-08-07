import Link from "next/link";
import { Users, UserPlus } from "lucide-react";

export default function PlayersSection() {
  return (
    <div className="card p-[10px] relative group mt-[32px]">
      <div className="flex items-center gap-[10px] mb-4">
        <Users className="w-6 h-6 text-retro-cyan" />
        <h2 className="text-lg font-display font-bold text-retro-light">JOGADORES</h2>
      </div>

      <Link
        href="/jogadores"
        className="block p-[10px] rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-retro-cyan/20 hover:border-retro-cyan/50 transition-all duration-300 hover:scale-[1.02] group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <div className="w-1.5 h-1.5 bg-retro-cyan rounded-full animate-pulse"></div>
            <span className="font-display font-semibold text-retro-cyan text-sm">GERENCIAR PLAYERS</span>
          </div>
          <div className="flex items-center gap-1 text-retro-cyan/60 group-hover:text-retro-cyan transition-colors">
            <span className="text-xs font-mono">MANAGE</span>
            <UserPlus className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </div>
  );
}