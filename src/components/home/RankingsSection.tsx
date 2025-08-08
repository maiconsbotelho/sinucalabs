import Link from "next/link";
import { BarChart3, Target } from "lucide-react";

export default function RankingsSection() {
  const rankings = [
    {
      href: "/ranking/semana",
      title: "MELHORES DA SEMANA",
      color: "retro-cyan",
      borderColor: "retro-cyan/20",
      hoverBorder: "retro-cyan/50",
    },
    {
      href: "/ranking/mes",
      title: "MELHORES DO MÊS",
      color: "retro-pink",
      borderColor: "retro-pink/20",
      hoverBorder: "retro-pink/50",
    },
    {
      href: "/ranking/ano",
      title: "MELHORES DO ANO",
      color: "retro-purple",
      borderColor: "retro-purple/20",
      hoverBorder: "retro-purple/50",
    },
  ];

  return (
    <div className="card p-[10px] relative group mt-[32px]">
      <div className="flex items-center gap-[10px] mb-4">
        <BarChart3 className="w-6 h-6 text-retro-pink" />
        <h2 className="text-lg font-display font-bold text-retro-light">RANKINGS</h2>
      </div>

      <div className="space-y-2">
        {rankings.map((ranking) => (
          <Link
            key={ranking.href}
            href={ranking.href}
            className={`block p-[10px] rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20  hover:border-${ranking.hoverBorder} transition-all duration-300 hover:scale-[1.02] group`}
          >
            <div className="flex items-center text-[22px] justify-between">
              <div className="flex items-center gap-[10px]">
                <div className={`w-1.5 h-1.5 bg-${ranking.color} rounded-full animate-pulse`}></div>
                <span className={`font-display font-semibold text-${ranking.color} text-sm`}>{ranking.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
