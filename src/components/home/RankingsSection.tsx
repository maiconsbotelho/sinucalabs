import Link from "next/link";
import { BarChart3, Target } from "lucide-react";

export default function RankingsSection() {
  const rankings = [
    {
      href: "/ranking/semana",
      title: "TOP 3 SEMANA",
      color: "retro-cyan",
      borderColor: "retro-cyan/20",
      hoverBorder: "retro-cyan/50"
    },
    {
      href: "/ranking/mes",
      title: "TOP 3 MÊS",
      color: "retro-pink",
      borderColor: "retro-pink/20",
      hoverBorder: "retro-pink/50"
    },
    {
      href: "/ranking/ano",
      title: "TOP 3 ANO",
      color: "retro-purple",
      borderColor: "retro-purple/20",
      hoverBorder: "retro-purple/50"
    }
  ];

  return (
    <div className="card p-[16px] relative group mt-[32px]">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-6 h-6 text-retro-pink" />
        <h2 className="text-lg font-display font-bold text-retro-light">RANKINGS</h2>
      </div>

      <div className="space-y-2">
        {rankings.map((ranking) => (
          <Link
            key={ranking.href}
            href={ranking.href}
            className={`block p-3 rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-${ranking.borderColor} hover:border-${ranking.hoverBorder} transition-all duration-300 hover:scale-[1.02] group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 bg-${ranking.color} rounded-full animate-pulse`}></div>
                <span className={`font-display font-semibold text-${ranking.color} text-sm`}>{ranking.title}</span>
              </div>
              <div className={`flex items-center gap-1 text-${ranking.color}/60 group-hover:text-${ranking.color} transition-colors`}>
                <span className="text-xs font-mono">ACCESS</span>
                <Target className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}