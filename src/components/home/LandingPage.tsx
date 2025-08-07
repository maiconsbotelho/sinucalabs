import Header from "./Header";
import StartMatchCard from "./StartMatchCard";
import RankingsSection from "./RankingsSection";
import HistorySection from "./HistorySection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="p-3 max-w-[90%] mx-auto relative z-10 mt-[32px]">
        <div className="space-y-4 mt-4">
          <StartMatchCard />
          <RankingsSection />
          <HistorySection />
          <Footer />
        </div>
      </main>
    </div>
  );
}