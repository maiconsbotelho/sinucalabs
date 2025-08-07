import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { MatchManager, MatchPlayer } from "@/core";

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

    // Transformar dados usando core business logic
    const transformedMatches = (matches || []).map((match: any) => {
      // Criar array de jogadores para enriquecimento
      const players: MatchPlayer[] = [
        match.team1_player1,
        match.team1_player2,
        match.team2_player1,
        match.team2_player2,
      ];

      // Usar MatchManager para enriquecer e transformar dados
      const enrichedMatch = MatchManager.enrichMatch(match, players);
      
      return MatchManager.transformForHistory(enrichedMatch);
    });

    return NextResponse.json(transformedMatches);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
