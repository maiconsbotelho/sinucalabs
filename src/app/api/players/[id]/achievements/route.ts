import { NextRequest, NextResponse } from "next/server";
import { playerAchievementsQuery } from "@/lib/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await playerAchievementsQuery.getByPlayer(id);
  if (error) return NextResponse.json({ error: "Erro ao listar conquistas do jogador" }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { achievement_code, notes, awarded_by } = body;
  if (!achievement_code) return NextResponse.json({ error: "achievement_code é obrigatório" }, { status: 400 });
  const { data, error } = await playerAchievementsQuery.assign(id, achievement_code, notes, awarded_by);
  if (error) return NextResponse.json({ error: "Erro ao atribuir conquista" }, { status: 500 });
  return NextResponse.json(data);
}
