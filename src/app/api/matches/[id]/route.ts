import { NextRequest, NextResponse } from "next/server";
import { matchesQuery, supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: match, error } = await matchesQuery.getById(id);

    if (error || !match) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
    }

    // Buscar os jogadores
    const { data: team1Player1 } = await supabaseAdmin
      .from("players")
      .select("*")
      .eq("id", match.team1_player1_id)
      .single();
    const { data: team1Player2 } = await supabaseAdmin
      .from("players")
      .select("*")
      .eq("id", match.team1_player2_id)
      .single();
    const { data: team2Player1 } = await supabaseAdmin
      .from("players")
      .select("*")
      .eq("id", match.team2_player1_id)
      .single();
    const { data: team2Player2 } = await supabaseAdmin
      .from("players")
      .select("*")
      .eq("id", match.team2_player2_id)
      .single();

    // Buscar jogos da partida (se a tabela existir)
    let games: any[] = [];
    try {
      const { data: gamesData } = await supabaseAdmin
        .from("games")
        .select("*")
        .eq("match_id", match.id)
        .order("created_at", { ascending: true });
      games = gamesData || [];
    } catch (error) {
      // Tabela games ainda não existe
      games = [];
    }

    // Criar um mapa dos jogadores para fácil acesso
    const playersMap = {
      [team1Player1?.id || ""]: team1Player1?.name || "Jogador 1",
      [team1Player2?.id || ""]: team1Player2?.name || "Jogador 2", 
      [team2Player1?.id || ""]: team2Player1?.name || "Jogador 3",
      [team2Player2?.id || ""]: team2Player2?.name || "Jogador 4"
    };

    // Transformar dados para o formato esperado pela página
    const transformedMatch = {
      id: match.id,
      team1Player1: { id: team1Player1?.id || "", name: team1Player1?.name || "Jogador 1" },
      team1Player2: { id: team1Player2?.id || "", name: team1Player2?.name || "Jogador 2" },
      team2Player1: { id: team2Player1?.id || "", name: team2Player1?.name || "Jogador 3" },
      team2Player2: { id: team2Player2?.id || "", name: team2Player2?.name || "Jogador 4" },
      team1Wins: match.team1_score,
      team2Wins: match.team2_score,
      games: games.map((game, index) => ({
        id: game.id,
        gameNumber: index + 1,
        winner: { 
          id: game.winner_id, 
          name: playersMap[game.winner_id] || "Jogador"
        },
        createdAt: game.created_at,
      })),
      isActive: !match.is_finished,
    };

    return NextResponse.json(transformedMatch);
  } catch (error) {
    console.error("Erro ao buscar partida:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { action, winnerId } = body;

    if (action === "add_game") {
      // Buscar a partida atual
      const { data: match, error: matchError } = await matchesQuery.getById(id);
      
      if (matchError || !match) {
        return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
      }

      // Determinar qual dupla ganhou
      const team1PlayerIds = [match.team1_player1_id, match.team1_player2_id];
      const isTeam1Winner = team1PlayerIds.includes(winnerId);
      
      // Atualizar o placar
      const newTeam1Score = isTeam1Winner ? match.team1_score + 1 : match.team1_score;
      const newTeam2Score = !isTeam1Winner ? match.team2_score + 1 : match.team2_score;
      
      // Atualizar a partida no banco
      await matchesQuery.update(id, {
        team1_score: newTeam1Score,
        team2_score: newTeam2Score,
        updated_at: new Date().toISOString()
      });

      // Tentar adicionar o jogo na tabela games (se existir)
      try {
        await supabaseAdmin.from("games").insert({
          match_id: id,
          winner_id: winnerId
        });
      } catch (error) {
        // Tabela games ainda não existe, mas isso não é um erro crítico
        console.log("Tabela games não existe ainda, apenas atualizando o placar");
      }

      // Retornar os dados atualizados (reaproveitando a lógica do GET)
      return GET(request, { params });
    }

    return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 });
  } catch (error) {
    console.error("Erro ao atualizar partida:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
