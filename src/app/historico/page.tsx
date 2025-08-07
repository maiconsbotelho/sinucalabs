'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Trophy, Users, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Player {
  id: string
  name: string
}

interface Game {
  id: string
  winner: Player
  createdAt: string
}

interface Match {
  id: string
  team1Player1: Player
  team1Player2: Player
  team2Player1: Player
  team2Player2: Player
  games: Game[]
  createdAt: string
  team1Score: number
  team2Score: number
  isFinished: boolean
  winner: 'team1' | 'team2' | null
  totalGames: number
}

export default function HistoricoPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/historico')
      const data = await response.json()
      setMatches(data)
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMatchStatus = (match: Match) => {
    if (match.isFinished) {
      return {
        text: 'Finalizada',
        color: 'text-green-500',
        icon: <Trophy className="w-4 h-4" />
      }
    } else {
      return {
        text: 'Em andamento',
        color: 'text-yellow-500',
        icon: <Clock className="w-4 h-4" />
      }
    }
  }

  const getWinnerTeam = (match: Match) => {
    if (!match.winner) return null
    
    if (match.winner === 'team1') {
      return {
        players: [match.team1Player1, match.team1Player2],
        score: match.team1Score
      }
    } else {
      return {
        players: [match.team2Player1, match.team2Player2],
        score: match.team2Score
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando histórico...</p>
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
            <h1 className="text-xl font-bold text-primary flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Histórico de Partidas
            </h1>
            <p className="text-sm text-muted-foreground">
              {matches.length} partida{matches.length !== 1 ? 's' : ''} registrada{matches.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="space-y-4 mt-6">
          {matches.length === 0 ? (
            <div className="card p-6 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Nenhuma partida encontrada</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Ainda não há partidas registradas no sistema.
              </p>
              <Link href="/nova-partida" className="btn btn-primary">
                Iniciar Primeira Partida
              </Link>
            </div>
          ) : (
            matches.map((match) => {
              const status = getMatchStatus(match)
              const winner = getWinnerTeam(match)
              
              return (
                <Link 
                  key={match.id} 
                  href={`/partida/${match.id}`}
                  className="block card p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="space-y-3">
                    {/* Header da Partida */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 text-sm ${status.color}`}>
                          {status.icon}
                          {status.text}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(new Date(match.createdAt))}
                      </div>
                    </div>

                    {/* Times */}
                    <div className="space-y-2">
                      {/* Time 1 */}
                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        match.winner === 'team1' ? 'bg-green-500/20 border border-green-500/30' : 'bg-secondary/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          {match.winner === 'team1' && <Trophy className="w-4 h-4 text-green-500" />}
                          <div>
                            <div className="font-medium text-sm">
                              {match.team1Player1.name} & {match.team1Player2.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-bold">
                          {match.team1Score}
                        </div>
                      </div>

                      {/* VS */}
                      <div className="text-center text-xs text-muted-foreground">
                        VS
                      </div>

                      {/* Time 2 */}
                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        match.winner === 'team2' ? 'bg-green-500/20 border border-green-500/30' : 'bg-secondary/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          {match.winner === 'team2' && <Trophy className="w-4 h-4 text-green-500" />}
                          <div>
                            <div className="font-medium text-sm">
                              {match.team2Player1.name} & {match.team2Player2.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-bold">
                          {match.team2Score}
                        </div>
                      </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                      <span>{match.totalGames} jogo{match.totalGames !== 1 ? 's' : ''} disputado{match.totalGames !== 1 ? 's' : ''}</span>
                      {match.isFinished ? (
                        <span className="text-green-500">✓ Concluída</span>
                      ) : (
                        <span className="text-yellow-500">⏱ Em andamento</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}