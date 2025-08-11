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
  const [mode, setMode] = useState<"1x1" | "2x2">("2x2");
  const [team1, setTeam1] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<Player[]>([]);

  // Pré-carregamento
  usePreloadPageData("nova-partida");

  const loading = playersLoading;
  const creating = matchLoading;

  const handlePlayerSelect = (player: Player) => {
    const maxSize = mode === "1x1" ? 1 : 2;
    if (step === "team1") {
      if (team1.find((p) => p.id === player.id)) {
        setTeam1(team1.filter((p) => p.id !== player.id));
      } else if (team1.length < maxSize) {
        setTeam1([...team1, player]);
      }
    } else if (step === "team2") {
      if (team2.find((p) => p.id === player.id)) {
        setTeam2(team2.filter((p) => p.id !== player.id));
      } else if (team2.length < maxSize) {
        setTeam2([...team2, player]);
      }
    }
  };

  const canProceed = () => {
    const required = mode === "1x1" ? 1 : 2;
    if (step === "team1") return team1.length === required;
    if (step === "team2") return team2.length === required;
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
      const isSingles = mode === "1x1";
      const payload: any = {
        team1Player1Id: team1[0].id,
        team2Player1Id: team2[0].id,
      };
      if (!isSingles) {
        payload.team1Player2Id = team1[1].id;
        payload.team2Player2Id = team2[1].id;
      } else {
        payload.team1Player2Id = null;
        payload.team2Player2Id = null;
      }

      const matchId = await createMatchAPI(payload);

      // Invalidar cache para atualizar outras páginas
      await invalidateCache("match");

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
        {/* Mode toggle - retro modern design */}
        <div className="flex items-center justify-center gap-3 mb-4">
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
            onClick={() => {
              setMode("1x1");
              setTeam1((prev) => prev.slice(0, 1));
              setTeam2((prev) => prev.slice(0, 1));
            }}
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
        {step !== "confirm" && (
          <div className="space-y-4 mt-4">
            <ProgressIndicator step={step} />
            <TeamSelection step={step} team1={team1} team2={team2} requiredSize={mode === "1x1" ? 1 : 2} />
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
