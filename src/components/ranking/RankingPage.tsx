"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRankingsStore, usePreloadPageData } from "@/stores";
import Header from "./Header";
import LoadingState from "./LoadingState";
import NotFoundState from "./NotFoundState";
import PeriodInfo from "./PeriodInfo";
import EmptyRanking from "./EmptyRanking";
import RankingList from "./RankingList";
import OtherRankings from "./OtherRankings";
import SystemStatus from "./SystemStatus";

export default function RankingPage() {
  const params = useParams();
  
  // Local state for mode selection
  const [mode, setMode] = useState<"1x1" | "2x2">("2x2");
  
  // Zustand store
  const { rankings, fetchRanking, loading, error } = useRankingsStore();
  
  // Pré-carregamento
  usePreloadPageData('ranking');

  useEffect(() => {
    if (params.period && typeof params.period === 'string') {
      fetchRanking(params.period as 'semana' | 'mes' | 'ano', mode);
    }
  }, [params.period, mode, fetchRanking]);

  const period = params.period as string;
  const rankingKey = `${period}_${mode}`;
  const ranking = rankings[rankingKey];

  if (loading) {
    return <LoadingState />;
  }

  if (!ranking) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen relative">
      <Header period={period} totalGames={ranking?.totalGames || 0} />

      <main className="p-[10px] max-w-sm mx-auto relative z-10">
        <div className="space-y-4 mt-4">
          {/* Mode toggle - retro modern design */}
          <div className="flex items-center justify-center gap-3">
            <button
              className={`btn btn-secondary text-xs px-4 py-2 border-2 font-mono font-bold transition-all relative
                ${
                  mode === "1x1"
                    ? "border-retro-cyan bg-retro-cyan text-retro-dark  shadow-[0_0_32px_8px_rgb(255,20,147,0.9)]  animate-pulse-glow"
                    : "border-retro-cyan text-retro-cyan bg-transparent"
                }`}
              style={
                mode === "1x1"
                  ? {
                      textShadow: "0 0 2px #000, 0 0 12px #0ff, 0 0 24px #0ff",
                    }
                  : {}
              }
              onClick={() => setMode("1x1")}
            >
              1x1
            </button>
            <button
              className={`btn btn-secondary text-xs px-4 py-2 border-2 font-mono font-bold transition-all relative
                ${
                  mode === "2x2"
                    ? "border-retro-pink bg-retro-pink text-retro-light shadow-[0_0_32px_8px_rgb(255,20,147,0.9)] animate-pulse-glow"
                    : "border-retro-pink text-retro-pink bg-transparent"
                }`}
              style={mode === "2x2" ? { textShadow: "0 0 2px #fff, 0 0 12px #ff1493, 0 0 24px #ff1493" } : {}}
              onClick={() => setMode("2x2")}
            >
              2x2
            </button>
          </div>

          <PeriodInfo startDate={ranking?.startDate} endDate={ranking?.endDate} />

          {!ranking || ranking.rankings.length === 0 ? (
            <EmptyRanking />
          ) : (
            <RankingList rankings={ranking.rankings} period={period} />
          )}

          <OtherRankings currentPeriod={period} />
          <SystemStatus />
        </div>
      </main>
    </div>
  );
}