import { TeamStats, Team } from "../types/ranking";

/**
 * Formata nome da dupla para exibição
 */
export function formatTeamName(team: Team): string {
  return `${team.player1.name} & ${team.player2.name}`;
}

/**
 * Formata nome da dupla de forma abreviada
 */
export function formatTeamNameShort(team: Team): string {
  const name1 = team.player1.name.split(' ')[0];
  const name2 = team.player2.name.split(' ')[0];
  return `${name1} & ${name2}`;
}

/**
 * Verifica se uma dupla contém um jogador específico
 */
export function teamContainsPlayer(team: Team, playerId: string): boolean {
  return team.player1.id === playerId || team.player2.id === playerId;
}

/**
 * Verifica se duas duplas são iguais (independente da ordem)
 */
export function teamsAreEqual(team1: Team, team2: Team): boolean {
  const team1Ids = [team1.player1.id, team1.player2.id].sort();
  const team2Ids = [team2.player1.id, team2.player2.id].sort();
  
  return team1Ids[0] === team2Ids[0] && team1Ids[1] === team2Ids[1];
}

/**
 * Calcula diferença de vitórias entre duas duplas
 */
export function calculateWinDifference(team1: TeamStats, team2: TeamStats): number {
  return team1.wins - team2.wins;
}

/**
 * Classifica performance da dupla baseada no win rate
 */
export function getPerformanceLevel(winRate: number): {
  level: string;
  color: string;
  description: string;
} {
  if (winRate >= 80) {
    return {
      level: "LEGENDARY",
      color: "text-yellow-400",
      description: "Dominação absoluta"
    };
  } else if (winRate >= 70) {
    return {
      level: "EXCELLENT",
      color: "text-green-400",
      description: "Performance excepcional"
    };
  } else if (winRate >= 60) {
    return {
      level: "GOOD",
      color: "text-blue-400",
      description: "Boa performance"
    };
  } else if (winRate >= 50) {
    return {
      level: "AVERAGE",
      color: "text-gray-400",
      description: "Performance equilibrada"
    };
  } else if (winRate >= 30) {
    return {
      level: "BELOW_AVERAGE",
      color: "text-orange-400",
      description: "Precisa melhorar"
    };
  } else {
    return {
      level: "POOR",
      color: "text-red-400",
      description: "Performance ruim"
    };
  }
}

/**
 * Calcula streak de vitórias/derrotas baseado no histórico recente
 * (Esta função precisaria de dados históricos ordenados por data)
 */
export function calculateStreak(recentMatches: Array<{ won: boolean }>): {
  type: 'win' | 'loss';
  count: number;
} {
  if (recentMatches.length === 0) {
    return { type: 'win', count: 0 };
  }

  const lastResult = recentMatches[0].won;
  let count = 0;
  
  for (const match of recentMatches) {
    if (match.won === lastResult) {
      count++;
    } else {
      break;
    }
  }

  return {
    type: lastResult ? 'win' : 'loss',
    count
  };
}

/**
 * Formata estatísticas para exibição
 */
export function formatStats(stats: TeamStats): {
  record: string;
  winRate: string;
  gamesPlayed: string;
} {
  return {
    record: `${stats.wins}W - ${stats.losses}L`,
    winRate: `${stats.winRate.toFixed(1)}%`,
    gamesPlayed: `${stats.gamesPlayed} jogos`
  };
}

/**
 * Calcula pontos ELO simplificado para ranking mais sofisticado
 */
export function calculateEloRating(
  currentRating: number,
  opponentRating: number,
  won: boolean,
  kFactor: number = 32
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
  const actualScore = won ? 1 : 0;
  
  return Math.round(currentRating + kFactor * (actualScore - expectedScore));
}

/**
 * Busca duplas que jogaram contra uma dupla específica
 */
export function findOpponents(
  allRankings: TeamStats[],
  targetTeam: Team
): TeamStats[] {
  return allRankings.filter(stats => 
    !teamsAreEqual(stats.team, targetTeam)
  );
}

/**
 * Calcula média de jogos por partida para uma dupla
 */
export function calculateAvgGamesPerMatch(stats: TeamStats): number {
  return stats.matchesPlayed > 0 
    ? stats.gamesPlayed / stats.matchesPlayed 
    : 0;
}