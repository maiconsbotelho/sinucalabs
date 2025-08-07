import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { 
  RankingCalculator, 
  getDateRangeForPeriod, 
  RankingPeriod,
  Player,
  MatchWithWinner 
} from "@/core";

export async function GET(request: NextRequest, { params }: { params: Promise<{ period: string }> }) {
  try {
    const { period } = await params;

    // Validar período
    if (!["semana", "mes", "ano"].includes(period)) {
      return NextResponse.json({ error: "Período inválido. Use: semana, mes ou ano" }, { status: 400 });
    }

    // Obter range de datas usando core
    const dateRange = getDateRangeForPeriod(period as RankingPeriod);

    // Buscar partidas do período
    const { data: matches, error: matchesError } = await supabaseAdmin
      .from("matches")
      .select("*")
      .gte("created_at", dateRange.startDate.toISOString())
      .lte("created_at", dateRange.endDate.toISOString())
      .order("created_at", { ascending: false });

    if (matchesError) {
      console.error("Erro ao buscar partidas:", matchesError);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

    // Buscar todos os jogadores
    const { data: players, error: playersError } = await supabaseAdmin.from("players").select("*");

    if (playersError) {
      console.error("Erro ao buscar jogadores:", playersError);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

    // Determinar vencedor da partida baseado no score
    const matchesWithWinner: MatchWithWinner[] = (matches || []).map((match: any) => ({
      ...match,
      winner_team: match.team1_score > match.team2_score ? 1 : 2
    }));

    // Calcular rankings usando core
    const calculator = new RankingCalculator(players || []);
    const rankings = calculator.calculateTeamRankings(matchesWithWinner);

    // Obter top 10
    const topRankings = RankingCalculator.getTopTeams(rankings, 10);

    // Calcular estatísticas do período
    const summary = RankingCalculator.calculatePeriodSummary(rankings);

    return NextResponse.json({
      period,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      rankings: topRankings,
      totalGames: summary.totalGames,
      totalMatches: summary.totalMatches,
      totalTeams: summary.totalTeams,
    });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
