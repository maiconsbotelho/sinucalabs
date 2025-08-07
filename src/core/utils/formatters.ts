/**
 * Formata data para exibição no padrão brasileiro
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

/**
 * Formata data e hora para exibição
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Formata apenas a hora
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Formata data relativa (ex: "há 2 horas", "ontem")
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 7) {
    return formatDate(date);
  } else if (diffInDays > 1) {
    return `há ${diffInDays} dias`;
  } else if (diffInDays === 1) {
    return 'ontem';
  } else if (diffInHours > 1) {
    return `há ${diffInHours} horas`;
  } else if (diffInMinutes > 1) {
    return `há ${diffInMinutes} minutos`;
  } else {
    return 'agora há pouco';
  }
}

/**
 * Formata porcentagem com casas decimais
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formata placar (ex: "3 - 2")
 */
export function formatScore(score1: number, score2: number): string {
  return `${score1} - ${score2}`;
}

/**
 * Formata record (vitórias e derrotas)
 */
export function formatRecord(wins: number, losses: number): string {
  return `${wins}V - ${losses}D`;
}

/**
 * Formata nome da dupla
 */
export function formatTeamName(player1Name: string, player2Name: string): string {
  return `${player1Name} & ${player2Name}`;
}

/**
 * Formata nome da dupla de forma abreviada
 */
export function formatTeamNameShort(player1Name: string, player2Name: string): string {
  const name1 = player1Name.split(' ')[0];
  const name2 = player2Name.split(' ')[0];
  return `${name1} & ${name2}`;
}

/**
 * Formata duração da partida
 */
export function formatMatchDuration(startDate: Date, endDate?: Date): string {
  const end = endDate || new Date();
  const diffInMs = end.getTime() - startDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours > 0) {
    const remainingMinutes = diffInMinutes % 60;
    return `${diffInHours}h ${remainingMinutes}min`;
  } else {
    return `${diffInMinutes}min`;
  }
}

/**
 * Formata número ordinal (1º, 2º, 3º...)
 */
export function formatOrdinal(position: number): string {
  return `${position}º`;
}

/**
 * Formata streak de vitórias/derrotas
 */
export function formatStreak(type: 'win' | 'loss', count: number): string {
  if (count === 0) return 'Sem sequência';
  
  const typeLabel = type === 'win' ? 'vitórias' : 'derrotas';
  return `${count} ${typeLabel} seguidas`;
}

/**
 * Formata status da partida
 */
export function formatMatchStatus(isFinished: boolean, team1Score: number, team2Score: number): string {
  if (!isFinished) {
    if (team1Score === 0 && team2Score === 0) {
      return 'Aguardando início';
    }
    return 'Em andamento';
  }
  return 'Finalizada';
}

/**
 * Formata classificação de performance
 */
export function formatPerformanceLevel(winRate: number): {
  level: string;
  label: string;
  color: string;
} {
  if (winRate >= 80) {
    return { level: 'LEGENDARY', label: 'Lendário', color: 'text-yellow-400' };
  } else if (winRate >= 70) {
    return { level: 'EXCELLENT', label: 'Excelente', color: 'text-green-400' };
  } else if (winRate >= 60) {
    return { level: 'GOOD', label: 'Bom', color: 'text-blue-400' };
  } else if (winRate >= 50) {
    return { level: 'AVERAGE', label: 'Médio', color: 'text-gray-400' };
  } else if (winRate >= 30) {
    return { level: 'BELOW_AVERAGE', label: 'Abaixo da média', color: 'text-orange-400' };
  } else {
    return { level: 'POOR', label: 'Ruim', color: 'text-red-400' };
  }
}

/**
 * Formata número com separador de milhares
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num);
}

/**
 * Formata período de ranking
 */
export function formatPeriod(period: 'semana' | 'mes' | 'ano'): string {
  const labels = {
    semana: 'da Semana',
    mes: 'do Mês',
    ano: 'do Ano'
  };
  
  return labels[period] || period;
}

/**
 * Formata vantagem de pontos
 */
export function formatAdvantage(advantage: number, isLeading: boolean): string {
  if (advantage === 0) return 'Empate';
  if (advantage === 1) return isLeading ? '+1 ponto' : '-1 ponto';
  return isLeading ? `+${advantage} pontos` : `-${advantage} pontos`;
}

/**
 * Formata momentum da partida
 */
export function formatMomentum(momentum: 'positive' | 'negative' | 'neutral', streak: number): string {
  if (momentum === 'neutral' || streak === 0) return 'Equilibrado';
  
  if (momentum === 'positive') {
    return streak === 1 ? 'Último jogo ganho' : `${streak} jogos ganhos seguidos`;
  } else {
    return streak === 1 ? 'Último jogo perdido' : `${streak} jogos perdidos seguidos`;
  }
}