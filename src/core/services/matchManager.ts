import { Match, EnrichedMatch, CreateMatchRequest, MatchPlayer } from "../types/match";
import { GameScorer } from "./gameScorer";
import { TeamValidator } from "./teamValidator";

export class MatchManager {
  /**
   * Valida dados para criação de partida
   */
  static validateMatchCreation(request: CreateMatchRequest): void {
    const hasTeam1Second = Boolean(request.team1Player2Id);
    const hasTeam2Second = Boolean(request.team2Player2Id);

    // Ambos os times devem ter o mesmo número de jogadores (1x1 ou 2x2)
    if (hasTeam1Second !== hasTeam2Second) {
      throw new Error("Ambos os times devem ter o mesmo número de jogadores");
    }

    const playerIds = [
      request.team1Player1Id,
      request.team1Player2Id as any,
      request.team2Player1Id,
      request.team2Player2Id as any,
    ];

    TeamValidator.validateMatchPlayers(playerIds as string[]);
  }

  /**
   * Cria dados de partida para inserção no banco
   */
  static createMatchData(request: CreateMatchRequest): Omit<Match, "id" | "created_at"> {
    this.validateMatchCreation(request);

    return {
      team1_player1_id: request.team1Player1Id,
      team1_player2_id: request.team1Player2Id ?? null,
      team2_player1_id: request.team2Player1Id,
      team2_player2_id: request.team2Player2Id ?? null,
      team1_score: 0,
      team2_score: 0,
      is_finished: false,
    };
  }

  /**
   * Enriquece partida com dados dos jogadores
   */
  static enrichMatch(match: Match, players: MatchPlayer[]): EnrichedMatch {
    const playersMap = new Map(players.map((p) => [p.id, p]));

    const enrichedMatch: EnrichedMatch = {
      ...match,
      team1_player1: playersMap.get(match.team1_player1_id) || { id: match.team1_player1_id, name: "Unknown" },
      team1_player2: match.team1_player2_id
        ? playersMap.get(match.team1_player2_id) || { id: match.team1_player2_id, name: "Unknown" }
        : null,
      team2_player1: playersMap.get(match.team2_player1_id) || { id: match.team2_player1_id, name: "Unknown" },
      team2_player2: match.team2_player2_id
        ? playersMap.get(match.team2_player2_id) || { id: match.team2_player2_id, name: "Unknown" }
        : null,
    };

    // Adicionar vencedor se a partida estiver finalizada
    if (match.is_finished) {
      enrichedMatch.winner = GameScorer.determineMatchWinner(match.team1_score, match.team2_score);
    }

    return enrichedMatch;
  }

  /**
   * Transforma partida para histórico
   */
  static transformForHistory(match: EnrichedMatch): any {
    return {
      id: match.id,
      team1: {
        player1: match.team1_player1,
        player2: match.team1_player2,
        score: match.team1_score,
      },
      team2: {
        player1: match.team2_player1,
        player2: match.team2_player2,
        score: match.team2_score,
      },
      isFinished: match.is_finished,
      createdAt: match.created_at,
      winner: match.winner || null,
    };
  }

  /**
   * Verifica se partida pode receber novos jogos
   */
  static canAddGame(match: Match): boolean {
    return GameScorer.canAddGame(match);
  }

  /**
   * Processa adição de um jogo à partida
   */
  static processGameAddition(
    match: Match,
    winnerId: string
  ): {
    scoreUpdate: any;
    shouldFinish: boolean;
    gameNumber: number;
  } {
    if (!this.canAddGame(match)) {
      throw new Error("Não é possível adicionar jogos a uma partida finalizada");
    }

    const scoreUpdate = GameScorer.calculateScoreUpdate(match, winnerId);
    const shouldFinish = GameScorer.shouldFinishMatch(scoreUpdate.newTeam1Score, scoreUpdate.newTeam2Score);
    const gameNumber = GameScorer.getNextGameNumber(match.team1_score, match.team2_score);

    return {
      scoreUpdate,
      shouldFinish,
      gameNumber,
    };
  }

