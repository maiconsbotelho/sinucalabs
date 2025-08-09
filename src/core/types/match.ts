export interface MatchPlayer {
  id: string;
  name: string;
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
  updated_at?: string;
}

export interface EnrichedMatch extends Match {
  team1_player1: MatchPlayer;
  team1_player2: MatchPlayer | null;
  team2_player1: MatchPlayer;
  team2_player2: MatchPlayer | null;
  winner?: number; // 1 for team1, 2 for team2
}

export interface CreateMatchRequest {
  team1Player1Id: string;
  team1Player2Id?: string | null;
  team2Player1Id: string;
  team2Player2Id?: string | null;
}

export interface TeamScore {
  team1Score: number;
  team2Score: number;
  winner?: number;
}

export interface ScoreUpdate {
  newTeam1Score: number;
  newTeam2Score: number;
  winningTeam: number;
}
