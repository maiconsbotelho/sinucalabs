import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        team1Player1: true,
        team1Player2: true,
        team2Player1: true,
        team2Player2: true,
        games: {
          include: {
            winner: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular estatísticas de cada partida
    const matchesWithStats = matches.map(match => {
      const team1PlayerIds = [match.team1Player1.id, match.team1Player2.id]
      const team2PlayerIds = [match.team2Player1.id, match.team2Player2.id]
      
      let team1Score = 0
      let team2Score = 0
      
      match.games.forEach(game => {
        if (team1PlayerIds.includes(game.winner.id)) {
          team1Score++
        } else {
          team2Score++
        }
      })
      
      const isFinished = team1Score >= 3 || team2Score >= 3
      const winner = isFinished 
        ? (team1Score > team2Score ? 'team1' : 'team2')
        : null
      
      return {
        ...match,
        team1Score,
        team2Score,
        isFinished,
        winner,
        totalGames: match.games.length
      }
    })

    return NextResponse.json(matchesWithStats)
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}