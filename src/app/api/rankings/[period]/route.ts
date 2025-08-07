import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWeekRange, getMonthRange, getYearRange } from "@/lib/utils";

export async function GET(request: NextRequest, { params }: { params: Promise<{ period: string }> }) {
  try {
    const { period } = await params;

    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case "semana":
        const weekRange = getWeekRange();
        startDate = weekRange.startOfWeek;
        endDate = weekRange.endOfWeek;
        break;
      case "mes":
        const monthRange = getMonthRange();
        startDate = monthRange.startOfMonth;
        endDate = monthRange.endOfMonth;
        break;
      case "ano":
        const yearRange = getYearRange();
        startDate = yearRange.startOfYear;
        endDate = yearRange.endOfYear;
        break;
      default:
        return NextResponse.json({ error: "Período inválido. Use: semana, mes ou ano" }, { status: 400 });
    }

    // Buscar todos os jogos no período
    const games = await prisma.game.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        winner: true,
        match: {
          include: {
            team1Player1: true,
            team1Player2: true,
            team2Player1: true,
            team2Player2: true,
          },
        },
      },
    });

    // Calcular estatísticas por jogador
    const playerStats = new Map<
      string,
      {
        player: any;
        wins: number;
        losses: number;
        gamesPlayed: number;
        winRate: number;
      }
    >();

    // Inicializar todos os jogadores
    const allPlayers = await prisma.player.findMany();
    allPlayers.forEach((player) => {
      playerStats.set(player.id, {
        player,
        wins: 0,
        losses: 0,
        gamesPlayed: 0,
        winRate: 0,
      });
    });

    // Processar cada jogo
    games.forEach((game) => {
      const match = game.match;
      const allMatchPlayers = [match.team1Player1, match.team1Player2, match.team2Player1, match.team2Player2];

      // Determinar qual dupla venceu
      const team1PlayerIds = [match.team1Player1.id, match.team1Player2.id];
      const isTeam1Winner = team1PlayerIds.includes(game.winner.id);

      const winningTeam = isTeam1Winner
        ? [match.team1Player1, match.team1Player2]
        : [match.team2Player1, match.team2Player2];

      const losingTeam = isTeam1Winner
        ? [match.team2Player1, match.team2Player2]
        : [match.team1Player1, match.team1Player2];

      // Atualizar estatísticas dos vencedores
      winningTeam.forEach((player) => {
        const stats = playerStats.get(player.id);
        if (stats) {
          stats.wins++;
          stats.gamesPlayed++;
        }
      });

      // Atualizar estatísticas dos perdedores
      losingTeam.forEach((player) => {
        const stats = playerStats.get(player.id);
        if (stats) {
          stats.losses++;
          stats.gamesPlayed++;
        }
      });
    });

    // Calcular taxa de vitória e ordenar
    const rankings = Array.from(playerStats.values())
      .map((stats) => ({
        ...stats,
        winRate: stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0,
      }))
      .filter((stats) => stats.gamesPlayed > 0) // Apenas jogadores que jogaram
      .sort((a, b) => {
        // Ordenar por taxa de vitória, depois por número de vitórias
        if (b.winRate !== a.winRate) {
          return b.winRate - a.winRate;
        }
        return b.wins - a.wins;
      })
      .slice(0, 3); // TOP 3

    return NextResponse.json({
      period,
      startDate,
      endDate,
      rankings,
      totalGames: games.length,
    });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
