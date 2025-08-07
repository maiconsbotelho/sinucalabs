import Link from "next/link";
import { Target } from "lucide-react";
import { periodConfig } from "./types";

interface OtherRankingsProps {
  currentPeriod: string;
}

export default function OtherRankings({ currentPeriod }: OtherRankingsProps) {
  return (
    <div className="card p-4">
      <h3 className="font-display font-bold text-base text-retro-light mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-retro-cyan rounded-full animate-pulse"></div>
        OTHER RANKINGS
      </h3>

      <div className="space-y-2">
        {Object.entries(periodConfig)
          .filter(([key]) => key !== currentPeriod)
          .map(([key, config]) => {
            const IconComponent = config.icon;
            return (
              <Link
                key={key}
                href={`/ranking/${key}`}
                className={`block p-3 rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-${config.color}/20 hover:border-${config.color}/50 transition-all duration-300 hover:scale-[1.02] group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-5 h-5 text-${config.color}`} />
                    <span className={`font-display font-semibold text-${config.color} text-sm`}>
                      TOP 3 {config.name.toUpperCase()}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-${config.color}/60 group-hover:text-${config.color} transition-colors`}
                  >
                    <span className="text-xs font-mono tracking-wider">GO</span>
                    <Target className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}