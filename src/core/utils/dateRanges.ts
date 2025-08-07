import { DateRange, RankingPeriod } from "../types/ranking";

export function getWeekRange(): DateRange {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = domingo, 1 = segunda, etc.
  
  // Calcular início da semana (segunda-feira)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Calcular fim da semana (domingo)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return { startDate: startOfWeek, endDate: endOfWeek };
}

export function getMonthRange(): DateRange {
  const now = new Date();
  
  // Primeiro dia do mês
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  // Último dia do mês
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  
  return { startDate: startOfMonth, endDate: endOfMonth };
}

export function getYearRange(): DateRange {
  const now = new Date();
  
  // Primeiro dia do ano
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  
  // Último dia do ano
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);
  
  return { startDate: startOfYear, endDate: endOfYear };
}

export function getDateRangeForPeriod(period: RankingPeriod): DateRange {
  switch (period) {
    case "semana":
      return getWeekRange();
    case "mes":
      return getMonthRange();
    case "ano":
      return getYearRange();
    default:
      throw new Error(`Período inválido: ${period}`);
  }
}