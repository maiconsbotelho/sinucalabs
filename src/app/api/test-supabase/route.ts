import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    console.log("Supabase URL:", supabaseUrl);
    console.log("Service Key exists:", !!supabaseServiceKey);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Testar conexão listando players
    const { data, error } = await supabase.from("players").select("*").limit(5);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Erro ao conectar com Supabase", details: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com Supabase funcionando",
      players: data,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Erro ao testar Supabase:", error);
    return NextResponse.json({ error: "Erro interno do servidor", details: error }, { status: 500 });
  }
}
