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
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
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
      {/* Header */}
      <header className="p-4 border-b border-retro-cyan/30 relative">
        <div className="max-w-md lg:max-w-lg xl:max-w-xl mx-auto flex items-center gap-4 relative z-10">
          <Link
            href="/"
            className="p-3 rounded-lg border border-retro-cyan/30 hover:border-retro-cyan hover:bg-retro-cyan/10 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 text-retro-cyan group-hover:scale-110 transition-transform" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold text-retro-cyan flex items-center gap-2">
              <Zap className="w-6 h-6" />
              NOVA PARTIDA
            </h1>
            <p className="text-sm font-mono text-retro-light/60 tracking-wider">
              {step === "team1" && "[SYSTEM] Select Team Alpha"}
              {step === "team2" && "[SYSTEM] Select Team Beta"}
              {step === "confirm" && "[SYSTEM] Initialize Battle"}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md lg:max-w-lg xl:max-w-xl mx-auto relative z-10">
        {step !== "confirm" && (
          <div className="space-y-6 mt-6">
            {/* Progress */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-display text-sm font-bold transition-all duration-300 ${
                    step === "team1"
                      ? "border-retro-cyan bg-retro-cyan/20 text-retro-cyan animate-pulse-glow"
                      : "border-retro-cyan/50 bg-retro-cyan/10 text-retro-cyan"
                  }`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-retro-cyan/30 to-retro-pink/30 rounded"></div>
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-display text-sm font-bold transition-all duration-300 ${
                    step === "team2"
                      ? "border-retro-pink bg-retro-pink/20 text-retro-pink animate-pulse-glow"
                      : step !== "team1"
                      ? "border-retro-pink/50 bg-retro-pink/10 text-retro-pink"
                      : "border-secondary bg-secondary/20 text-secondary"
                  }`}
                >
                  <Sword className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Current Team Selection */}
            <div className="card-glow p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                {step === "team1" ? (
                  <>
                    <Shield className="w-8 h-8 text-retro-cyan" />
                    <div>
                      <h2 className="font-display font-bold text-xl text-retro-cyan">TEAM ALPHA</h2>
                      <div className="font-mono text-sm text-retro-cyan/60">Select 2 warriors [{team1.length}/2]</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Sword className="w-8 h-8 text-retro-pink" />
                    <div>
                      <h2 className="font-display font-bold text-xl text-retro-pink">TEAM BETA</h2>
                      <div className="font-mono text-sm text-retro-pink/60">Select 2 warriors [{team2.length}/2]</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Players List */}
            <div className="space-y-3">
              {players.map((player, index) => {
                const selected = isPlayerSelected(player);
                const disabled = isPlayerDisabled(player);

                return (
                  <button
                    key={player.id}
                    onClick={() => !disabled && handlePlayerSelect(player)}
                    disabled={disabled}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-300 relative group ${
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
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            selected ? (step === "team1" ? "bg-retro-cyan" : "bg-retro-pink") : "bg-retro-purple/50"
                          } ${selected ? "animate-pulse" : ""}`}
                        ></div>
                        <span className="font-display font-semibold">{player.name}</span>
                      </div>
                      {selected && <Check className="w-6 h-6" />}
                      {disabled && <div className="font-mono text-xs text-muted-foreground">TEAM_ALPHA</div>}
                    </div>

                    {selected && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              {step === "team2" && (
                <button onClick={handleBack} className="btn btn-secondary flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  BACK
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="space-y-8 mt-6">
            {/* Team 1 */}
            <div className="card p-6 border-retro-cyan/50">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-retro-cyan" />
                <h3 className="font-display font-bold text-xl text-retro-cyan">TEAM ALPHA</h3>
              </div>
              <div className="space-y-3">
                {team1.map((player, index) => (
                  <div key={player.id} className="p-3 bg-retro-cyan/10 rounded-lg border border-retro-cyan/30">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-retro-cyan" />
                      <span className="font-display font-semibold text-retro-cyan">{player.name}</span>
                      <span className="font-mono text-xs text-retro-cyan/60">WARRIOR_{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS Separator */}
            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-retro-cyan via-retro-pink to-retro-purple rounded-full animate-pulse-glow">
                <span className="font-display font-bold text-xl text-retro-dark">VS</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-retro-purple/30 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="card p-6 border-retro-pink/50">
              <div className="flex items-center gap-3 mb-4">
                <Sword className="w-8 h-8 text-retro-pink" />
                <h3 className="font-display font-bold text-xl text-retro-pink">TEAM BETA</h3>
              </div>
              <div className="space-y-3">
                {team2.map((player, index) => (
                  <div key={player.id} className="p-3 bg-retro-pink/10 rounded-lg border border-retro-pink/30">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-retro-pink" />
                      <span className="font-display font-semibold text-retro-pink">{player.name}</span>
                      <span className="font-mono text-xs text-retro-pink/60">WARRIOR_{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button onClick={handleBack} className="btn btn-secondary flex-1" disabled={creating}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                MODIFY
              </button>
              <button
                onClick={createMatch}
                disabled={creating}
                className="btn btn-primary flex-1 disabled:opacity-50 relative overflow-hidden"
              >
                {creating ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-retro-dark border-t-transparent rounded-full animate-spin"></div>
                    INITIALIZING...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5" />
                    START BATTLE
                  </div>
                )}
              </button>
            </div>

            {/* Battle Info */}
            <div className="text-center mt-6 p-4 bg-retro-purple/10 rounded-lg border border-retro-purple/30">
              <div className="font-mono text-sm text-retro-purple/80 tracking-wider">
                [SYSTEM] Battle arena ready. Awaiting commander authorization.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
