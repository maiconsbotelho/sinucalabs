'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { useParams } from 'next/navigation'
import { formatDate } from '@/lib/utils'

interface Player {
  id: string
  name: string
}

interface PlayerStats {
  player: Player
  wins: number
  losses: number
  gamesPlayed: number
  winRate: number
}

interface RankingData {
  period: string
  startDate: string
  endDate: string
  rankings: PlayerStats[]
  totalGames: number
}

const periodNames = {
  semana: 'da Semana',
  mes: 'do Mês',
  ano: 'do Ano'
}

const periodEmojis = {
  semana: '🏆',
  mes: '🥇',
  ano: '👑'
}

export default function RankingPage() {
  const params = useParams()
  const [ranking, setRanking] = useState<RankingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.period) {
      fetchRanking()
    }
  }, [params.period])

  const fetchRanking = async () => {
    try {
      const response = await fetch(`/api/rankings/${params.period}`)
      const data = await response.json()
      setRanking(data)
    } catch (error) {
      console.error('Erro ao buscar ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6" />
    }
  }

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
      case 2:
        return 'bg-gray-400/20 text-gray-400 border-gray-400/30'
      case 3:
        return 'bg-amber-600/20 text-amber-600 border-amber-600/30'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando ranking...</p>
        </div>
      </div>
    )
  }

  if (!ranking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Erro ao carregar ranking</p>
          <Link href="/" className="btn btn-primary mt-4">
            Voltar ao Início
          </Link>
        </div>
      </div>
    )
  }

  const periodName = periodNames[params.period as keyof typeof periodNames] || params.period
  const periodEmoji = periodEmojis[params.period as keyof typeof periodEmojis] || '🏆'

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
              {periodEmoji} TOP 3 {periodName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {ranking.totalGames} jogo{ranking.totalGames !== 1 ? 's' : ''} no período
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="space-y-6 mt-6">
          {/* Período */}
          <div className="card p-4 text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Período: {formatDate(new Date(ranking.startDate))} - {formatDate(new Date(ranking.endDate))}
            </div>
          </div>

          {/* Rankings */}
          {ranking.rankings.length === 0 ? (
            <div className="card p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Nenhum jogo encontrado</h3>
              <p className="text-muted-foreground text-sm">
                Não há dados de jogos para este período.
              </p>
              <Link href="/nova-partida" className="btn btn-primary mt-4">
                Iniciar Primeira Partida
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {ranking.rankings.map((stats, index) => {
                const position = index + 1
                return (
                  <div key={stats.player.id} className="card p-4">
                    <div className="flex items-center gap-4">
                      {/* Posição e Ícone */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold ${
                          getRankBadge(position)
                        }`}>
                          {position}
                        </div>
                        {getRankIcon(position)}
                      </div>

                      {/* Informações do Jogador */}
                      <div className="flex-1">
                        <h3 className="font-semibold">{stats.player.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{stats.wins}V</span>
                          <span>{stats.losses}D</span>
                          <span>{stats.gamesPlayed} jogos</span>
                        </div>
                      </div>

                      {/* Taxa de Vitória */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {stats.winRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          taxa de vitória
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mt-3">
                      <div className="w-full bg-secondary/30 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stats.winRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Outros Rankings */}
          <div className="card p-4">
            <h3 className="font-semibold mb-4">Outros Rankings</h3>
            <div className="space-y-2">
              {Object.entries(periodNames)
                .filter(([key]) => key !== params.period)
                .map(([key, name]) => (
                  <Link 
                    key={key}
                    href={`/ranking/${key}`}
                    className="block p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {periodEmojis[key as keyof typeof periodEmojis]} TOP 3 {name}
                      </span>
                      <span className="text-xs text-muted-foreground">Ver →</span>
                    </div>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}