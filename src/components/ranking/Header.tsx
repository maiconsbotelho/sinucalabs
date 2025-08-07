import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { periodConfig } from "./types";

interface HeaderProps {
  period: string;
  totalGames: number;
}

export default function Header({ period, totalGames }: HeaderProps) {
  const config = periodConfig[period as keyof typeof periodConfig] || periodConfig.semana;
  const IconComponent = config.icon;

  return (
    <header className="p-[10px] border-b border-retro-cyan/30 relative">
      <div className="max-w-sm mx-auto flex items-center gap-[10px] relative z-10">
        <Link
          href="/"
          className="p-[10px] rounded-lg border border-retro-cyan/30 hover:border-retro-cyan hover:bg-retro-cyan/10 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 text-retro-cyan group-hover:scale-110 transition-transform" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-[10px]">
            <IconComponent className={`w-6 h-6 text-${config.color} animate-float`} />
            <div>
              <h1 className={`text-lg font-display font-bold text-${config.color}`}>
                TOP 3 {config.name.toUpperCase()}
              </h1>
              <div className="font-mono text-xs text-retro-light/60">
                {totalGames} battle{totalGames !== 1 ? "s" : ""} recorded
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}