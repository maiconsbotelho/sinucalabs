-- SQL para criar as tabelas matches e games no Supabase

-- Criar tabela matches
CREATE TABLE IF NOT EXISTS public.matches (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    team1_player1_id uuid REFERENCES public.players(id) NOT NULL,
    team1_player2_id uuid REFERENCES public.players(id) NOT NULL,
    team2_player1_id uuid REFERENCES public.players(id) NOT NULL,
    team2_player2_id uuid REFERENCES public.players(id) NOT NULL,
    team1_score integer DEFAULT 0 NOT NULL,
    team2_score integer DEFAULT 0 NOT NULL,
    is_finished boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Criar tabela games
CREATE TABLE IF NOT EXISTS public.games (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id uuid REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    winner_id uuid REFERENCES public.players(id) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON public.matches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_games_match_id ON public.games(match_id);
CREATE INDEX IF NOT EXISTS idx_games_winner_id ON public.games(winner_id);

-- Habilitar RLS (Row Level Security) se necessário
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Criar políticas básicas (permitir tudo por enquanto)
-- Primeiro remover políticas existentes se houver
DROP POLICY IF EXISTS "Enable all operations for matches" ON public.matches;
DROP POLICY IF EXISTS "Enable all operations for games" ON public.games;

-- Criar as políticas
CREATE POLICY "Enable all operations for matches" ON public.matches FOR ALL USING (true);
CREATE POLICY "Enable all operations for games" ON public.games FOR ALL USING (true);
