"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "./Header";
import LoadingState from "./LoadingState";
import NotFoundState from "./NotFoundState";
import PeriodInfo from "./PeriodInfo";
import EmptyRanking from "./EmptyRanking";
import RankingList from "./RankingList";
import OtherRankings from "./OtherRankings";
import SystemStatus from "./SystemStatus";
import { RankingData } from "./types";

export default function RankingPage() {
  const params = useParams();
  const [ranking, setRanking] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.period) {
      fetchRanking();
    }
  }, [params.period]);

  const fetchRanking = async () => {
    try {
      const response = await fetch(`/api/rankings/${params.period}`);
      const data = await response.json();
      setRanking(data);
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!ranking) {
    return <NotFoundState />;
  }

  const period = params.period as string;

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