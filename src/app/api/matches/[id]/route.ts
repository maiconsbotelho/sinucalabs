import { NextRequest, NextResponse } from "next/server";
import { matchesQuery, supabaseAdmin } from "@/lib/supabase";
import { MatchManager, MatchPlayer } from "@/core";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: match, error } = await matchesQuery.getById(id);

    if (error || !match) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
    }

    // Buscar todos os jogadores em uma única query
    const playerIds = [
      match.team1_player1_id,
      match.team1_player2_id,
      match.team2_player1_id,
      match.team2_player2_id,
    ].filter((id): id is string => Boolean(id));
    const { data: players } = await supabaseAdmin.from("players").select("id, name").in("id", playerIds);

    if (!players || players.length === 0) {
      return NextResponse.json({ error: "Jogadores não encontrados" }, { status: 404 });
    }

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
      games = [];
    }

    // Enriquecer partida usando core
    const enrichedMatch = MatchManager.enrichMatch(match, players as MatchPlayer[]);

    // Criar um mapa dos jogadores para o games
    const playersMap = new Map(players.map((p) => [p.id, p.name]));

    // Transformar dados para o formato esperado pela página
    const transformedMatch = {
      id: enrichedMatch.id,
      team1Player1: enrichedMatch.team1_player1,
      team1Player2: enrichedMatch.team1_player2,
      team2Player1: enrichedMatch.team2_player1,
      team2Player2: enrichedMatch.team2_player2,
      team1Wins: enrichedMatch.team1_score,
      team2Wins: enrichedMatch.team2_score,
      games: games.map((game, index) => ({
        id: game.id,
        gameNumber: index + 1,
        winner: {
          id: game.winner_id,
          name: playersMap.get(game.winner_id) || "Jogador",
        },
        createdAt: game.created_at,
      })),
      isActive: !enrichedMatch.is_finished,
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

      // Processar adição do jogo usando core business logic
      let gameProcessing;
      try {
        gameProcessing = MatchManager.processGameAddition(match, winnerId);
      } catch (coreError: any) {
        return NextResponse.json({ error: coreError.message }, { status: 400 });
      }

      const { scoreUpdate, shouldFinish } = gameProcessing;

      // Atualizar a partida no banco
      await matchesQuery.update(id, {
        team1_score: scoreUpdate.newTeam1Score,
        team2_score: scoreUpdate.newTeam2Score,
        is_finished: shouldFinish,
        updated_at: new Date().toISOString(),
      });

      // Tentar adicionar o jogo na tabela games (se existir)
      try {
        await supabaseAdmin.from("games").insert({
          match_id: id,
          winner_id: winnerId,
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
