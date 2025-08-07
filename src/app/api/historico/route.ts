import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Por enquanto, vamos retornar apenas partidas básicas
    // Mais tarde podemos adicionar joins com games quando as tabelas estiverem prontas
    const { data: matches, error } = await supabase
      .from("matches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar histórico:", error);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }

    // Retornar matches simples por enquanto
    return NextResponse.json(matches || []);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
