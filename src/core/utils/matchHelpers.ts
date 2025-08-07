import { Match, EnrichedMatch, MatchPlayer } from "../types/match";
import { Game, GameWithWinner } from "../types/game";

/**
 * Verifica se um jogador pertence a um time específico
 */
export function isPlayerInTeam(match: Match, playerId: string, team: 1 | 2): boolean {
  const team1Ids = [match.team1_player1_id, match.team1_player2_id];
  const team2Ids = [match.team2_player1_id, match.team2_player2_id];
  
  if (team === 1) {
    return team1Ids.includes(playerId);
  } else {
    return team2Ids.includes(playerId);
  }
}

/**
 * Obtém todos os IDs de jogadores de uma partida
 */
export function getAllPlayerIds(match: Match): string[] {
  return [
    match.team1_player1_id,
    match.team1_player2_id,
    match.team2_player1_id,
    match.team2_player2_id,
  ];
}

/**
 * Obtém IDs dos jogadores de um time específico
 */
export function getTeamPlayerIds(match: Match, team: 1 | 2): string[] {
  if (team === 1) {
    return [match.team1_player1_id, match.team1_player2_id];
  } else {
    return [match.team2_player1_id, match.team2_player2_id];
  }
}

/**
 * Verifica se duas partidas são entre as mesmas duplas
 */
export function areSameTeams(match1: Match, match2: Match): boolean {
  const team1_match1 = [match1.team1_player1_id, match1.team1_player2_id].sort();
  const team2_match1 = [match1.team2_player1_id, match1.team2_player2_id].sort();
  
  const team1_match2 = [match2.team1_player1_id, match2.team1_player2_id].sort();
  const team2_match2 = [match2.team2_player1_id, match2.team2_player2_id].sort();
  
  // Verifica se os times são iguais (team1 vs team2 ou team2 vs team1)
  const sameOrder = (
    JSON.stringify(team1_match1) === JSON.stringify(team1_match2) &&
    JSON.stringify(team2_match1) === JSON.stringify(team2_match2)
  );
  
  const reversedOrder = (
    JSON.stringify(team1_match1) === JSON.stringify(team2_match2) &&
    JSON.stringify(team2_match1) === JSON.stringify(team1_match2)
  );
  
  return sameOrder || reversedOrder;
}

/**
 * Calcula histórico entre duas duplas
 */
export function calculateHeadToHead(
  matches: Match[],
  team1PlayerIds: string[],
  team2PlayerIds: string[]
): {
  totalMatches: number;
  team1Wins: number;
  team2Wins: number;
  totalGames: number;
  team1Games: number;
  team2Games: number;
} {
  const relevantMatches = matches.filter(match => {
    const matchTeam1 = [match.team1_player1_id, match.team1_player2_id].sort();
    const matchTeam2 = [match.team2_player1_id, match.team2_player2_id].sort();
    
    const inputTeam1 = [...team1PlayerIds].sort();
    const inputTeam2 = [...team2PlayerIds].sort();
    
    const sameOrder = (
      JSON.stringify(matchTeam1) === JSON.stringify(inputTeam1) &&
      JSON.stringify(matchTeam2) === JSON.stringify(inputTeam2)
    );
    
    const reversedOrder = (
      JSON.stringify(matchTeam1) === JSON.stringify(inputTeam2) &&
      JSON.stringify(matchTeam2) === JSON.stringify(inputTeam1)
    );
    
    return sameOrder || reversedOrder;
  });

  let team1Wins = 0;
  let team2Wins = 0;
  let team1Games = 0;
  let team2Games = 0;

  relevantMatches.forEach(match => {
    const matchTeam1 = [match.team1_player1_id, match.team1_player2_id].sort();
    const inputTeam1 = [...team1PlayerIds].sort();
    
    const isTeam1Playing = JSON.stringify(matchTeam1) === JSON.stringify(inputTeam1);
    
    if (match.is_finished) {
      if (isTeam1Playing) {
        // Team1 é team1 na partida
        if (match.team1_score > match.team2_score) team1Wins++;
        else team2Wins++;
        team1Games += match.team1_score;
        team2Games += match.team2_score;
      } else {
        // Team1 é team2 na partida
        if (match.team2_score > match.team1_score) team1Wins++;
        else team2Wins++;
        team1Games += match.team2_score;
        team2Games += match.team1_score;
      }
    }
  });

  return {
    totalMatches: relevantMatches.length,
    team1Wins,
    team2Wins,
    totalGames: team1Games + team2Games,
    team1Games,
    team2Games,
  };
}

