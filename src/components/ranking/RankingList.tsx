import { Crown, Medal, Award, Star, Target } from "lucide-react";
import { TeamStats, PlayerStats, RankingStats, periodConfig } from "./types";

interface RankingListProps {
  rankings: RankingStats[];
  period: string;
}

export default function RankingList({ rankings, period }: RankingListProps) {
  const config = periodConfig[period as keyof typeof periodConfig] || periodConfig.semana;

  // Type guard functions
  const isTeamStats = (stats: RankingStats): stats is TeamStats => {
    return 'team' in stats;
  };

  const isPlayerStats = (stats: RankingStats): stats is PlayerStats => {
    return 'player' in stats;
  };

  const getStatsKey = (stats: RankingStats): string => {
    if (isTeamStats(stats)) {
      return `${stats.team.player1.id}-${stats.team.player2.id}`;
    } else {
      return stats.player.id;
    }
  };

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
    <div className="flex flex-col gap-[10px]">
      {rankings.map((stats, index) => {
        const position = index + 1;
        return (
          <div
            key={getStatsKey(stats)}
            className={`${getRankStyle(position)} relative group`}
          >
            {/* Main Content Row */}
            <div className="flex items-center gap-[20px]">
              {/* Left Side - Position and Icon */}
              <div className="flex flex-col items-center gap-[10px]">
                <div className={`px-[6px] ${getPositionBadge(position)}`}>{position}</div>
                {getRankIcon(position)}
              </div>

              {/* Center - Player/Team Names */}
              <div className="flex-1 min-w-0">
                {isTeamStats(stats) ? (
                  <div className="space-y-1">
                    <div className="font-display font-bold text-sm text-retro-light truncate">
                      {stats.team.player1.name}
                    </div>
                    <div className="font-display font-bold text-sm text-retro-light/80 truncate">
                      {stats.team.player2.name}
                    </div>
                  </div>
                ) : (
                  <div className="font-display font-bold text-sm text-retro-light truncate">
                    {stats.player.name}
                  </div>
                )}
              </div>

              {/* Right Side - Win Rate */}
              <div className="text-center min-w-[60px]">
                <div className={`text-xl font-display font-bold text-${config.color} mb-1`}>
                  {stats.winRate.toFixed(1)}%
                </div>
                <div className="font-mono text-xs text-retro-light/60 tracking-wider uppercase">WIN RATE</div>
              </div>
            </div>

            {/* Bottom Row - Stats */}
            <div className="mt-3 flex items-center justify-between">
              {/* Stats Row */}
              <div className="flex items-center justify-center mx-auto mt-[10px] gap-[10px] font-mono text-xs text-retro-light/60">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-retro-green rounded-full"></div>
                  <span className="font-bold text-retro-green">{stats.wins}</span>
                  <span className="uppercase ml-[5px]">Wins</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-retro-pink rounded-full"></div>
                  <span className="font-bold text-retro-pink">{stats.losses}</span>
                  <span className="uppercase ml-[5px]">Losses</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-retro-cyan" />
                  <span className="font-bold text-retro-cyan">{stats.gamesPlayed}</span>
                  <span className="uppercase ml-[5px]"> Games</span>
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-1.5 bg-retro-dark rounded-full overflow-hidden">
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
