import { NextRequest, NextResponse } from "next/server";
import { playersQuery } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: players, error } = await playersQuery.getAll();

    if (error) {
      console.error("Erro ao buscar jogadores no Supabase:", error);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

    return NextResponse.json(players);
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body?.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    const { data, error } = await playersQuery.create(name);
    if (error) {
      const message = (error as any)?.message || "Erro ao criar jogador";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao criar jogador:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
