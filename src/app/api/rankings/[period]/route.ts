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
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || '2x2';

    // Validar período
    if (!["semana", "mes", "ano"].includes(period)) {
      return NextResponse.json({ error: "Período inválido. Use: semana, mes ou ano" }, { status: 400 });
    }

    // Validar modo
    if (!["1x1", "2x2", "individual"].includes(mode)) {
      return NextResponse.json({ error: "Modo inválido. Use: 1x1, 2x2 ou individual" }, { status: 400 });
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

    // Filtrar matches baseado no modo
    let filteredMatches1x1: any[] = [];
    let filteredMatches2x2: any[] = [];
    let rankings: any;

    if (mode === 'individual') {
      // Para ranking individual, precisamos de ambos os tipos de partidas
      filteredMatches1x1 = (matches || []).filter((match: any) => 
        match.team1_player2_id === null && match.team2_player2_id === null
      );
      filteredMatches2x2 = (matches || []).filter((match: any) => 
        match.team1_player2_id !== null && match.team2_player2_id !== null
      );

      // Determinar vencedor das partidas
      const matches1x1WithWinner: MatchWithWinner[] = filteredMatches1x1.map((match: any) => ({
        ...match,
        winner_team: match.team1_score > match.team2_score ? 1 : 2
      }));

      const matches2x2WithWinner: MatchWithWinner[] = filteredMatches2x2.map((match: any) => ({
        ...match,
        winner_team: match.team1_score > match.team2_score ? 1 : 2
      }));

      // Calcular ranking individual combinado
      const calculator = new RankingCalculator(players || []);
      rankings = calculator.calculateIndividualPlayerRankings(matches1x1WithWinner, matches2x2WithWinner);
    } else {
      // Lógica original para 1x1 e 2x2
      const filteredMatches = (matches || []).filter((match: any) => {
        if (mode === '1x1') {
          return match.team1_player2_id === null && match.team2_player2_id === null;
        } else {
          return match.team1_player2_id !== null && match.team2_player2_id !== null;
        }
      });

      const matchesWithWinner: MatchWithWinner[] = filteredMatches.map((match: any) => ({
        ...match,
        winner_team: match.team1_score > match.team2_score ? 1 : 2
      }));

      const calculator = new RankingCalculator(players || []);
      rankings = mode === '1x1' 
        ? calculator.calculatePlayerRankings(matchesWithWinner)
        : calculator.calculateTeamRankings(matchesWithWinner);
    }

    // Obter top 10
    const topRankings = (mode === '1x1' || mode === 'individual')
      ? RankingCalculator.getTopPlayers(rankings as any, 10)
      : RankingCalculator.getTopTeams(rankings as any, 10);

    // Calcular estatísticas do período
    const summary = RankingCalculator.calculatePeriodSummary(rankings as any);

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
