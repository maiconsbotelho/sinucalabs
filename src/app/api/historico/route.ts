import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Buscar partidas com informações dos jogadores
    const { data: matches, error } = await supabaseAdmin
      .from("matches")
      .select(
        `
        *,
        team1_player1:players!team1_player1_id(id, name),
        team1_player2:players!team1_player2_id(id, name),
        team2_player1:players!team2_player1_id(id, name),
        team2_player2:players!team2_player2_id(id, name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar histórico:", error);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

    // Transformar dados para o formato esperado
    const transformedMatches = (matches || []).map((match: any) => ({
      id: match.id,
      team1: {
        player1: match.team1_player1,
        player2: match.team1_player2,
        score: match.team1_score,
      },
      team2: {
        player1: match.team2_player1,
        player2: match.team2_player2,
        score: match.team2_score,
      },
      isFinished: match.is_finished,
      createdAt: match.created_at,
      // Determinar vencedor se a partida estiver finalizada
      winner: match.is_finished ? (match.team1_score > match.team2_score ? "team1" : "team2") : null,
    }));

    return NextResponse.json(transformedMatches);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
