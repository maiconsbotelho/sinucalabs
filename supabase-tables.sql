-- Script SQL para criar tabelas no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela de jogadores
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de partidas
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team1_player1_id UUID REFERENCES players(id),
  team1_player2_id UUID REFERENCES players(id),
  team2_player1_id UUID REFERENCES players(id),
  team2_player2_id UUID REFERENCES players(id),
  team1_score INTEGER DEFAULT 0,
  team2_score INTEGER DEFAULT 0,
  is_finished BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de jogos
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES players(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir jogadores reais
INSERT INTO players (name) VALUES
  ('Maicão Marreta'),
  ('Johnny do Boteco'),
  ('Dief o Filosofo'),
  ('Osi o Sábio'),
  ('Henrique Sai da Frente'),
  ('Bryan o Estagiário'),
  ('Alison Parsa'),
  ('Cesar o Profissional'),
  ('Juan do Basquete')
ON CONFLICT (name) DO NOTHING;

-- Habilitar RLS (Row Level Security)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (permitir todas as operações)
DROP POLICY IF EXISTS "Allow all operations on players" ON players;
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on matches" ON matches;
CREATE POLICY "Allow all operations on matches" ON matches FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on games" ON games;
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);

-- Verificar se as tabelas foram criadas
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT COUNT(*) as total_players FROM players;
SELECT name FROM players ORDER BY name;