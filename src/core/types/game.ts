export interface Game {
  id: string;
  match_id: string;
  game_number: number;
  winner_id: string;
  created_at: string;
}

export interface GameWithWinner extends Game {
  winner: {
    id: string;
    name: string;
  };
}

export interface CreateGameRequest {
  match_id: string;
  winner_id: string;
}

export interface GameResult {
  winnerId: string;
  winnerTeam: 1 | 2;
  gameNumber: number;
}