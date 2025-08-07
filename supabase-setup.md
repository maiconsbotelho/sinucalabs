# Configuração do Supabase para SinucaLabs

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Defina:
   - **Name**: SinucaLabs
   - **Database Password**: (escolha uma senha forte)
   - **Region**: South America (São Paulo)
6. Clique em "Create new project"

## 2. Configurar Variáveis de Ambiente

Após criar o projeto, vá em **Settings > API** e copie:

```env
# Substitua no arquivo .env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

## 3. Criar Tabelas no Supabase

Vá em **SQL Editor** e execute:

```sql
-- Criar tabela de jogadores
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de partidas
CREATE TABLE matches (
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
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES players(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir jogadores iniciais
INSERT INTO players (name) VALUES
  ('João Silva'),
  ('Maria Santos'),
  ('Pedro Oliveira'),
  ('Ana Costa'),
  ('Carlos Ferreira'),
  ('Lucia Rodrigues'),
  ('Rafael Lima'),
  ('Fernanda Alves'),
  ('Bruno Martins');

-- Habilitar RLS (Row Level Security)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (permitir leitura e escrita para todos)
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on matches" ON matches FOR ALL USING (true);
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);
```

## 4. Atualizar Prisma Schema

Para usar Supabase com Prisma, atualize o `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Player {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relacionamentos
  team1Player1Matches Match[] @relation("Team1Player1")
  team1Player2Matches Match[] @relation("Team1Player2")
  team2Player1Matches Match[] @relation("Team2Player1")
  team2Player2Matches Match[] @relation("Team2Player2")
  wonGames           Game[]

  @@map("players")
}

model Match {
  id             String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  team1Player1Id String   @map("team1_player1_id") @db.Uuid
  team1Player2Id String   @map("team1_player2_id") @db.Uuid
  team2Player1Id String   @map("team2_player1_id") @db.Uuid
  team2Player2Id String   @map("team2_player2_id") @db.Uuid
  team1Score     Int      @default(0) @map("team1_score")
  team2Score     Int      @default(0) @map("team2_score")
  isFinished     Boolean  @default(false) @map("is_finished")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  // Relacionamentos
  team1Player1 Player @relation("Team1Player1", fields: [team1Player1Id], references: [id])
  team1Player2 Player @relation("Team1Player2", fields: [team1Player2Id], references: [id])
  team2Player1 Player @relation("Team2Player1", fields: [team2Player1Id], references: [id])
  team2Player2 Player @relation("Team2Player2", fields: [team2Player2Id], references: [id])
  games        Game[]

  @@map("matches")
}

model Game {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  matchId   String   @map("match_id") @db.Uuid
  winnerId  String   @map("winner_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")

  // Relacionamentos
  match  Match  @relation(fields: [matchId], references: [id], onDelete: Cascade)
  winner Player @relation(fields: [winnerId], references: [id])

  @@map("games")
}
```

## 5. Atualizar .env

```env
# Supabase Database URL (substitua pelos seus dados)
DATABASE_URL="postgresql://postgres:[SUA_SENHA]@db.[SEU_PROJETO].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[SUA_SENHA]@db.[SEU_PROJETO].supabase.co:5432/postgres"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL=https://[SEU_PROJETO].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SUA_SERVICE_ROLE_KEY]
```

## 6. Comandos para Migração

```bash
# Gerar nova migração
npx prisma migrate dev --name supabase_migration

# Gerar cliente Prisma
npx prisma generate

# Fazer seed dos dados
npm run db:seed
```

## 7. Funcionalidades Adicionais do Supabase

### Autenticação (Opcional)
```typescript
// src/lib/auth.ts
import { supabase } from './supabase'

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}
```

### Realtime (Opcional)
```typescript
// Escutar mudanças em tempo real
supabase
  .channel('matches')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'matches' },
    (payload) => {
      console.log('Match updated:', payload)
      // Atualizar estado da aplicação
    }
  )
  .subscribe()
```

## 8. Vantagens do Supabase

- ✅ **Banco PostgreSQL gerenciado**
- ✅ **API REST automática**
- ✅ **Autenticação integrada**
- ✅ **Realtime subscriptions**
- ✅ **Dashboard administrativo**
- ✅ **Backup automático**
- ✅ **Escalabilidade**
- ✅ **SSL/TLS por padrão**