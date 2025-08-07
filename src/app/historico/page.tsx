"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Trophy, Users, Calendar, Database, Zap, Shield, Sword, Target } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useHistoryStore, usePreloadPageData } from "@/stores";

interface Player {
  id: string;
  name: string;
}

interface Game {
  id: string;
  winner: Player;
  createdAt: string;
}

interface Match {
  id: string;
  team1: {
    player1: Player;
    player2: Player;
    score: number;
  };
  team2: {
    player1: Player;
    player2: Player;
    score: number;
  };
  isFinished: boolean;
  createdAt: string;
  winner: "team1" | "team2" | null;
}

export default function HistoricoPage() {
  // Zustand store
  const { matches, loading, error } = useHistoryStore();
  
  // Pré-carregamento
  usePreloadPageData('history');

  const getMatchStatus = (match: Match) => {
    if (match.isFinished) {
      return {
        text: "COMPLETED",
        color: "text-retro-green",
        icon: <Trophy className="w-4 h-4 animate-pulse" />,
      };
    } else {
      return {
        text: "IN_PROGRESS",
        color: "text-retro-yellow",
        icon: <Zap className="w-4 h-4 animate-pulse" />,
      };
    }
  };

  const getWinnerTeam = (match: Match) => {
    if (!match.winner) return null;

    if (match.winner === "team1") {
      return {
        players: [match.team1.player1, match.team1.player2],
        score: match.team1.score,
      };
    } else {
      return {
        players: [match.team2.player1, match.team2.player2],
        score: match.team2.score,
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-retro-cyan border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="font-display text-retro-cyan text-lg tracking-wider">LOADING DATABASE...</div>
          <div className="font-mono text-retro-cyan/60 text-sm mt-2">[Accessing match history...]</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Header - Mobile Optimized */}
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
              <Database className="w-6 h-6 text-retro-cyan animate-pulse" />
              <div>
                <h1 className="text-lg font-display font-bold text-retro-cyan">MATCH DATABASE</h1>
                <div className="font-mono text-xs text-retro-light/60">
                  {matches.length} record{matches.length !== 1 ? "s" : ""} found
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-[10px] max-w-sm mx-auto relative z-10">
        <div className="space-y-3 mt-4">
          {matches.length === 0 ? (
            <div className="card-glow p-[10px] text-center">
              <Database className="w-12 h-12 mx-auto text-retro-purple/60 mb-4 animate-float" />
              <h3 className="font-display font-bold text-lg text-retro-light mb-2">DATABASE EMPTY</h3>
              <p className="font-mono text-retro-light/60 text-xs mb-4 tracking-wide">
                [SYSTEM] No battle records found in database
              </p>
              <Link href="/nova-partida" className="btn btn-primary text-sm py-2">
                <Zap className="w-4 h-4 mr-2" />
                INITIATE FIRST BATTLE
              </Link>
            </div>
          ) : (
            matches.map((match, index) => {
              const status = getMatchStatus(match);
              const winner = getWinnerTeam(match);

              return (
                <Link
                  key={match.id}
                  href={`/partida/${match.id}`}
                  className="block card hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="p-[10px] relative z-10">
                    {/* Match Header - Compact */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-retro-cyan rounded-full animate-pulse"></div>
                        <div className={`flex items-center gap-1 text-xs font-mono ${status.color}`}>
                          {status.icon}
                          {status.text}
                        </div>
                      </div>
                      <div className="font-mono text-xs text-retro-cyan/60 tracking-wider">
                        {formatDate(new Date(match.createdAt))}
                      </div>
                    </div>

                    {/* Battle Arena - Mobile Layout */}
                    <div className="space-y-2">
                      {/* Team Alpha - Compact */}
                      <div
                        className={`relative p-[10px] rounded-lg border-2 transition-all duration-300 ${
                          match.winner === "team1"
                            ? "bg-retro-green/10 border-retro-green/50 shadow-neon-cyan"
                            : "bg-retro-cyan/10 border-retro-cyan/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-[10px]">
                            {match.winner === "team1" ? (
                              <Trophy className="w-4 h-4 text-retro-green animate-pulse-glow" />
                            ) : (
                              <Shield className="w-4 h-4 text-retro-cyan" />
                            )}
                            <div>
                              <div className="font-display font-bold text-retro-cyan text-xs">TEAM ALPHA</div>
                              <div className="font-mono text-retro-light text-xs">
                                {match.team1.player1.name} + {match.team1.player2.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-xl font-display font-bold text-retro-cyan">{match.team1.score}</div>
                        </div>
                      </div>

                      {/* VS Divider - Smaller */}
                      <div className="text-center relative">
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-retro-pink to-retro-purple rounded-full">
                          <span className="font-display font-bold text-xs text-retro-dark">VS</span>
                        </div>
                      </div>

                      {/* Team Beta - Compact */}
                      <div
                        className={`relative p-[10px] rounded-lg border-2 transition-all duration-300 ${
                          match.winner === "team2"
                            ? "bg-retro-green/10 border-retro-green/50 shadow-neon-pink"
                            : "bg-retro-pink/10 border-retro-pink/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-[10px]">
                            {match.winner === "team2" ? (
                              <Trophy className="w-4 h-4 text-retro-green animate-pulse-glow" />
                            ) : (
                              <Sword className="w-4 h-4 text-retro-pink" />
                            )}
                            <div>
                              <div className="font-display font-bold text-retro-pink text-xs">TEAM BETA</div>
                              <div className="font-mono text-retro-light text-xs">
                                {match.team2.player1.name} + {match.team2.player2.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-xl font-display font-bold text-retro-pink">{match.team2.score}</div>
                        </div>
                      </div>
                    </div>

                    {/* Battle Stats - Compact */}
                    <div className="flex items-center justify-between text-xs font-mono text-retro-light/60 pt-3 border-t border-retro-purple/30 mt-3">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {match.team1.score + match.team2.score} battle
                        {match.team1.score + match.team2.score !== 1 ? "s" : ""}
                      </div>
                      {match.isFinished ? (
                        <div className="flex items-center gap-1 text-retro-green">
                          <div className="w-1.5 h-1.5 bg-retro-green rounded-full animate-pulse"></div>
                          COMPLETE
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-retro-yellow">
                          <div className="w-1.5 h-1.5 bg-retro-yellow rounded-full animate-pulse"></div>
                          ACTIVE
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
                </Link>
              );
            })
          )}
        </div>

        {/* Database Info - Compact */}
        <div className="text-center py-4 mt-6">
          <div className="font-mono text-xs text-retro-cyan/40 tracking-wider">
            DATABASE.STATUS.ONLINE • RECORDS.SYNCED • {new Date().toLocaleTimeString()}
          </div>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-retro-cyan/30 to-transparent mx-auto mt-1"></div>
        </div>
      </main>
    </div>
  );
}
