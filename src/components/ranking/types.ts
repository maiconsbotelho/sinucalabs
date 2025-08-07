import { Trophy, Medal, Crown } from "lucide-react";
import { Player } from "@/core";

export interface TeamStats {
  team: {
    player1: Player;
    player2: Player;
  };
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
}

export interface RankingData {
  period: string;
  startDate: string;
  endDate: string;
  rankings: TeamStats[];
  totalGames: number;
}

export const periodConfig = {
  semana: {
    name: "da Semana",
    icon: Trophy,
    color: "retro-cyan",
    gradient: "from-retro-cyan to-retro-purple",
  },
  mes: {
    name: "do Mês",
    icon: Medal,
    color: "retro-pink",
    gradient: "from-retro-pink to-retro-cyan",
  },
  ano: {
    name: "do Ano",
    icon: Crown,
    color: "retro-purple",
    gradient: "from-retro-purple to-retro-pink",
  },
};