import { Trophy, Clock, User, Target } from "lucide-react";

interface Player {
  id: string;
  name: string;
}

interface Game {
  id: string;
  gameNumber: number;
  winner: Player;
  createdAt: string;
}

interface Match {
  team1Player1: Player;
  team1Player2?: Player | null;
  team2Player1: Player;
  team2Player2?: Player | null;
}

interface GameHistoryProps {
  games: Game[];
  match: Match;
}

export default function GameHistory({ games, match }: GameHistoryProps) {
  const getTeamWinner = (game: Game) => {
    const team1PlayerIds = [match.team1Player1?.id, match.team1Player2?.id].filter(Boolean) as string[];
    return team1PlayerIds.includes(game.winner.id) ? "team1" : "team2";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (!games || games.length === 0) {
    return (
      <div className="relative rounded-xl border-2 border-retro-purple/30 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm p-6 text-center overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-purple to-transparent"></div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-retro-purple/50 bg-retro-purple/10 flex items-center justify-center">
            <Target className="w-8 h-8 text-retro-purple animate-float" />
          </div>

          <div>
            <h3 className="font-display font-bold text-lg text-retro-purple uppercase tracking-wider mb-2">
              Histórico dos Jogos
            </h3>
            <div className="font-mono text-sm text-retro-light/60 uppercase tracking-wide">
              [STATUS] Nenhum jogo disputado ainda
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative  backdrop-blur-sm p-4 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-purple to-transparent"></div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-[10px]">
          <div className="w-10 h-10 rounded-full border-2 border-retro-purple/50 bg-retro-purple/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-retro-purple animate-pulse" />
          </div>

          <h3 className="font-display font-bold text-lg text-gradient-cyber uppercase tracking-wider">
            Histórico dos Jogos
          </h3>
        </div>
        <div className="font-mono text-xs text-retro-light/60 uppercase tracking-wide">
          [{games.length.toString().padStart(2, "0")}] Resultados registrados
        </div>
      </div>

      {/* Games List */}
      <div className="space-y-3">
        {games.map((game, index) => {
          const teamWinner = getTeamWinner(game);
          const isTeam1Winner = teamWinner === "team1";
          const isLatest = index === games.length - 1;

          return (
            <div
              key={game.id}
              className={`relative rounded-lg border-2 p-4 backdrop-blur-sm transition-all duration-300 overflow-hidden ${
                isLatest
                  ? "border-retro-yellow/50 bg-gradient-to-r from-retro-yellow/10 to-retro-orange/5 shadow-neon-yellow"
                  : isTeam1Winner
                  ? "border-retro-cyan/30 bg-gradient-to-r from-retro-cyan/5 to-retro-purple/5"
                  : "border-retro-pink/30 bg-gradient-to-r from-retro-pink/5 to-retro-purple/5"
              }`}
            >
              {isLatest && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-yellow to-transparent"></div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[25px] p-[10px]">
                  {/* Game Number Badge */}
                  <div
                    className={`w-12 h-12 p-[8px] rounded-full border-2 flex items-center justify-center font-display font-bold transition-all duration-300 ${
                      isLatest
                        ? "border-retro-yellow bg-retro-yellow/20 text-retro-yellow animate-pulse-glow"
                        : isTeam1Winner
                        ? "border-retro-cyan/50 bg-retro-cyan/10 text-retro-cyan"
                        : "border-retro-pink/50 bg-retro-pink/10 text-retro-pink"
                    }`}
                  >
                    {game.gameNumber.toString().padStart(2, "0")}
                  </div>

                  {/* Game Info */}
                  <div className="flex items-center justify-between gap-[10px]">
                    <div className="flex items-center gap-[10px]">
                      <Clock className="w-3 h-3 text-retro-light/50" />
                      <div className="font-mono text-xs text-retro-light/50 uppercase tracking-wide">
                        {formatTime(game.createdAt)}
                      </div>
                    </div>
                    <div
                      className={`font-display font-bold text-sm uppercase tracking-wider ${
                        isLatest ? "text-retro-yellow" : isTeam1Winner ? "text-retro-cyan" : "text-retro-pink"
                      }`}
                    >
                      {isTeam1Winner ? "[TEAM ALPHA]" : "[TEAM OMEGA]"}
                    </div>
                  </div>
                </div>

                {/* Trophy Icon */}
                <div className={`transition-all px-[10px] duration-300 ${isLatest ? "animate-bounce" : ""}`}>
                  <Trophy
                    className={`w-6 h-6 ${
                      isLatest ? "text-retro-yellow" : isTeam1Winner ? "text-retro-cyan" : "text-retro-pink"
                    }`}
                  />
                </div>
              </div>

              {/* Latest game indicator */}
              {isLatest && (
                <div className="absolute top-2 right-2">
                  <div className="px-2 py-1 rounded bg-retro-yellow/20 border border-retro-yellow/50">
                    <span className="font-mono text-xs text-retro-yellow font-bold uppercase tracking-wider">NEW</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
