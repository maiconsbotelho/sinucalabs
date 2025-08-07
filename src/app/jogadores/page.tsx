"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Users, UserPlus, Edit3, Trash2, Save, X } from "lucide-react";
import { usePlayersStore, usePreloadPageData } from "@/stores";

export default function JogadoresPage() {
  const { players, loading, addPlayer } = usePlayersStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  usePreloadPageData('nova-partida'); // Pré-carrega jogadores

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim()) return;

    setAdding(true);
    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPlayerName.trim() }),
      });

      if (response.ok) {
        const player = await response.json();
        addPlayer(player);
        setNewPlayerName("");
        setShowAddForm(false);
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao adicionar jogador");
      }
    } catch (error) {
      console.error("Erro ao adicionar jogador:", error);
      alert("Erro ao adicionar jogador");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editingId) return;

    // TODO: Implementar edição na API quando necessário
    alert("Funcionalidade de edição será implementada em breve");
    cancelEdit();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-retro-cyan mx-auto"></div>
          <p className="text-retro-light/60 mt-2">Carregando jogadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="relative z-20 p-[10px] bg-primary/10 backdrop-blur-sm border-b border-retro-cyan/20">
        <div className="max-w-md mx-auto flex items-center gap-[10px]">
          <Link href="/" className="text-retro-cyan hover:text-retro-light transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-[10px] flex-1">
            <Users className="w-6 h-6 text-retro-pink" />
            <h1 className="text-xl font-display font-bold text-retro-light">JOGADORES</h1>
          </div>
          <div className="text-xs font-mono text-retro-cyan/60">
            {players.length} players
          </div>
        </div>
      </header>

      <main className="p-[10px] max-w-md mx-auto">
        <div className="space-y-4 mt-6">
          {/* Add Player Button */}
          <div className="card p-[10px]">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-[10px] p-[10px] rounded-lg bg-gradient-to-r from-retro-cyan/20 to-retro-pink/20 border border-retro-cyan/30 hover:border-retro-cyan/60 transition-all duration-300 hover:scale-[1.02] group"
              >
                <UserPlus className="w-5 h-5 text-retro-cyan" />
                <span className="font-display font-semibold text-retro-cyan">ADICIONAR JOGADOR</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-[10px] text-retro-cyan">
                  <UserPlus className="w-5 h-5" />
                  <span className="font-display font-semibold">NOVO JOGADOR</span>
                </div>
                
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Nome do jogador"
                  className="w-full p-[10px] bg-secondary/50 border border-retro-cyan/30 rounded-lg text-retro-light placeholder-retro-light/40 focus:outline-none focus:border-retro-cyan"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddPlayer();
                    }
                  }}
                />
                
                <div className="flex gap-[10px]">
                  <button
                    onClick={handleAddPlayer}
                    disabled={!newPlayerName.trim() || adding}
                    className="flex-1 flex items-center justify-center gap-[10px] p-[10px] rounded-lg bg-retro-cyan/20 border border-retro-cyan/30 hover:bg-retro-cyan/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4 text-retro-cyan" />
                    <span className="font-mono text-sm text-retro-cyan">
                      {adding ? "SALVANDO..." : "SALVAR"}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewPlayerName("");
                    }}
                    className="flex-1 flex items-center justify-center gap-[10px] p-[10px] rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-red-400" />
                    <span className="font-mono text-sm text-red-400">CANCELAR</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Players List */}
          <div className="card p-[10px]">
            <div className="flex items-center gap-[10px] mb-4">
              <div className="w-1.5 h-1.5 bg-retro-pink rounded-full animate-pulse"></div>
              <h2 className="font-display font-bold text-retro-light">LISTA DE JOGADORES</h2>
            </div>

            {players.length === 0 ? (
              <div className="text-center py-8 text-retro-light/60">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum jogador cadastrado</p>
                <p className="text-xs mt-1">Adicione o primeiro jogador acima</p>
              </div>
            ) : (
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-[10px] rounded-lg bg-secondary/30 border border-retro-cyan/10 hover:border-retro-cyan/30 transition-colors group"
                  >
                    <div className="flex items-center gap-[10px]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-retro-cyan to-retro-pink flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </div>
                      
                      {editingId === player.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-secondary/50 border border-retro-cyan/30 rounded px-2 py-1 text-retro-light focus:outline-none focus:border-retro-cyan"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              saveEdit();
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className="font-mono text-retro-light group-hover:text-retro-cyan transition-colors">
                          {player.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-[10px]">
                      {editingId === player.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="p-1 text-retro-cyan hover:bg-retro-cyan/20 rounded"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(player.id, player.name)}
                          className="p-1 text-retro-cyan/60 hover:text-retro-cyan hover:bg-retro-cyan/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          {players.length > 0 && (
            <div className="card p-[10px]">
              <div className="flex items-center gap-[10px] mb-3">
                <div className="w-1.5 h-1.5 bg-retro-purple rounded-full animate-pulse"></div>
                <h3 className="font-display font-bold text-retro-light text-sm">ESTATÍSTICAS</h3>
              </div>
              
              <div className="text-xs font-mono text-retro-light/60 space-y-1">
                <div className="flex justify-between">
                  <span>Total de jogadores:</span>
                  <span className="text-retro-cyan">{players.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jogadores ativos:</span>
                  <span className="text-retro-cyan">{players.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}