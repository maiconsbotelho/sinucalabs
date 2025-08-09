import { Player } from "../types/ranking";

export class TeamValidator {
  /**
   * Valida se um jogador pode ser adicionado a um time
   */
  static canAddPlayer(team: Player[], player: Player, maxSize: number = 2): boolean {
    return !team.find((p) => p.id === player.id) && team.length < maxSize;
  }

  /**
   * Adiciona ou remove um jogador de um time
   */
  static togglePlayer(team: Player[], player: Player, maxSize: number = 2): Player[] {
    const existingPlayerIndex = team.findIndex((p) => p.id === player.id);

    if (existingPlayerIndex >= 0) {
      // Remove jogador se já estiver no time
      return team.filter((p) => p.id !== player.id);
    } else if (team.length < maxSize) {
      // Adiciona jogador se o time não estiver completo
      return [...team, player];
    }

    // Retorna time inalterado se estiver cheio
    return team;
  }

  /**
   * Verifica se um time está completo
   */
  static isTeamComplete(team: Player[], requiredSize: number = 2): boolean {
    return team.length === requiredSize;
  }

  /**
   * Verifica se um jogador está em um time específico
   */
  static isPlayerInTeam(team: Player[], playerId: string): boolean {
    return team.some((p) => p.id === playerId);
  }

  /**
   * Valida se os jogadores de uma partida são válidos
   */
  static validateMatchPlayers(playerIds: string[]): void {
    // Filtra valores nulos/undefined
    const providedIds = playerIds.filter((id): id is string => Boolean(id));

    // Deve conter ou 2 (1x1) ou 4 (2x2) jogadores
    if (providedIds.length !== 2 && providedIds.length !== 4) {
      throw new Error("Selecione 2 jogadores (1x1) ou 4 jogadores (2x2)");
    }

    // Não pode haver duplicados
    const uniquePlayerIds = new Set(providedIds);
    if (uniquePlayerIds.size !== providedIds.length) {
      throw new Error("Não é possível ter jogadores duplicados");
    }
  }

  /**
   * Valida se dois times são válidos para uma partida
   */
  static validateTeamsForMatch(team1: Player[], team2: Player[]): void {
    // Verificar se ambos os times estão completos
    if (!this.isTeamComplete(team1) || !this.isTeamComplete(team2)) {
      throw new Error("Ambos os times devem ter 2 jogadores");
    }

    // Verificar se não há jogadores duplicados entre os times
    const team1Ids = team1.map((p) => p.id);
    const team2Ids = team2.map((p) => p.id);

    const duplicatedPlayers = team1Ids.filter((id) => team2Ids.includes(id));
    if (duplicatedPlayers.length > 0) {
      throw new Error("Não é possível ter o mesmo jogador em ambos os times");
    }
  }

  /**
   * Verifica se um jogador pode ser selecionado baseado no step atual
   */
  static canSelectPlayer(
    player: Player,
    currentTeam: Player[],
    opposingTeam: Player[],
    step: "team1" | "team2"
  ): boolean {
    // Não pode selecionar se jogador já está no time oposto
    if (this.isPlayerInTeam(opposingTeam, player.id)) {
      return false;
    }

    // Pode selecionar se não estiver no time atual ou se estiver mas o time não estiver cheio
    return !this.isPlayerInTeam(currentTeam, player.id) || currentTeam.length < 2;
  }

  /**
   * Obtém status de um jogador para a seleção de times
   */
  static getPlayerStatus(
    player: Player,
    team1: Player[],
    team2: Player[],
    step: "team1" | "team2"
  ): {
    selected: boolean;
    disabled: boolean;
    team?: "team1" | "team2";
  } {
    const inTeam1 = this.isPlayerInTeam(team1, player.id);
    const inTeam2 = this.isPlayerInTeam(team2, player.id);

    return {
      selected: step === "team1" ? inTeam1 : inTeam2,
      disabled: step === "team2" && inTeam1,
      team: inTeam1 ? "team1" : inTeam2 ? "team2" : undefined,
    };
  }
}
