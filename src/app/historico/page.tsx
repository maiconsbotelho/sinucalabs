'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Trophy, Users, Calendar, Database, Zap, Shield, Sword, Target } from 'lucide-react'
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
        text: 'COMPLETED',
        color: 'text-retro-green',
        icon: <Trophy className="w-4 h-4 animate-pulse" />
      }
    } else {
      return {
        text: 'IN_PROGRESS',
        color: 'text-retro-yellow',
        icon: <Zap className="w-4 h-4 animate-pulse" />
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-retro-cyan border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="font-display text-retro-cyan text-lg tracking-wider">
            LOADING DATABASE...
          </div>
          <div className="font-mono text-retro-cyan/60 text-sm mt-2">
            [Accessing match history...]
          </div>
        </div>
      </div>
    )
  }

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
              <Database className="w-8 h-8 text-retro-cyan animate-pulse" />
              <div>
                <h1 className="text-xl font-display font-bold text-retro-cyan">
                  MATCH DATABASE
                </h1>
                <div className="font-mono text-sm text-retro-light/60">
                  {matches.length} record{matches.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto relative z-10">
        <div className="space-y-4 mt-6">
          {matches.length === 0 ? (
            <div className="card-glow p-8 text-center">
              <Database className="w-16 h-16 mx-auto text-retro-purple/60 mb-6 animate-float" />
              <h3 className="font-display font-bold text-xl text-retro-light mb-3">
                DATABASE EMPTY
              </h3>
              <p className="font-mono text-retro-light/60 text-sm mb-6 tracking-wide">
                [SYSTEM] No battle records found in database
              </p>
              <Link href="/nova-partida" className="btn btn-primary">
                <Zap className="w-5 h-5 mr-2" />
                INITIATE FIRST BATTLE
              </Link>
            </div>
          ) : (
            matches.map((match, index) => {
              const status = getMatchStatus(match)
              const winner = getWinnerTeam(match)
              
              return (
                <Link 
                  key={match.id} 
                  href={`/partida/${match.id}`}
                  className="block card hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="p-6 relative z-10">
                    {/* Match Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-retro-cyan rounded-full animate-pulse"></div>
                        <div className={`flex items-center gap-2 text-sm font-mono ${status.color}`}>
                          {status.icon}
                          {status.text}
                        </div>
                      </div>
                      <div className="font-mono text-xs text-retro-cyan/60 tracking-wider">
                        {formatDate(new Date(match.createdAt))}
                      </div>
                    </div>

                    {/* Battle Arena */}
                    <div className="space-y-3">
                      {/* Team Alpha */}
                      <div className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                        match.winner === 'team1' 
                          ? 'bg-retro-green/10 border-retro-green/50 shadow-neon-cyan' 
                          : 'bg-retro-cyan/10 border-retro-cyan/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {match.winner === 'team1' ? (
                              <Trophy className="w-6 h-6 text-retro-green animate-pulse-glow" />
                            ) : (
                              <Shield className="w-6 h-6 text-retro-cyan" />
                            )}
                            <div>
                              <div className="font-display font-bold text-retro-cyan text-sm">
                                TEAM ALPHA
                              </div>
                              <div className="font-mono text-retro-light text-xs">
                                {match.team1Player1.name} + {match.team1Player2.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-2xl font-display font-bold text-retro-cyan">
                            {match.team1Score}
                          </div>
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="text-center relative">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-retro-pink to-retro-purple rounded-full">
                          <span className="font-display font-bold text-sm text-retro-dark">VS</span>
                        </div>
                      </div>

                      {/* Team Beta */}
                      <div className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                        match.winner === 'team2' 
                          ? 'bg-retro-green/10 border-retro-green/50 shadow-neon-pink' 
                          : 'bg-retro-pink/10 border-retro-pink/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {match.winner === 'team2' ? (
                              <Trophy className="w-6 h-6 text-retro-green animate-pulse-glow" />
                            ) : (
                              <Sword className="w-6 h-6 text-retro-pink" />
                            )}
                            <div>
                              <div className="font-display font-bold text-retro-pink text-sm">
                                TEAM BETA
                              </div>
                              <div className="font-mono text-retro-light text-xs">
                                {match.team2Player1.name} + {match.team2Player2.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-2xl font-display font-bold text-retro-pink">
                            {match.team2Score}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Battle Stats */}
                    <div className="flex items-center justify-between text-xs font-mono text-retro-light/60 pt-4 border-t border-retro-purple/30 mt-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-3 h-3" />
                        {match.totalGames} battle{match.totalGames !== 1 ? 's' : ''}
                      </div>
                      {match.isFinished ? (
                        <div className="flex items-center gap-1 text-retro-green">
                          <div className="w-2 h-2 bg-retro-green rounded-full animate-pulse"></div>
                          MISSION_COMPLETE
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-retro-yellow">
                          <div className="w-2 h-2 bg-retro-yellow rounded-full animate-pulse"></div>
                          BATTLE_ACTIVE
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
                </Link>
              )
            })
          )}
        </div>

        {/* Database Info */}
        <div className="text-center py-6 mt-8">
          <div className="font-mono text-xs text-retro-cyan/40 tracking-wider">
            DATABASE.STATUS.ONLINE • RECORDS.SYNCED • {new Date().toLocaleTimeString()}
          </div>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-retro-cyan/30 to-transparent mx-auto mt-2"></div>
        </div>
      </main>
    </div>
  )
}