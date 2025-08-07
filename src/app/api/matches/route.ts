import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await request.json();
    const { team1Player1Id, team1Player2Id, team2Player1Id, team2Player2Id } = body;

    // Validar se todos os IDs foram fornecidos
    if (!team1Player1Id || !team1Player2Id || !team2Player1Id || !team2Player2Id) {
      return NextResponse.json({ error: "Todos os jogadores devem ser selecionados" }, { status: 400 });
    }

    // Validar se não há jogadores duplicados
    const playerIds = [team1Player1Id, team1Player2Id, team2Player1Id, team2Player2Id];
    const uniquePlayerIds = new Set(playerIds);
    if (uniquePlayerIds.size !== 4) {
      return NextResponse.json({ error: "Não é possível ter jogadores duplicados" }, { status: 400 });
    }

    // Verificar se todos os jogadores existem
    const { data: players, error: playersError } = await supabase.from("players").select("id").in("id", playerIds);

    if (playersError || !players || players.length !== 4) {
      return NextResponse.json({ error: "Um ou mais jogadores não foram encontrados" }, { status: 400 });
    }

    // Criar a partida
    const { data: match, error } = await supabase
      .from("matches")
      .insert({
        team1_player1_id: team1Player1Id,
        team1_player2_id: team1Player2Id,
        team2_player1_id: team2Player1Id,
        team2_player2_id: team2Player2Id,
        team1_score: 0,
        team2_score: 0,
        is_finished: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar partida:", error);
      return NextResponse.json({ error: "Erro ao criar partida" }, { status: 500 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Erro ao criar partida:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: matches, error } = await supabase
      .from("matches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar partidas:", error);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
