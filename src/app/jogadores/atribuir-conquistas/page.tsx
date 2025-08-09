"use client";

import { useEffect, useMemo, useState } from "react";
import { usePlayersStore } from "@/stores";
import { Award, Check, Search, Trash2, User } from "lucide-react";

interface Achievement {
  code: string;
  name: string;
  description: string;
  category?: string;
}

export default function AtribuirConquistasPage() {
  const { players, loading } = usePlayersStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [filter, setFilter] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState<string>("");
  const [assigning, setAssigning] = useState(false);
  const [playerAwards, setPlayerAwards] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/achievements").then(async (r) => setAchievements(await r.json()));
  }, []);

  useEffect(() => {
    if (selectedPlayerId) {
      fetch(`/api/players/${selectedPlayerId}/achievements`).then(async (r) => setPlayerAwards(await r.json()));
    } else {
      setPlayerAwards([]);
    }
  }, [selectedPlayerId]);

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return achievements;
    return achievements.filter(
      (a) =>
        a.name.toLowerCase().includes(f) || a.code.toLowerCase().includes(f) || a.description.toLowerCase().includes(f)
    );
  }, [achievements, filter]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Achievement[]> = {};
    for (const a of filtered) {
      const cat = (a.category || "outros").toLowerCase();
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(a);
    }
    return groups;
  }, [filtered]);

  const assign = async () => {
    if (!selectedPlayerId || !selectedAchievement) return;
    setAssigning(true);
    try {
      const res = await fetch(`/api/players/${selectedPlayerId}/achievements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievement_code: selectedAchievement, notes }),
      });
      if (!res.ok) {
        const e = await res.json();
        alert(e.error || "Erro ao atribuir conquista");
        return;
      }
      const created = await res.json();
      setPlayerAwards((prev) => [created, ...prev]);
      setNotes("");
    } finally {
      setAssigning(false);
    }
  };

  const revoke = async (awardId: string) => {
    const res = await fetch(`/api/player_achievements/${awardId}`, { method: "DELETE" });
    if (!res.ok) {
      const e = await res.json();
      alert(e.error || "Erro ao revogar conquista");
      return;
    }
    setPlayerAwards((prev) => prev.filter((a) => a.id !== awardId));
  };

  return (
    <div className="min-h-screen relative">
      <main className="p-[10px] max-w-sm mx-auto relative z-10">
        <div className="space-y-4 mt-4">
          <div className="card p-[10px]">
            <div className="flex items-center gap-[10px] mb-3">
              <Award className="w-6 h-6 text-retro-yellow" />
              <h2 className="font-display font-bold text-retro-light">Atribuir Conquistas</h2>
            </div>

            {/* Selecionar jogador */}
            <div className="space-y-2">
              <label className="text-xs text-retro-light/70">Jogador</label>
              <select
                className="w-full p-2 rounded bg-card border border-retro-purple/30"
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
              >
                <option value="">Selecione um jogador</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro conquistas */}
            <div className="space-y-2 mt-4">
              <label className="text-xs text-retro-light/70">Buscar conquistas</label>
              <div className="relative">
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-2 pr-8 rounded bg-card border border-retro-purple/30"
                  placeholder="Buscar por nome, código ou descrição"
                />
                <Search className="w-4 h-4 absolute right-2 top-2.5 text-retro-light/50" />
              </div>
            </div>

            {/* Select de conquistas (agrupado por categoria) */}
            <div className="space-y-2 mt-3">
              <label className="text-xs text-retro-light/70">Conquista</label>
              <select
                className="w-full p-2 rounded bg-card border border-retro-purple/30"
                value={selectedAchievement}
                onChange={(e) => setSelectedAchievement(e.target.value)}
              >
                <option value="">Selecione uma conquista</option>
                {Object.entries(groupedByCategory).map(([cat, items]) => (
                  <optgroup key={cat} label={cat.toUpperCase()}>
                    {items.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.name} — {a.description}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {filtered.length === 0 && (
                <div className="text-xs text-retro-light/50">Nenhuma conquista encontrada para este filtro.</div>
              )}
            </div>

            {/* Lista clicável (opcional) */}
            <div className="max-h-52 overflow-auto mt-2 space-y-2">
              {filtered.map((a) => (
                <button
                  key={a.code}
                  className={`w-full text-left p-2 rounded border transition ${
                    selectedAchievement === a.code
                      ? "border-retro-yellow bg-retro-yellow/10"
                      : "border-retro-purple/30 hover:border-retro-purple/60"
                  }`}
                  onClick={() => setSelectedAchievement(a.code)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-sm">{a.name}</div>
                      <div className="text-xs text-retro-light/60">{a.description}</div>
                    </div>
                    {selectedAchievement === a.code && <Check className="w-4 h-4 text-retro-yellow" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Notas */}
            <div className="space-y-2 mt-4">
              <label className="text-xs text-retro-light/70">Notas (opcional)</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 rounded bg-card border border-retro-purple/30"
                placeholder="Ex.: contexto da conquista..."
              />
            </div>

            {/* Atribuir */}
            <div className="mt-4">
              <button
                disabled={!selectedPlayerId || !selectedAchievement || assigning}
                onClick={assign}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                Atribuir Conquista
              </button>
            </div>
          </div>

          {/* Conquistas do jogador */}
          {selectedPlayerId && (
            <div className="card p-[10px]">
              <div className="flex items-center gap-[10px] mb-3">
                <User className="w-6 h-6 text-retro-cyan" />
                <h2 className="font-display font-bold text-retro-light">Conquistas do Jogador</h2>
              </div>

              {playerAwards.length === 0 ? (
                <div className="text-sm text-retro-light/60">Nenhuma conquista atribuída.</div>
              ) : (
                <div className="space-y-2">
                  {playerAwards.map((aw) => (
                    <div
                      key={aw.id}
                      className="p-2 rounded border border-retro-purple/30 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-display text-sm">{aw.achievements?.name || aw.achievement_code}</div>
                        <div className="text-xs text-retro-light/60">{aw.notes}</div>
                      </div>
                      <button onClick={() => revoke(aw.id)} className="text-retro-pink hover:opacity-80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
