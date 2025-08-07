import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, Player } from "@/lib/supabase";
import { getWeekRange, getMonthRange, getYearRange } from "@/lib/utils";

interface TeamStats {
  team: {
    player1: Player;
    player2: Player;
  };
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
}

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

    // Buscar partidas do período
    const { data: matches, error: matchesError } = await supabaseAdmin
      .from("matches")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: false });

    if (matchesError) {
      console.error("Erro ao buscar partidas:", matchesError);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

    // Buscar todos os jogadores para fazer o mapeamento
    const { data: players, error: playersError } = await supabaseAdmin.from("players").select("*");

    if (playersError) {
      console.error("Erro ao buscar jogadores:", playersError);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

    // Criar mapa de jogadores para fácil acesso
    const playersMap: { [key: string]: Player } = {};
    (players || []).forEach((player: Player) => {
      playersMap[player.id] = player;
    });

    // Calcular estatísticas das duplas
    const teamStatsMap: { [key: string]: TeamStats } = {};

    (matches || []).forEach((match: any) => {
      // Dupla 1
      const team1Key = `${match.team1_player1_id}-${match.team1_player2_id}`;
      const team1Player1 = playersMap[match.team1_player1_id];
      const team1Player2 = playersMap[match.team1_player2_id];

      if (team1Player1 && team1Player2) {
        if (!teamStatsMap[team1Key]) {
          teamStatsMap[team1Key] = {
            team: { player1: team1Player1, player2: team1Player2 },
            wins: 0,
            losses: 0,
            gamesPlayed: 0,
            winRate: 0,
          };
        }

        teamStatsMap[team1Key].wins += match.team1_score;
        teamStatsMap[team1Key].losses += match.team2_score;
        teamStatsMap[team1Key].gamesPlayed += match.team1_score + match.team2_score;
      }

      // Dupla 2
      const team2Key = `${match.team2_player1_id}-${match.team2_player2_id}`;
      const team2Player1 = playersMap[match.team2_player1_id];
      const team2Player2 = playersMap[match.team2_player2_id];

      if (team2Player1 && team2Player2) {
        if (!teamStatsMap[team2Key]) {
          teamStatsMap[team2Key] = {
            team: { player1: team2Player1, player2: team2Player2 },
            wins: 0,
            losses: 0,
            gamesPlayed: 0,
            winRate: 0,
          };
        }

        teamStatsMap[team2Key].wins += match.team2_score;
        teamStatsMap[team2Key].losses += match.team1_score;
        teamStatsMap[team2Key].gamesPlayed += match.team1_score + match.team2_score;
      }
    });

    // Calcular win rate e ordenar
    const teamStats = Object.values(teamStatsMap)
      .map((team) => ({
        ...team,
        winRate: team.gamesPlayed > 0 ? (team.wins / team.gamesPlayed) * 100 : 0,
      }))
      .filter((team) => team.gamesPlayed > 0) // Só incluir duplas que jogaram
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 10); // Top 10 duplas

    return NextResponse.json({
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      rankings: teamStats,
      totalGames: teamStats.reduce((total, team) => total + team.gamesPlayed, 0),
    });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
