import { NextRequest, NextResponse } from "next/server";
import { playersQuery } from "@/lib/supabase";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const name = (body?.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    const { data, error } = await playersQuery.update(id, name);
    if (error) {
      const message = (error as any)?.message || "Erro ao atualizar jogador";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao atualizar jogador:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
