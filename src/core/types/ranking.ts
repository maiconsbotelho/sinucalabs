export interface Player {
  id: string;
  name: string;
}

export interface Team {
  player1: Player;
  player2: Player;
}

export interface TeamStats {
  team: Team;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
}

export interface Match {
  id: string;
  team1_player1_id: string;
  team1_player2_id: string;
  team2_player1_id: string;
  team2_player2_id: string;
  team1_score: number;
  team2_score: number;
  created_at: string;
  winner_team?: number;
}

export interface RankingData {
  period: string;
  startDate: string;
  endDate: string;
  rankings: TeamStats[];
  totalGames: number;
  totalMatches: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type RankingPeriod = "semana" | "mes" | "ano";