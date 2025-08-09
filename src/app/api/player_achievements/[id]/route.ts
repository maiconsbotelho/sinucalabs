import { NextRequest, NextResponse } from "next/server";
import { playerAchievementsQuery } from "@/lib/supabase";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await playerAchievementsQuery.revoke(id);
  if (error) return NextResponse.json({ error: "Erro ao revogar conquista" }, { status: 500 });
  return NextResponse.json({ success: true });
}
