"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./nova-partida/Header";
import LoadingScreen from "./nova-partida/LoadingScreen";
import ProgressIndicator from "./nova-partida/ProgressIndicator";
import TeamSelection from "./nova-partida/TeamSelection";
import PlayersList from "./nova-partida/PlayersList";
import ConfirmationScreen from "./nova-partida/ConfirmationScreen";
import NavigationButtons from "./nova-partida/NavigationButtons";

interface Player {
  id: string;
  name: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [step, setStep] = useState<"team1" | "team2" | "confirm">("team1");
  const [team1, setTeam1] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setPlayers(data);
      } else {
        console.error("Resposta da API não é um array:", data);
        setPlayers([]);
      }
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

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
    setCreating(true);
    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team1Player1Id: team1[0].id,
          team1Player2Id: team1[1].id,
          team2Player1Id: team2[0].id,
          team2Player2Id: team2[1].id,
        }),
      });

      const match = await response.json();
      router.push(`/partida/${match.id}`);
    } catch (error) {
      console.error("Erro ao criar partida:", error);
    } finally {
      setCreating(false);
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
            <NavigationButtons
              step={step}
              canProceed={canProceed()}
              onNext={handleNext}
              onBack={handleBack}
            />
          </div>
        )}

        {step === "confirm" && (
          <>
            <ConfirmationScreen
              team1={team1}
              team2={team2}
              creating={creating}
              onCreateMatch={createMatch}
            />
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