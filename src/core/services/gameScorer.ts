import { Match, ScoreUpdate, TeamScore } from "../types/match";

export class GameScorer {
  /**
   * Determina qual time um jogador pertence
   */
  static getPlayerTeam(match: Match, winnerId: string): 1 | 2 | null {
    const team1PlayerIds = [match.team1_player1_id, match.team1_player2_id];
    const team2PlayerIds = [match.team2_player1_id, match.team2_player2_id];

    if (team1PlayerIds.includes(winnerId)) {
      return 1;
    } else if (team2PlayerIds.includes(winnerId)) {
      return 2;
    }
    
    return null;
  }

  /**
   * Calcula nova pontuação após um jogo
   */
  static calculateScoreUpdate(match: Match, winnerId: string): ScoreUpdate {
    const winningTeam = this.getPlayerTeam(match, winnerId);

    if (!winningTeam) {
      throw new Error("Jogador vencedor não encontrado na partida");
    }

    const isTeam1Winner = winningTeam === 1;

    return {
      newTeam1Score: isTeam1Winner ? match.team1_score + 1 : match.team1_score,
      newTeam2Score: !isTeam1Winner ? match.team2_score + 1 : match.team2_score,
      winningTeam,
    };
  }

  /**
   * Determina o vencedor da partida baseado no score
   */
  static determineMatchWinner(team1Score: number, team2Score: number): number {
    return team1Score > team2Score ? 1 : 2;
  }

  /**
   * Verifica se a partida deveria estar finalizada
   */
  static shouldFinishMatch(team1Score: number, team2Score: number, maxScore: number = 3): boolean {
    return Math.max(team1Score, team2Score) >= maxScore;
  }

  /**
   * Calcula estatísticas da partida
   */
  static calculateMatchStats(team1Score: number, team2Score: number): {
    totalGames: number;
    winner: number;
    isFinished: boolean;
    winnerScore: number;
    loserScore: number;
  } {
    const totalGames = team1Score + team2Score;
    const winner = this.determineMatchWinner(team1Score, team2Score);
    const isFinished = this.shouldFinishMatch(team1Score, team2Score);
    
    return {
      totalGames,
      winner,
      isFinished,
      winnerScore: Math.max(team1Score, team2Score),
      loserScore: Math.min(team1Score, team2Score),
    };
  }

  /**
   * Calcula o próximo número do jogo
   */
  static getNextGameNumber(team1Score: number, team2Score: number): number {
    return team1Score + team2Score + 1;
  }

  /**
   * Valida se um jogo pode ser adicionado à partida
   */
  static canAddGame(match: Match): boolean {
    return !match.is_finished && !this.shouldFinishMatch(match.team1_score, match.team2_score);
  }

  /**
   * Calcula win rate de um time
   */
  static calculateWinRate(wins: number, totalGames: number): number {
    return totalGames > 0 ? (wins / totalGames) * 100 : 0;
  }

  /**
   * Determina vantagem de um time
   */
  static getTeamAdvantage(team1Score: number, team2Score: number): {
    leadingTeam: 1 | 2 | null;
    advantage: number;
    isClosegame: boolean;
  } {
    const difference = Math.abs(team1Score - team2Score);
    const leadingTeam = team1Score > team2Score ? 1 : team2Score > team1Score ? 2 : null;

    return {
      leadingTeam,
      advantage: difference,
      isClosegame: difference <= 1,
    };
  }

  /**
   * Calcula momentum da partida (últimos 3 jogos)
   */
  static calculateMomentum(
    recentWinners: number[],
    teamNumber: 1 | 2
  ): {
    momentum: "positive" | "negative" | "neutral";
    streak: number;
  } {
    if (recentWinners.length === 0) {
      return { momentum: "neutral", streak: 0 };
    }

    let streak = 0;
    const lastWinner = recentWinners[recentWinners.length - 1];

    // Calcular streak atual
    for (let i = recentWinners.length - 1; i >= 0; i--) {
      if (recentWinners[i] === teamNumber) {
        streak++;
      } else {
        break;
      }
    }

    const momentum = streak >= 2 ? "positive" : streak === 0 ? "negative" : "neutral";

    return { momentum, streak };
  }

  /**
   * Formata score para display
   */
  static formatScore(team1Score: number, team2Score: number): string {
    return `${team1Score} - ${team2Score}`;
  }

  /**
   * Verifica se é uma partida competitiva (diferença pequena de pontos)
   */
  static isCompetitiveMatch(team1Score: number, team2Score: number): boolean {
    const totalGames = team1Score + team2Score;
    const difference = Math.abs(team1Score - team2Score);
    
    // Considera competitiva se a diferença for pequena em relação ao total de jogos
    return totalGames >= 4 && difference <= 2;
  }
}