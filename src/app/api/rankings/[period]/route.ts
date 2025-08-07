import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, Player } from "@/lib/supabase";
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

    // Por enquanto, vamos retornar ranking básico baseado apenas nos jogadores
    // TODO: Implementar ranking real quando a tabela games estiver criada
    const { data: players, error } = await supabaseAdmin
      .from('players')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Erro ao buscar jogadores:", error);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

    // Ranking mock temporário
    const mockRankings = (players || []).slice(0, 3).map((player: Player, index) => ({
      player,
      wins: Math.floor(Math.random() * 10) + 5,
      losses: Math.floor(Math.random() * 5) + 1,
      gamesPlayed: Math.floor(Math.random() * 15) + 6,
      winRate: 75 - (index * 15),
      position: index + 1
    }));

    return NextResponse.json({
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      rankings: mockRankings,
      totalGames: mockRankings.reduce((total, r) => total + r.gamesPlayed, 0),
      note: "Rankings temporários - será atualizado quando a tabela games for criada"
    });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
