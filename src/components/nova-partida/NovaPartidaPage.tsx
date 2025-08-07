"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlayersStore, useMatchesStore, usePreloadPageData, useOptimisticUpdates } from "@/stores";
import Header from "./Header";
import LoadingScreen from "./LoadingScreen";
import ProgressIndicator from "./ProgressIndicator";
import TeamSelection from "./TeamSelection";
import PlayersList from "./PlayersList";
import ConfirmationScreen from "./ConfirmationScreen";
import NavigationButtons from "./NavigationButtons";

interface Player {
  id: string;
  name: string;
}

export default function NovaPartidaPage() {
  const router = useRouter();
  
  // Zustand stores
  const { players, loading: playersLoading } = usePlayersStore();
  const { createMatch: createMatchAPI, loading: matchLoading } = useMatchesStore();
  const { invalidateCache } = useOptimisticUpdates();
  
  // Local state
  const [step, setStep] = useState<"team1" | "team2" | "confirm">("team1");
  const [team1, setTeam1] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<Player[]>([]);

  // Pré-carregamento
  usePreloadPageData('nova-partida');

  const loading = playersLoading;
  const creating = matchLoading;

  const handlePlayerSelect = (player: Player) => {
    if (step === "team1") {
      if (team1.find((p) => p.id === player.id)) {
        setTeam1(team1.filter((p) => p.id !== player.id));
      } else if (team1.length < 2) {
        setTeam1([...team1, player]);
      }
    } else if (step === "team2") {
      if (team2.find((p) => p.id === player.id)) {
        setTeam2(team2.filter((p) => p.id !== player.id));
      } else if (team2.length < 2) {
        setTeam2([...team2, player]);
      }
    }
  };

  const canProceed = () => {
    if (step === "team1") return team1.length === 2;
    if (step === "team2") return team2.length === 2;
    return true;
  };

  const handleNext = () => {
    if (step === "team1") {
      setStep("team2");
    } else if (step === "team2") {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "team2") {
      setStep("team1");
    } else if (step === "confirm") {
      setStep("team2");
    }
  };

  const createMatch = async () => {
    try {
      const matchId = await createMatchAPI({
        team1Player1Id: team1[0].id,
        team1Player2Id: team1[1].id,
        team2Player1Id: team2[0].id,
        team2Player2Id: team2[1].id,
      });

      // Invalidar cache para atualizar outras páginas
      await invalidateCache('match');
      
      router.push(`/partida/${matchId}`);
    } catch (error) {
      console.error("Erro ao criar partida:", error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen relative">
      <Header step={step} />

      <main className="max-w-sm mt-[32px] mx-auto relative z-10">
        {step !== "confirm" && (
          <div className="space-y-4 mt-4">
            <ProgressIndicator step={step} />
            <TeamSelection step={step} team1={team1} team2={team2} />
            <PlayersList
              players={players}
              step={step}
              team1={team1}
              team2={team2}
              onPlayerSelect={handlePlayerSelect}
            />
            <NavigationButtons step={step} canProceed={canProceed()} onNext={handleNext} onBack={handleBack} />
          </div>
        )}

        {step === "confirm" && (
          <>
            <ConfirmationScreen team1={team1} team2={team2} creating={creating} onCreateMatch={createMatch} />
            <NavigationButtons
              step={step}
              canProceed={true}
              creating={creating}
              onNext={handleNext}
              onBack={handleBack}
              onCreateMatch={createMatch}
            />
          </>
        )}
      </main>
    </div>
  );
}
