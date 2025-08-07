import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { team1Player1Id, team1Player2Id, team2Player1Id, team2Player2Id } = body

    // Validar se todos os IDs foram fornecidos
    if (!team1Player1Id || !team1Player2Id || !team2Player1Id || !team2Player2Id) {
      return NextResponse.json(
        { error: 'Todos os jogadores devem ser selecionados' },
        { status: 400 }
      )
    }

    // Validar se não há jogadores duplicados
    const playerIds = [team1Player1Id, team1Player2Id, team2Player1Id, team2Player2Id]
    const uniquePlayerIds = new Set(playerIds)
    if (uniquePlayerIds.size !== 4) {
      return NextResponse.json(
        { error: 'Não é possível ter jogadores duplicados' },
        { status: 400 }
      )
    }

    // Verificar se todos os jogadores existem
    const players = await prisma.player.findMany({
      where: {
        id: {
          in: playerIds
        }
      }
    })

    if (players.length !== 4) {
      return NextResponse.json(
        { error: 'Um ou mais jogadores não foram encontrados' },
        { status: 400 }
      )
    }

    // Criar a partida
    const match = await prisma.match.create({
      data: {
        team1Player1Id,
        team1Player2Id,
        team2Player1Id,
        team2Player2Id,
      },
      include: {
        team1Player1: true,
        team1Player2: true,
        team2Player1: true,
        team2Player2: true,
        games: true
      }
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error('Erro ao criar partida:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

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
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(matches)
  } catch (error) {
    console.error('Erro ao buscar partidas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}