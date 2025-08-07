"use client";

import { useEffect } from "react";
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
  
  // Zustand store
  const { rankings, fetchRanking, loading, error } = useRankingsStore();
  
  // Pré-carregamento
  usePreloadPageData('ranking');

  useEffect(() => {
    if (params.period && typeof params.period === 'string') {
      fetchRanking(params.period as 'semana' | 'mes' | 'ano');
    }
  }, [params.period, fetchRanking]);

  const period = params.period as string;
  const ranking = rankings[period];

  if (loading) {
    return <LoadingState />;
  }

  if (!ranking) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen relative">
      <Header period={period} totalGames={ranking.totalGames} />

      <main className="p-3 max-w-sm mx-auto relative z-10">
        <div className="space-y-4 mt-4">
          <PeriodInfo startDate={ranking.startDate} endDate={ranking.endDate} />

          {ranking.rankings.length === 0 ? (
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