/**
 * Obtém últimas partidas de um jogador
 */
export function getRecentMatches<T extends Match>(
  matches: T[],
  playerId: string,
  limit: number = 5
): T[] {
  return matches
    .filter(match => getAllPlayerIds(match).includes(playerId))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

/**
 * Calcula streak de vitórias de um jogador
 */
export function calculatePlayerStreak(matches: Match[], playerId: string): {
  type: 'win' | 'loss';
  count: number;
} {
  const playerMatches = matches
    .filter(match => getAllPlayerIds(match).includes(playerId) && match.is_finished)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (playerMatches.length === 0) {
    return { type: 'win', count: 0 };
  }

  const lastMatch = playerMatches[0];
  const team1Ids = [lastMatch.team1_player1_id, lastMatch.team1_player2_id];
  const isTeam1 = team1Ids.includes(playerId);
  const lastWin = isTeam1 
    ? lastMatch.team1_score > lastMatch.team2_score
    : lastMatch.team2_score > lastMatch.team1_score;

  let streak = 0;
  
  for (const match of playerMatches) {
    const matchTeam1Ids = [match.team1_player1_id, match.team1_player2_id];
    const matchIsTeam1 = matchTeam1Ids.includes(playerId);
    const matchWin = matchIsTeam1
      ? match.team1_score > match.team2_score
      : match.team2_score > match.team1_score;

    if (matchWin === lastWin) {
      streak++;
    } else {
      break;
    }
  }

  return {
    type: lastWin ? 'win' : 'loss',
    count: streak,
  };
}

/**
 * Agrupa partidas por duplas
 */
export function groupMatchesByTeams(matches: EnrichedMatch[]): Map<string, EnrichedMatch[]> {
  const groups = new Map<string, EnrichedMatch[]>();

  matches.forEach(match => {
    const team1Key = [match.team1_player1.name, match.team1_player2.name].sort().join(' & ');
    const team2Key = [match.team2_player1.name, match.team2_player2.name].sort().join(' & ');
    const matchKey = [team1Key, team2Key].sort().join(' vs ');

    if (!groups.has(matchKey)) {
      groups.set(matchKey, []);
    }
    groups.get(matchKey)!.push(match);
  });

  return groups;
}

/**
 * Converte jogos para formato de histórico
 */
export function transformGamesForHistory(games: GameWithWinner[]): any[] {
  return games.map(game => ({
    id: game.id,
    gameNumber: game.game_number,
    winner: game.winner,
    createdAt: game.created_at,
  }));
}

/**
 * Verifica se uma partida é recente (últimas 24h)
 */
export function isRecentMatch(match: Match, hoursThreshold: number = 24): boolean {
  const now = new Date();
  const matchDate = new Date(match.created_at);
  const hoursDiff = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff <= hoursThreshold;
}

/**
 * Obtém status de uma partida para exibição
 */
export function getMatchDisplayStatus(match: Match): {
  status: 'waiting' | 'in_progress' | 'finished';
  message: string;
  canAddGame: boolean;
} {
  if (match.is_finished) {
    return {
      status: 'finished',
      message: 'Partida finalizada',
      canAddGame: false,
    };
  }

  if (match.team1_score === 0 && match.team2_score === 0) {
    return {
      status: 'waiting',
      message: 'Aguardando primeiro jogo',
      canAddGame: true,
    };
  }

  return {
    status: 'in_progress',
    message: 'Partida em andamento',
    canAddGame: true,
  };
}