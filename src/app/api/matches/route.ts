import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MatchManager, CreateMatchRequest } from "@/core";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: CreateMatchRequest = await request.json();
    const { team1Player1Id, team1Player2Id, team2Player1Id, team2Player2Id } = body;

    // Validar usando core business logic
    try {
      MatchManager.validateMatchCreation(body);
    } catch (validationError: any) {
      return NextResponse.json({ error: validationError.message }, { status: 400 });
    }

    // Verificar se todos os jogadores existem
    const playerIds = [team1Player1Id, team1Player2Id, team2Player1Id, team2Player2Id];
    const { data: players, error: playersError } = await supabase.from("players").select("id").in("id", playerIds);

    if (playersError || !players || players.length !== 4) {
      return NextResponse.json({ error: "Um ou mais jogadores não foram encontrados" }, { status: 400 });
    }

    // Criar dados da partida usando core
    const matchData = MatchManager.createMatchData(body);

    // Inserir no banco
    const { data: match, error } = await supabase
      .from("matches")
      .insert(matchData)
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
