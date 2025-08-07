"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Check, Play, Zap, Cpu, Shield, Sword } from "lucide-react";
import { useRouter } from "next/navigation";

interface Player {
  id: string;
  name: string;
}

export default function NovaPartida() {
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

      // Garantir que data seja um array
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

  const isPlayerSelected = (player: Player) => {
    if (step === "team1") {
      return !!team1.find((p) => p.id === player.id);
    } else {
      return !!team2.find((p) => p.id === player.id);
    }
  };

  const isPlayerDisabled = (player: Player) => {
    if (step === "team2") {
      return !!team1.find((p) => p.id === player.id);
    }
    return false;
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-retro-cyan border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="font-display text-retro-cyan text-lg tracking-wider">LOADING PLAYERS...</div>
          <div className="font-mono text-retro-cyan/60 text-sm mt-2">[Accessing database...]</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Header - Mobile Optimized */}
      <header className="p-3 border-b border-retro-cyan/30 relative">
        <div className="max-w-sm mx-auto flex items-center gap-3 relative z-10">
          <Link
            href="/"
            className="p-2 rounded-lg border border-retro-cyan/30 hover:border-retro-cyan hover:bg-retro-cyan/10 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 text-retro-cyan group-hover:scale-110 transition-transform" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-display font-bold text-retro-cyan flex items-center gap-2">
              <Zap className="w-5 h-5" />
              NOVA PARTIDA
            </h1>
            <p className="text-xs font-mono text-retro-light/60 tracking-wider">
              {step === "team1" && "[SYSTEM] Select Team Alpha"}
              {step === "team2" && "[SYSTEM] Select Team Beta"}
              {step === "confirm" && "[SYSTEM] Initialize Battle"}
            </p>
          </div>
        </div>
      </header>

      <main className="p-3 max-w-sm mx-auto relative z-10">
        {step !== "confirm" && (
          <div className="space-y-4 mt-4">
            {/* Progress - Compact Mobile */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-display text-xs font-bold transition-all duration-300 ${
                    step === "team1"
                      ? "border-retro-cyan bg-retro-cyan/20 text-retro-cyan animate-pulse-glow"
                      : "border-retro-cyan/50 bg-retro-cyan/10 text-retro-cyan"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-retro-cyan/30 to-retro-pink/30 rounded"></div>
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-display text-xs font-bold transition-all duration-300 ${
                    step === "team2"
                      ? "border-retro-pink bg-retro-pink/20 text-retro-pink animate-pulse-glow"
                      : step !== "team1"
                      ? "border-retro-pink/50 bg-retro-pink/10 text-retro-pink"
                      : "border-secondary bg-secondary/20 text-secondary"
                  }`}
                >
                  <Sword className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Current Team Selection - Compact */}
            <div className="card-glow p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                {step === "team1" ? (
                  <>
                    <Shield className="w-6 h-6 text-retro-cyan" />
                    <div>
                      <h2 className="font-display font-bold text-lg text-retro-cyan">TEAM ALPHA</h2>
                      <div className="font-mono text-xs text-retro-cyan/60">Select 2 warriors [{team1.length}/2]</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Sword className="w-6 h-6 text-retro-pink" />
                    <div>
                      <h2 className="font-display font-bold text-lg text-retro-pink">TEAM BETA</h2>
                      <div className="font-mono text-xs text-retro-pink/60">Select 2 warriors [{team2.length}/2]</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Players List - Mobile Optimized */}
            <div className="space-y-2">
              {players.map((player, index) => {
                const selected = isPlayerSelected(player);
                const disabled = isPlayerDisabled(player);

                return (
                  <button
                    key={player.id}
                    onClick={() => !disabled && handlePlayerSelect(player)}
                    disabled={disabled}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-300 relative group ${
                      disabled
                        ? "bg-muted/20 border-muted/30 text-muted-foreground cursor-not-allowed opacity-50"
                        : selected
                        ? step === "team1"
                          ? "bg-retro-cyan/10 border-retro-cyan text-retro-cyan shadow-retro"
                          : "bg-retro-pink/10 border-retro-pink text-retro-pink shadow-neon-pink"
                        : "bg-card/50 border-retro-purple/30 hover:border-retro-purple hover:bg-retro-purple/10 hover:scale-[1.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selected ? (step === "team1" ? "bg-retro-cyan" : "bg-retro-pink") : "bg-retro-purple/50"
                          } ${selected ? "animate-pulse" : ""}`}
                        ></div>
                        <span className="font-display font-semibold text-sm">{player.name}</span>
                      </div>
                      {selected && <Check className="w-5 h-5" />}
                      {disabled && <div className="font-mono text-xs text-muted-foreground">TEAM_ALPHA</div>}
                    </div>

                    {selected && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation - Mobile Optimized */}
            <div className="flex gap-3 mt-6">
              {step === "team2" && (
                <button onClick={handleBack} className="btn btn-secondary flex-1 text-sm py-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  BACK
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
              >
                {step === "team1" ? (
                  <>
                    NEXT
                    <Zap className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    CONFIRM
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4 mt-4">
            {/* Team 1 - Compact */}
            <div className="card p-4 border-retro-cyan/50">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-6 h-6 text-retro-cyan" />
                <h3 className="font-display font-bold text-lg text-retro-cyan">TEAM ALPHA</h3>
              </div>
              <div className="space-y-2">
                {team1.map((player, index) => (
                  <div key={player.id} className="p-2 bg-retro-cyan/10 rounded-lg border border-retro-cyan/30">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-retro-cyan" />
                      <span className="font-display font-semibold text-retro-cyan text-sm">{player.name}</span>
                      <span className="font-mono text-xs text-retro-cyan/60">W_{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS Separator - Compact */}
            <div className="text-center relative py-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-retro-cyan via-retro-pink to-retro-purple rounded-full animate-pulse-glow">
                <span className="font-display font-bold text-lg text-retro-dark">VS</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-retro-purple/30 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Team 2 - Compact */}
            <div className="card p-4 border-retro-pink/50">
              <div className="flex items-center gap-2 mb-3">
                <Sword className="w-6 h-6 text-retro-pink" />
                <h3 className="font-display font-bold text-lg text-retro-pink">TEAM BETA</h3>
              </div>
              <div className="space-y-2">
                {team2.map((player, index) => (
                  <div key={player.id} className="p-2 bg-retro-pink/10 rounded-lg border border-retro-pink/30">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-retro-pink" />
                      <span className="font-display font-semibold text-retro-pink text-sm">{player.name}</span>
                      <span className="font-mono text-xs text-retro-pink/60">W_{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions - Mobile Optimized */}
            <div className="flex gap-3 mt-6">
              <button onClick={handleBack} className="btn btn-secondary flex-1 text-sm py-2" disabled={creating}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                MODIFY
              </button>
              <button
                onClick={createMatch}
                disabled={creating}
                className="btn btn-primary flex-1 disabled:opacity-50 relative overflow-hidden text-sm py-2"
              >
                {creating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-retro-dark border-t-transparent rounded-full animate-spin"></div>
                    INIT...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    START BATTLE
                  </div>
                )}
              </button>
            </div>

            {/* Battle Info - Compact */}
            <div className="text-center mt-4 p-3 bg-retro-purple/10 rounded-lg border border-retro-purple/30">
              <div className="font-mono text-xs text-retro-purple/80 tracking-wider">
                [SYSTEM] Battle arena ready. Awaiting authorization.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
