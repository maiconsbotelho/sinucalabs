import { Crown, Medal, Award, Star, Target } from "lucide-react";
import { TeamStats, periodConfig } from "./types";

interface RankingListProps {
  rankings: TeamStats[];
  period: string;
}

export default function RankingList({ rankings, period }: RankingListProps) {
  const config = periodConfig[period as keyof typeof periodConfig] || periodConfig.semana;

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-400 animate-pulse-glow" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-300 animate-pulse" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600 animate-pulse" />;
      default:
        return <Star className="w-6 h-6 text-retro-purple/60" />;
    }
  };

  const getRankStyle = (position: number) => {
    switch (position) {
      case 1:
        return "rank-item rank-1 border-yellow-400/50 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10";
      case 2:
        return "rank-item rank-2 border-gray-300/50 bg-gradient-to-r from-gray-300/10 to-gray-500/10";
      case 3:
        return "rank-item rank-3 border-amber-600/50 bg-gradient-to-r from-amber-600/10 to-amber-800/10";
      default:
        return "rank-item border-retro-purple/30";
    }
  };

  const getPositionBadge = (position: number) => {
    const baseClass =
      "w-10 h-10 rounded-full border-2 flex items-center justify-center font-display text-base font-bold";
    switch (position) {
      case 1:
        return `${baseClass} border-yellow-400 bg-yellow-400/20 text-yellow-400 animate-pulse-glow`;
      case 2:
        return `${baseClass} border-gray-300 bg-gray-300/20 text-gray-300`;
      case 3:
        return `${baseClass} border-amber-600 bg-amber-600/20 text-amber-600`;
      default:
        return `${baseClass} border-retro-purple bg-retro-purple/20 text-retro-purple`;
    }
  };

  return (
    <div className="space-y-3">
      {rankings.map((stats, index) => {
        const position = index + 1;
        return (
          <div
            key={`${stats.team.player1.id}-${stats.team.player2.id}`}
            className={`${getRankStyle(position)} relative group`}
          >
            <div className="flex items-center gap-[10px]">
              {/* Position Badge - Compact */}
              <div className="flex items-center gap-[10px]">
                <div className={getPositionBadge(position)}>{position}</div>
                {getRankIcon(position)}
              </div>

              {/* Team Info - Mobile Layout */}
              <div className="flex-1">
                <div className="flex flex-col items-center  mb-1">
                  <h3 className="font-display font-bold text-sm text-retro-light truncate max-w-[150px]">
                    {stats.team.player1.name}
                  </h3>

                  <h3 className="font-display font-bold text-sm text-retro-light truncate max-w-[150px]">
                    {stats.team.player2.name}
                  </h3>
                </div>
                <div className="flex items-center gap-[10px] font-mono text-xs text-retro-light/60 mt-1">
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-retro-green rounded-full"></div>
                    {stats.wins}W
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-retro-pink rounded-full"></div>
                    {stats.losses}L
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {stats.gamesPlayed}
                  </span>
                </div>
              </div>

              {/* Win Rate - Compact */}
              <div className="text-right">
                <div className={`text-lg font-display font-bold text-${config.color}`}>{stats.winRate.toFixed(1)}%</div>
                <div className="font-mono text-xs text-retro-light/60 tracking-wider">WIN</div>
              </div>
            </div>

            {/* Progress Bar - Thinner */}
            <div className="mt-3">
              <div className="h-1 bg-retro-dark rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
                  style={{ width: `${stats.winRate}%` }}
                />
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
          </div>
        );
      })}
    </div>
  );
}
