import { NextRequest, NextResponse } from "next/server";
import { matchesQuery, supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: match, error } = await matchesQuery.getById(id);

    if (error || !match) {
      return NextResponse.json({ error: "Partida não encontrada" }, { status: 404 });
    }

    return NextResponse.json(match);
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
      // Por enquanto, retornar que a funcionalidade ainda não está implementada
      // TODO: Implementar quando a tabela games estiver criada
      return NextResponse.json({ 
        error: "Funcionalidade de jogos ainda não implementada. Crie as tabelas no Supabase primeiro." 
      }, { status: 501 });
    }

    return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 });
  } catch (error) {
    console.error("Erro ao atualizar partida:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
