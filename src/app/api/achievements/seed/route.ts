import { NextResponse } from "next/server";
import { achievementsQuery } from "@/lib/supabase";

// Seed das conquistas baseado em lista-conquistas.txt (normalizado)
const CATALOG = [
  {
    code: "indesnucavel",
    name: "Indesnucável",
    description: "Escapou de 3 snookers na mesma partida usando tabelas.",
    category: "habilidade",
  },
  {
    code: "rei_desnuque",
    name: "Rei do Desnuque",
    description: "Deu 5 snookers na mesma partida.",
    category: "habilidade",
  },
  {
    code: "gato_doido",
    name: "Gato Mais Doido",
    description: "Jogou tudo errado, mas venceu a partida.",
    category: "zueira",
  },
  {
    code: "roleta_sorte",
    name: "Roleta da Sorte",
    description: "Acertou uma bola sem mirar e ainda fez ponto.",
    category: "sorte",
  },
  {
    code: "relampago",
    name: "Relâmpago",
    description: "Ganhou uma partida em menos de 3 minutos.",
    category: "habilidade",
  },
  { code: "ceo_sinuca", name: "CEO da Sinuca", description: "Jogou 50 partidas.", category: "persistencia" },
  {
    code: "taco_destino",
    name: "Taco do Destino",
    description: "Ganhou com a última bola, na última jogada.",
    category: "habilidade",
  },
  {
    code: "mestre_tatica",
    name: "Mestre da Tática",
    description: "Eliminou só a última bola do adversário.",
    category: "habilidade",
  },
  {
    code: "nunca_erraram",
    name: "Nunca Erraram!",
    description: "Fez uma partida perfeita (sem erros).",
    category: "habilidade",
  },
  {
    code: "acabou_comigo",
    name: "Acabou Comigo",
    description: "Foi derrotado sem fazer um único ponto.",
    category: "zueira",
  },
  { code: "zerado", name: "Zerado", description: "Terminou a partida com 0 pontos.", category: "zueira" },
  { code: "combo_5x", name: "Combo 5x", description: "Acertou 5 bolas consecutivas.", category: "habilidade" },
  {
    code: "sniper",
    name: "Sniper",
    description: "Acertou uma bola impossível (ângulo quase nulo).",
    category: "habilidade",
  },
  { code: "marretao", name: "Marretão", description: "Jogou com força máxima e acertou.", category: "zueira" },
  {
    code: "tabelinha",
    name: "Tabelinha Mágica",
    description: "Acertou usando 2 ou mais tabelas.",
    category: "habilidade",
  },
  {
    code: "vira_vira",
    name: "Virada Histórica",
    description: "Estava perdendo feio e virou o jogo.",
    category: "persistencia",
  },
  { code: "campeao", name: "Campeão do Torneio", description: "Ganhou um campeonato.", category: "habilidade" },
  {
    code: "viciado",
    name: "Viciado em Sinuca",
    description: "Jogou todos os dias da semana.",
    category: "persistencia",
  },
  { code: "camaleao", name: "Camaleão", description: "Jogou com 5 skins de taco diferentes.", category: "zueira" },
  {
    code: "colecionador",
    name: "Colecionador de Insígnias",
    description: "Desbloqueou 10 conquistas.",
    category: "persistencia",
  },
  { code: "solitario", name: "Jogada Solo", description: "Jogou uma partida sozinho (modo treino).", category: "caos" },
  {
    code: "fantasma",
    name: "Fantasma da Sinuca",
    description: "Ganhou uma partida sem ser percebido.",
    category: "zueira",
  },
  { code: "zagueiro", name: "Bola na Contra", description: "Fez um ponto contra si mesmo.", category: "zueira" },
  {
    code: "palhaco",
    name: "Palhaço da Rodada",
    description: "Tentou esnucar, errou feio e caiu a própria bola.",
    category: "zueira",
  },
  {
    code: "lagartixa",
    name: "Jogada no Estilo Lagartixa",
    description: "Se deitou no chão pra mirar.",
    category: "zueira",
  },
  {
    code: "sem_choro",
    name: "Sem Choro!",
    description: "Perdeu 3 vezes seguidas sem reclamar.",
    category: "persistencia",
  },
  {
    code: "sanguenozoi",
    name: "Sangue no Zóio",
    description: "Jogou uma partida atrás da outra sem parar (>=5).",
    category: "persistencia",
  },
  {
    code: "testa_fria",
    name: "Testa Fria",
    description: "Acertou uma bola após 10 segundos parado mirando.",
    category: "habilidade",
  },
  {
    code: "zen_master",
    name: "Mestre Zen",
    description: "Ganhou uma partida sem falar nada no chat.",
    category: "zueira",
  },
  {
    code: "alquimista",
    name: "Taco de Ouro",
    description: "Ganhou 10 partidas com o mesmo taco.",
    category: "persistencia",
  },
  {
    code: "karma",
    name: "Karma Instantâneo",
    description: "Zombou de um adversário e errou a jogada seguinte.",
    category: "zueira",
  },
  {
    code: "meme_bola8",
    name: "Caiu a Bola 8 Primeiro",
    description: "Derrubou a bola 8 logo no início do jogo.",
    category: "caos",
  },
  {
    code: "espirito_olimpico",
    name: "Espírito Olímpico",
    description: "Terminou empatado e aplaudiu o adversário.",
    category: "zueira",
  },
  {
    code: "sem_dedao",
    name: "Joguei Sem o Dedão",
    description: "Ativou modo desafio aleatório e venceu.",
    category: "zueira",
  },
  { code: "tomou_capote", name: "Tomou Capote", description: "Perdeu sem fazer nenhuma bolinha.", category: "zueira" },
  {
    code: "rei_do_capote",
    name: "Rei do Capote",
    description: "Ganhou sem deixar o adversário fazer nenhuma bolinha.",
    category: "habilidade",
  },
];

export async function POST() {
  const { error } = await achievementsQuery.upsertMany(CATALOG);
  if (error) return NextResponse.json({ error: "Erro ao semear catálogo" }, { status: 500 });
  return NextResponse.json({ ok: true, count: CATALOG.length });
}
