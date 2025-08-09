import { Users, Trophy, Zap, Crown } from "lucide-react";

interface Player {
  id: string;
  name: string;
}

interface Match {
  team1Player1: Player;
  team1Player2?: Player | null;
  team2Player1: Player;
  team2Player2?: Player | null;
  team1Wins: number;
  team2Wins: number;
}

interface ScoreBoardProps {
  match: Match;
}

export default function ScoreBoard({ match }: ScoreBoardProps) {
  const team1IsWinning = match.team1Wins > match.team2Wins;
  const team2IsWinning = match.team2Wins > match.team1Wins;
  const isTied = match.team1Wins === match.team2Wins;

  return (
    <div className="space-y-4 mt-[30px]">
      {/* Teams Layout - One above the other */}
      <div className="space-y-4">
        {/* Team 1 */}
        <div
          className={`relative rounded-xl border-2 p-5 transition-all duration-300 backdrop-blur-sm overflow-hidden ${
            team1IsWinning
              ? "border-retro-cyan/70 bg-gradient-to-r from-retro-cyan/15 to-retro-purple/10 shadow-neon-cyan"
              : "border-retro-purple/30 bg-gradient-to-r from-card/80 to-card/60"
          }`}
        >
          {team1IsWinning && (
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-cyan to-transparent"></div>
          )}

          <div className="flex items-center gap-4">
            {/* Team Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between p-[10px]">
                <div className="flex items-center justify-between gap-[10px]">
                  {/* Team Icon */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      team1IsWinning
                        ? "border-retro-cyan bg-retro-cyan/20 animate-pulse-glow"
                        : "border-retro-purple/50 bg-retro-purple/10"
                    }`}
                  >
                    <Users className={`w-7 h-7 ${team1IsWinning ? "text-retro-cyan" : "text-retro-purple"}`} />
                  </div>
                  <h3
                    className={`font-display font-bold text-lg uppercase tracking-wider ${
                      team1IsWinning ? "text-retro-cyan" : "text-retro-light"
                    }`}
                  >
                    [TEAM ALPHA]
                  </h3>
                </div>
                <div
                  className={`text-[32px] font-display font-bold transition-all duration-300 ${
                    team1IsWinning ? "text-retro-cyan animate-pulse" : "text-retro-light"
                  }`}
                >
                  {match.team1Wins.toString().padStart(2, "0")}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className={`font-mono text-xs uppercase tracking-wide p-[10px] `}>
                  ► {match.team1Player1?.name || "PLAYER_01"}
                </div>
                {match.team1Player2?.id && (
                  <div className={`font-mono text-xs uppercase tracking-wide p-[10px] `}>
                    ► {match.team1Player2?.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team 2 */}
        <div
          className={`relative rounded-xl border-2 p-5 transition-all duration-300 backdrop-blur-sm overflow-hidden ${
            team2IsWinning
              ? "border-retro-pink/70 bg-gradient-to-r from-retro-pink/15 to-retro-purple/10 shadow-neon-pink"
              : "border-retro-purple/30 bg-gradient-to-r from-card/80 to-card/60"
          }`}
        >
          {team2IsWinning && (
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-pink to-transparent"></div>
          )}

          <div className="flex items-center gap-4">
            {/* Team Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between p-[10px]">
                <div className="flex items-center justify-between gap-[10px]">
                  {/* Team Icon */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      team2IsWinning
                        ? "border-retro-pink bg-retro-pink/20 animate-pulse-glow"
                        : "border-retro-purple/50 bg-retro-purple/10"
                    }`}
                  >
                    <Users className={`w-7 h-7 ${team2IsWinning ? "text-retro-pink" : "text-retro-purple"}`} />
                  </div>
                  <h3
                    className={`font-display font-bold text-lg uppercase tracking-wider ${
                      team2IsWinning ? "text-retro-pink" : "text-retro-light"
                    }`}
                  >
                    [TEAM OMEGA]
                  </h3>
                </div>
                <div
                  className={`text-[32px] font-display font-bold transition-all duration-300 ${
                    team2IsWinning ? "text-retro-pink animate-pulse" : "text-retro-light"
                  }`}
                >
                  {match.team2Wins.toString().padStart(2, "0")}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className={`font-mono text-xs uppercase tracking-wide p-[10px] `}>
                  ► {match.team2Player1?.name || "PLAYER_03"}
                </div>
                {match.team2Player2?.id && (
                  <div className={`font-mono text-xs uppercase tracking-wide p-[10px] `}>
                    ► {match.team2Player2?.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
