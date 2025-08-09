export interface Achievement {
  code: string;
  name: string;
  description: string;
  category?: string;
}

export interface PlayerAchievement {
  id: string;
  player_id: string;
  achievement_code: string;
  notes?: string | null;
  awarded_by?: string | null;
  created_at: string;
}