  /**
   * Obtém estatísticas básicas da partida
   */
  static getMatchStats(match: Match): {
    totalGames: number;
    winner?: number;
    isCompetitive: boolean;
    advantage: any;
  } {
    const stats = GameScorer.calculateMatchStats(match.team1_score, match.team2_score);
    const advantage = GameScorer.getTeamAdvantage(match.team1_score, match.team2_score);
    const isCompetitive = GameScorer.isCompetitiveMatch(match.team1_score, match.team2_score);

    return {
      totalGames: stats.totalGames,
      winner: match.is_finished ? stats.winner : undefined,
      isCompetitive,
      advantage,
    };
  }

  /**
   * Formata partida para exibição
   */
  static formatMatch(match: EnrichedMatch): {
    id: string;
    teams: {
      team1: { players: string[]; score: number };
      team2: { players: string[]; score: number };
    };
    status: "active" | "finished";
    winner?: number;
    scoreFormatted: string;
  } {
    return {
      id: match.id,
      teams: {
        team1: {
          players: [match.team1_player1.name, match.team1_player2?.name].filter(Boolean) as string[],
          score: match.team1_score,
        },
        team2: {
          players: [match.team2_player1.name, match.team2_player2?.name].filter(Boolean) as string[],
          score: match.team2_score,
        },
      },
      status: match.is_finished ? "finished" : "active",
      winner: match.winner,
      scoreFormatted: GameScorer.formatScore(match.team1_score, match.team2_score),
    };
  }

  /**
   * Filtra partidas por status
   */
  static filterMatchesByStatus<T extends Match>(matches: T[], status: "active" | "finished" | "all" = "all"): T[] {
    if (status === "all") return matches;

    const isFinished = status === "finished";
    return matches.filter((match) => match.is_finished === isFinished);
  }

  /**
   * Ordena partidas por data
   */
  static sortMatchesByDate<T extends Match>(matches: T[], direction: "asc" | "desc" = "desc"): T[] {
    return [...matches].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return direction === "desc" ? dateB - dateA : dateA - dateB;
    });
  }

  /**
   * Obtém partidas de um jogador específico
   */
  static getPlayerMatches<T extends Match>(matches: T[], playerId: string): T[] {
    return matches.filter((match) =>
      [match.team1_player1_id, match.team1_player2_id, match.team2_player1_id, match.team2_player2_id].includes(
        playerId
      )
    );
  }

  /**
   * Calcula estatísticas de um jogador
   */
  static calculatePlayerStats(
    matches: Match[],
    playerId: string
  ): {
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    totalGames: number;
    gamesWon: number;
    gameWinRate: number;
  } {
    const playerMatches = this.getPlayerMatches(
      matches.filter((m) => m.is_finished),
      playerId
    );

    let wins = 0;
    let gamesWon = 0;
    let totalGames = 0;

    playerMatches.forEach((match) => {
      const team1PlayerIds = [match.team1_player1_id, match.team1_player2_id];
      const isTeam1 = team1PlayerIds.includes(playerId);
      const playerScore = isTeam1 ? match.team1_score : match.team2_score;
      const opponentScore = isTeam1 ? match.team2_score : match.team1_score;

      if (playerScore > opponentScore) {
        wins++;
      }

      gamesWon += playerScore;
      totalGames += playerScore + opponentScore;
    });

    const losses = playerMatches.length - wins;
    const winRate = playerMatches.length > 0 ? (wins / playerMatches.length) * 100 : 0;
    const gameWinRate = totalGames > 0 ? (gamesWon / totalGames) * 100 : 0;

    return {
      totalMatches: playerMatches.length,
      wins,
      losses,
      winRate,
      totalGames,
      gamesWon,
      gameWinRate,
    };
  }
}
