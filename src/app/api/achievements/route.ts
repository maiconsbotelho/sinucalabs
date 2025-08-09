import { NextRequest, NextResponse } from "next/server";
import { achievementsQuery } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await achievementsQuery.getAll();
  if (error) return NextResponse.json({ error: "Erro ao listar conquistas" }, { status: 500 });
  return NextResponse.json(data);
}
