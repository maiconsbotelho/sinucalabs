'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Check, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Player {
  id: string
  name: string
}

export default function NovaPartida() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [step, setStep] = useState<'team1' | 'team2' | 'confirm'>('team1')
  const [team1, setTeam1] = useState<Player[]>([])
  const [team2, setTeam2] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      const data = await response.json()
      setPlayers(data)
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayerSelect = (player: Player) => {
    if (step === 'team1') {
      if (team1.find(p => p.id === player.id)) {
        setTeam1(team1.filter(p => p.id !== player.id))
      } else if (team1.length < 2) {
        setTeam1([...team1, player])
      }
    } else if (step === 'team2') {
      if (team2.find(p => p.id === player.id)) {
        setTeam2(team2.filter(p => p.id !== player.id))
      } else if (team2.length < 2) {
        setTeam2([...team2, player])
      }
    }
  }

  const isPlayerSelected = (player: Player) => {
    if (step === 'team1') {
      return team1.find(p => p.id === player.id)
    } else {
      return team2.find(p => p.id === player.id)
    }
  }

  const isPlayerDisabled = (player: Player) => {
    if (step === 'team2') {
      return team1.find(p => p.id === player.id)
    }
    return false
  }

  const canProceed = () => {
    if (step === 'team1') return team1.length === 2
    if (step === 'team2') return team2.length === 2
    return true
  }

  const handleNext = () => {
    if (step === 'team1') {
      setStep('team2')
    } else if (step === 'team2') {
      setStep('confirm')
    }
  }

  const handleBack = () => {
    if (step === 'team2') {
      setStep('team1')
    } else if (step === 'confirm') {
      setStep('team2')
    }
  }

  const createMatch = async () => {
    setCreating(true)
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team1Player1Id: team1[0].id,
          team1Player2Id: team1[1].id,
          team2Player1Id: team2[0].id,
          team2Player2Id: team2[1].id,
        }),
      })
      
      const match = await response.json()
      router.push(`/partida/${match.id}`)
    } catch (error) {
      console.error('Erro ao criar partida:', error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando jogadores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary">Nova Partida</h1>
            <p className="text-sm text-muted-foreground">
              {step === 'team1' && 'Selecione a Dupla 1'}
              {step === 'team2' && 'Selecione a Dupla 2'}
              {step === 'confirm' && 'Confirmar Partida'}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {step !== 'confirm' && (
          <div className="space-y-4 mt-6">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${
                step === 'team1' ? 'bg-primary' : 'bg-primary/50'
              }`} />
              <div className="flex-1 h-1 bg-secondary rounded" />
              <div className={`w-3 h-3 rounded-full ${
                step === 'team2' ? 'bg-primary' : step === 'confirm' ? 'bg-primary/50' : 'bg-secondary'
              }`} />
            </div>

            {/* Current Team Selection */}
            <div className="card p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">
                  {step === 'team1' ? 'Dupla 1' : 'Dupla 2'}
                </h2>
              </div>
              <div className="text-sm text-muted-foreground">
                Selecione 2 jogadores ({step === 'team1' ? team1.length : team2.length}/2)
              </div>
            </div>

            {/* Players List */}
            <div className="space-y-2">
              {players.map((player) => {
                const selected = isPlayerSelected(player)
                const disabled = isPlayerDisabled(player)
                
                return (
                  <button
                    key={player.id}
                    onClick={() => !disabled && handlePlayerSelect(player)}
                    disabled={disabled}
                    className={`w-full p-4 rounded-lg border transition-all ${
                      disabled
                        ? 'bg-muted/30 border-muted text-muted-foreground cursor-not-allowed'
                        : selected
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-card border-border hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{player.name}</span>
                      {selected && <Check className="w-5 h-5" />}
                      {disabled && <span className="text-xs">Já selecionado</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step === 'team2' && (
                <button
                  onClick={handleBack}
                  className="btn btn-secondary flex-1"
                >
                  Voltar
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 'team1' ? 'Próximo' : 'Confirmar'}
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6 mt-6">
            {/* Team 1 */}
            <div className="card p-4">
              <h3 className="font-semibold text-primary mb-3">Dupla 1</h3>
              <div className="space-y-2">
                {team1.map((player) => (
                  <div key={player.id} className="p-2 bg-secondary/30 rounded">
                    {player.name}
                  </div>
                ))}
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <span className="text-primary font-bold">VS</span>
              </div>
            </div>

            {/* Team 2 */}
            <div className="card p-4">
              <h3 className="font-semibold text-primary mb-3">Dupla 2</h3>
              <div className="space-y-2">
                {team2.map((player) => (
                  <div key={player.id} className="p-2 bg-secondary/30 rounded">
                    {player.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="btn btn-secondary flex-1"
                disabled={creating}
              >
                Voltar
              </button>
              <button
                onClick={createMatch}
                disabled={creating}
                className="btn btn-primary flex-1 disabled:opacity-50"
              >
                {creating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Iniciar Partida
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}