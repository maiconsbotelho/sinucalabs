import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente para uso no servidor (com service role key)
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Types para TypeScript
export interface Player {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  team1_player1_id: string;
  team1_player2_id: string | null;
  team2_player1_id: string;
  team2_player2_id: string | null;
  team1_score: number;
  team2_score: number;
  is_finished: boolean;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  match_id: string;
  winner_id: string;
  created_at: string;
}

export interface Achievement {
  code: string;
  name: string;
  description: string;
  category?: string;
  allow_multiple?: boolean;
  created_at: string;
}

export interface PlayerAchievement {
  id: string;
  player_id: string;
  achievement_code: string;
  notes?: string | null;
  awarded_by?: string | null;
  created_at: string;
}

// Queries helpers
export const playersQuery = {
  getAll: () => supabaseAdmin.from("players").select("*").order("name", { ascending: true }),
  getById: (id: string) => supabaseAdmin.from("players").select("*").eq("id", id).single(),
  create: (name: string) => supabaseAdmin.from("players").insert({ name }).select().single(),
};

export const matchesQuery = {
  getAll: () => supabaseAdmin.from("matches").select("*").order("created_at", { ascending: false }),
  getById: (id: string) => supabaseAdmin.from("matches").select("*").eq("id", id).single(),
  create: (data: Omit<Match, "id" | "created_at" | "updated_at">) =>
    supabaseAdmin.from("matches").insert(data).select().single(),
  update: (id: string, data: Partial<Match>) =>
    supabaseAdmin.from("matches").update(data).eq("id", id).select().single(),
};

export const gamesQuery = {
  getByMatchId: (matchId: string) =>
    supabaseAdmin.from("games").select("*").eq("match_id", matchId).order("created_at", { ascending: true }),
  create: (matchId: string, winnerId: string) =>
    supabaseAdmin.from("games").insert({ match_id: matchId, winner_id: winnerId }).select().single(),
};

export const achievementsQuery = {
  getAll: () => supabaseAdmin.from("achievements").select("*").order("name", { ascending: true }),
  upsertMany: (items: Omit<Achievement, "created_at">[]) =>
    supabaseAdmin.from("achievements").upsert(items, { onConflict: "code" }).select(),
};

export const playerAchievementsQuery = {
  getByPlayer: (playerId: string) =>
    supabaseAdmin
      .from("player_achievements")
      .select(
        "id, player_id, achievement_code, notes, awarded_by, created_at, achievements:achievement_code(code, name, description, category)"
      )
      .eq("player_id", playerId)
      .order("created_at", { ascending: false }),
  assign: (playerId: string, achievementCode: string, notes?: string, awardedBy?: string) =>
    supabaseAdmin
      .from("player_achievements")
      .insert({ player_id: playerId, achievement_code: achievementCode, notes, awarded_by: awardedBy })
      .select()
      .single(),
  revoke: (awardId: string) => supabaseAdmin.from("player_achievements").delete().eq("id", awardId),
};
