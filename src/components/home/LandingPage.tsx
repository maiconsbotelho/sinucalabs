"use client";

import Header from "./Header";
import StartMatchCard from "./StartMatchCard";
import PlayersSection from "./PlayersSection";
import RankingsSection from "./RankingsSection";
import HistorySection from "./HistorySection";
import Footer from "./Footer";
import { usePreloadPageData } from "@/stores";

export default function LandingPage() {
  usePreloadPageData("home");
  return (
    <div className="min-h-screen">
      <Header />

      <main className="p-[10px] max-w-[90%] mx-auto relative z-10 mt-[20px]">
        <div className="space-y-4">
          <StartMatchCard />
          <PlayersSection />
          <RankingsSection />
          <HistorySection />
          <Footer />
        </div>
      </main>
    </div>
  );
}
