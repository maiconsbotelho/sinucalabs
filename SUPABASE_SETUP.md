# 🚀 Configuração do Supabase para SinucaLabs

## ✅ Status da Conexão

- **Supabase URL**: ✅ Configurado
- **API Keys**: ✅ Configurado
- **Tabela Players**: ✅ Existente com dados
- **Tabela Matches**: ❌ Precisa ser criada
- **Tabela Games**: ❌ Precisa ser criada

## 📋 Próximos Passos

### 1. Criar Tabelas Faltantes

Execute o SQL abaixo no **SQL Editor** do Supabase Dashboard:

```sql
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

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Criar políticas básicas (permitir todas as operações)
CREATE POLICY IF NOT EXISTS "Enable all operations for matches" ON public.matches FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Enable all operations for games" ON public.games FOR ALL USING (true);
```

### 2. ✅ APIs Já Configuradas

As seguintes APIs já foram migradas para usar Supabase:

- ✅ `/api/players` - Lista jogadores
- ✅ `/api/matches` - Criar/listar partidas
- ✅ `/api/historico` - Histórico básico
- ✅ `/api/test-supabase` - Teste de conexão

### 3. 🔧 APIs Ainda usando Prisma

Essas APIs precisam ser migradas:

- ❌ `/api/matches/[id]` - Detalhes da partida
- ❌ `/api/rankings/[period]` - Rankings

### 4. 🧪 Como Testar

1. **Teste a conexão**:

   ```bash
   curl http://localhost:3000/api/test-supabase
   ```

2. **Teste listagem de jogadores**:

   ```bash
   curl http://localhost:3000/api/players
   ```

3. **Teste criação de partida** (após criar tabelas):
   ```bash
   curl -X POST http://localhost:3000/api/matches \
     -H "Content-Type: application/json" \
     -d '{
       "team1Player1Id": "ID_JOGADOR_1",
       "team1Player2Id": "ID_JOGADOR_2",
       "team2Player1Id": "ID_JOGADOR_3",
       "team2Player2Id": "ID_JOGADOR_4"
     }'
   ```

### 5. 📊 Estrutura das Tabelas

#### Players (✅ Existente)

```sql
- id: uuid (PK)
- name: varchar
- created_at: timestamptz
- updated_at: timestamptz
```

#### Matches (❌ Criar)

```sql
- id: uuid (PK)
- team1_player1_id: uuid (FK → players.id)
- team1_player2_id: uuid (FK → players.id)
- team2_player1_id: uuid (FK → players.id)
- team2_player2_id: uuid (FK → players.id)
- team1_score: integer
- team2_score: integer
- is_finished: boolean
- created_at: timestamptz
- updated_at: timestamptz
```

#### Games (❌ Criar)

```sql
- id: uuid (PK)
- match_id: uuid (FK → matches.id)
- winner_id: uuid (FK → players.id)
- created_at: timestamptz
```

## 🎯 Resultado Esperado

Após executar o SQL no Supabase:

1. ✅ Nova partida funcionará completamente
2. ✅ Histórico mostrará partidas criadas
3. ✅ Sistema de jogos poderá ser implementado
4. ✅ Rankings poderão calcular estatísticas

## 🔍 Debug

Se houver problemas:

1. Verificar se as tabelas foram criadas no Supabase Dashboard
2. Verificar se as políticas RLS estão ativas
3. Testar API com curl conforme exemplos acima
4. Verificar logs no terminal do Next.js
