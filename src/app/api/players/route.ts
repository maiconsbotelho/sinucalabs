import { NextResponse } from "next/server";
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
