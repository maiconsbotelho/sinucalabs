'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, Crown, Star, Target, Zap } from 'lucide-react'
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

const periodConfig = {
  semana: {
    name: 'da Semana',
    icon: Trophy,
    color: 'retro-cyan',
    gradient: 'from-retro-cyan to-retro-purple'
  },
  mes: {
    name: 'do Mês',
    icon: Medal,
    color: 'retro-pink',
    gradient: 'from-retro-pink to-retro-cyan'
  },
  ano: {
    name: 'do Ano',
    icon: Crown,
    color: 'retro-purple',
    gradient: 'from-retro-purple to-retro-pink'
  }
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
        return <Crown className="w-8 h-8 text-yellow-400 animate-pulse-glow" />
      case 2:
        return <Medal className="w-8 h-8 text-gray-300 animate-pulse" />
      case 3:
        return <Award className="w-8 h-8 text-amber-600 animate-pulse" />
      default:
        return <Star className="w-6 h-6 text-retro-purple/60" />
    }
  }

  const getRankStyle = (position: number) => {
    switch (position) {
      case 1:
        return 'rank-item rank-1 border-yellow-400/50 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10'
      case 2:
        return 'rank-item rank-2 border-gray-300/50 bg-gradient-to-r from-gray-300/10 to-gray-500/10'
      case 3:
        return 'rank-item rank-3 border-amber-600/50 bg-gradient-to-r from-amber-600/10 to-amber-800/10'
      default:
        return 'rank-item border-retro-purple/30'
    }
  }

  const getPositionBadge = (position: number) => {
    const baseClass = "w-12 h-12 rounded-full border-2 flex items-center justify-center font-display text-lg font-bold"
    switch (position) {
      case 1:
        return `${baseClass} border-yellow-400 bg-yellow-400/20 text-yellow-400 animate-pulse-glow`
      case 2:
        return `${baseClass} border-gray-300 bg-gray-300/20 text-gray-300`
      case 3:
        return `${baseClass} border-amber-600 bg-amber-600/20 text-amber-600`
      default:
        return `${baseClass} border-retro-purple bg-retro-purple/20 text-retro-purple`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-retro-cyan border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="font-display text-retro-cyan text-lg tracking-wider">
            LOADING RANKINGS...
          </div>
          <div className="font-mono text-retro-cyan/60 text-sm mt-2">
            [Accessing leaderboard...]
          </div>
        </div>
      </div>
    )
  }

  if (!ranking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-retro-pink text-xl mb-4">ERROR 404</div>
          <div className="font-mono text-retro-light/60 mb-6">Ranking data not found</div>
          <Link href="/" className="btn btn-primary">
            RETURN HOME
          </Link>
        </div>
      </div>
    )
  }

  const config = periodConfig[params.period as keyof typeof periodConfig] || periodConfig.semana
  const IconComponent = config.icon

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="p-4 border-b border-retro-cyan/30 relative">
        <div className="max-w-md mx-auto flex items-center gap-4 relative z-10">
          <Link href="/" className="p-3 rounded-lg border border-retro-cyan/30 hover:border-retro-cyan hover:bg-retro-cyan/10 transition-all duration-300 group">
            <ArrowLeft className="w-5 h-5 text-retro-cyan group-hover:scale-110 transition-transform" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <IconComponent className={`w-8 h-8 text-${config.color} animate-float`} />
              <div>
                <h1 className={`text-xl font-display font-bold text-${config.color}`}>
                  TOP 3 {config.name.toUpperCase()}
                </h1>
                <div className="font-mono text-sm text-retro-light/60">
                  {ranking.totalGames} battle{ranking.totalGames !== 1 ? 's' : ''} recorded
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto relative z-10">
        <div className="space-y-6 mt-6">
          {/* Period Info */}
          <div className="card p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-retro-cyan/5 via-retro-pink/5 to-retro-purple/5 animate-pulse"></div>
            <div className="relative z-10">
              <div className="font-display text-lg font-bold text-retro-light mb-2">
                BATTLE PERIOD
              </div>
              <div className="font-mono text-sm text-retro-cyan/80 tracking-wider">
                {formatDate(new Date(ranking.startDate))} → {formatDate(new Date(ranking.endDate))}
              </div>
            </div>
          </div>

          {/* Rankings */}
          {ranking.rankings.length === 0 ? (
            <div className="card-glow p-8 text-center">
              <TrendingUp className="w-16 h-16 mx-auto text-retro-purple/60 mb-6 animate-float" />
              <h3 className="font-display font-bold text-xl text-retro-light mb-3">
                NO DATA FOUND
              </h3>
              <p className="font-mono text-retro-light/60 text-sm mb-6 tracking-wide">
                [SYSTEM] No battles recorded in this period
              </p>
              <Link href="/nova-partida" className="btn btn-primary">
                <Zap className="w-5 h-5 mr-2" />
                INITIATE FIRST BATTLE
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ranking.rankings.map((stats, index) => {
                const position = index + 1
                return (
                  <div key={stats.player.id} className={`${getRankStyle(position)} relative group`}>
                    <div className="flex items-center gap-4">
                      {/* Position Badge */}
                      <div className="flex items-center gap-3">
                        <div className={getPositionBadge(position)}>
                          {position}
                        </div>
                        {getRankIcon(position)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-lg text-retro-light">
                          {stats.player.name}
                        </h3>
                        <div className="flex items-center gap-4 font-mono text-sm text-retro-light/60 mt-1">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-retro-green rounded-full"></div>
                            {stats.wins}W
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-retro-pink rounded-full"></div>
                            {stats.losses}L
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {stats.gamesPlayed} battles
                          </span>
                        </div>
                      </div>

                      {/* Win Rate */}
                      <div className="text-right">
                        <div className={`text-2xl font-display font-bold text-${config.color}`}>
                          {stats.winRate.toFixed(1)}%
                        </div>
                        <div className="font-mono text-xs text-retro-light/60 tracking-wider">
                          WIN RATE
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill bg-gradient-to-r ${config.gradient}`}
                          style={{ width: `${stats.winRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Other Rankings */}
          <div className="card p-6">
            <h3 className="font-display font-bold text-lg text-retro-light mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-retro-cyan rounded-full animate-pulse"></div>
              OTHER RANKINGS
            </h3>
            
            <div className="space-y-3">
              {Object.entries(periodConfig)
                .filter(([key]) => key !== params.period)
                .map(([key, config]) => {
                  const IconComponent = config.icon
                  return (
                    <Link 
                      key={key}
                      href={`/ranking/${key}`}
                      className={`block p-4 rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-${config.color}/20 hover:border-${config.color}/50 transition-all duration-300 hover:scale-[1.02] group`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-6 h-6 text-${config.color}`} />
                          <span className={`font-display font-semibold text-${config.color}`}>
                            TOP 3 {config.name.toUpperCase()}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 text-${config.color}/60 group-hover:text-${config.color} transition-colors`}>
                          <span className="text-xs font-mono tracking-wider">ACCESS</span>
                          <Target className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  )
                })
              }
            </div>
          </div>

          {/* System Status */}
          <div className="text-center py-4">
            <div className="font-mono text-xs text-retro-cyan/40 tracking-wider">
              RANKING.SYSTEM.ONLINE • LAST_UPDATE: {new Date().toLocaleTimeString()}
            </div>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-retro-cyan/30 to-transparent mx-auto mt-2"></div>
          </div>
        </div>
      </main>
    </div>
  )
}