import { TeamStats, MatchWithWinner, Player, Team } from "../types/ranking";

interface PlayersMap {
  [key: string]: Player;
}

export class RankingCalculator {
  private playersMap: PlayersMap;

  constructor(players: Player[]) {
    this.playersMap = {};
    players.forEach((player) => {
      this.playersMap[player.id] = player;
    });
  }

  /**
   * Calcula estatísticas de ranking para todas as duplas baseado nas partidas
   */
  calculateTeamRankings(matches: MatchWithWinner[]): TeamStats[] {
    const teamStatsMap: { [key: string]: TeamStats } = {};

    matches.forEach((match) => {
      // Processar dupla 1
      this.processTeamStats(
        teamStatsMap,
        match.team1_player1_id,
        match.team1_player2_id,
        match.team1_score, // vitórias da dupla 1
        match.team2_score, // derrotas da dupla 1
        match.winner_team === 1 ? 1 : 0, // partida ganha
        1 // partida jogada
      );

      // Processar dupla 2
      this.processTeamStats(
        teamStatsMap,
        match.team2_player1_id,
        match.team2_player2_id,
        match.team2_score, // vitórias da dupla 2
        match.team1_score, // derrotas da dupla 2
        match.winner_team === 2 ? 1 : 0, // partida ganha
        1 // partida jogada
      );
    });

    // Calcular win rate e ordenar
    return Object.values(teamStatsMap)
      .map((team) => this.calculateWinRate(team))
      .filter((team) => team.gamesPlayed > 0) // Só incluir duplas que jogaram
      .sort((a, b) => {
        // Ordenar por win rate, depois por jogos disputados
        if (b.winRate !== a.winRate) {
          return b.winRate - a.winRate;
        }
        return b.gamesPlayed - a.gamesPlayed;
      });
  }

  /**
   * Processa estatísticas de uma dupla específica
   */
  private processTeamStats(
    statsMap: { [key: string]: TeamStats },
    player1Id: string,
    player2Id: string,
    wins: number,
    losses: number,
    matchWins: number,
    matchesPlayed: number
  ): void {
    // Criar chave única para a dupla (sempre na mesma ordem)
    const teamKey = this.createTeamKey(player1Id, player2Id);
    
    const player1 = this.playersMap[player1Id];
    const player2 = this.playersMap[player2Id];

    if (!player1 || !player2) {
      console.warn(`Jogadores não encontrados: ${player1Id}, ${player2Id}`);
      return;
    }

    if (!statsMap[teamKey]) {
      statsMap[teamKey] = {
        team: { player1, player2 },
        wins: 0,
        losses: 0,
        gamesPlayed: 0,
        winRate: 0,
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
      };
    }

    const stats = statsMap[teamKey];
    stats.wins += wins;
    stats.losses += losses;
    stats.gamesPlayed += wins + losses;
    stats.matchesPlayed += matchesPlayed;
    stats.matchesWon += matchWins;
    stats.matchesLost += matchesPlayed - matchWins;
  }

  /**
   * Cria uma chave única para dupla (sempre na mesma ordem)
   */
  private createTeamKey(player1Id: string, player2Id: string): string {
    const sortedIds = [player1Id, player2Id].sort();
    return `${sortedIds[0]}-${sortedIds[1]}`;
  }

  /**
   * Calcula a taxa de vitória baseada em jogos individuais
   */
  private calculateWinRate(team: TeamStats): TeamStats {
    return {
      ...team,
      winRate: team.gamesPlayed > 0 ? (team.wins / team.gamesPlayed) * 100 : 0,
    };
  }

  /**
   * Filtra top N duplas do ranking
   */
  static getTopTeams(rankings: TeamStats[], limit: number = 10): TeamStats[] {
    return rankings.slice(0, limit);
  }

  /**
   * Busca posição específica de uma dupla no ranking
   */
  static findTeamRank(rankings: TeamStats[], player1Id: string, player2Id: string): number | null {
    const teamKey1 = `${player1Id}-${player2Id}`;
    const teamKey2 = `${player2Id}-${player1Id}`;
    
    const position = rankings.findIndex((stats) => {
      const currentKey = `${stats.team.player1.id}-${stats.team.player2.id}`;
      return currentKey === teamKey1 || currentKey === teamKey2;
    });

    return position >= 0 ? position + 1 : null;
  }

  /**
   * Calcula estatísticas resumidas do período
   */
  static calculatePeriodSummary(rankings: TeamStats[]): {
    totalTeams: number;
    totalGames: number;
    totalMatches: number;
    avgWinRate: number;
  } {
    const totalTeams = rankings.length;
    const totalGames = rankings.reduce((sum, team) => sum + team.gamesPlayed, 0);
    const totalMatches = rankings.reduce((sum, team) => sum + team.matchesPlayed, 0);
    const avgWinRate = totalTeams > 0 
      ? rankings.reduce((sum, team) => sum + team.winRate, 0) / totalTeams 
      : 0;

    return {
      totalTeams,
      totalGames,
      totalMatches,
      avgWinRate,
    };
  }
}