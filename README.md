# 🎱 SinucaLabs - Retro Gaming Interface

Uma aplicação moderna com design retro futurista para gerenciamento de partidas e rankings de sinuca do laboratório.

## ✨ Características do Design

### 🎨 Tema Retro Futurista
- **Paleta de Cores**: Ciano neon, rosa pink, roxo e verde limitados
- **Tipografia**: 
  - JetBrains Mono para textos gerais
  - Orbitron para títulos e elementos de destaque
- **Efeitos Visuais**:
  - Scanlines animadas
  - Grid de fundo retro
  - Glow effects nos elementos
  - Animações de pulsação e flutuação

### 🚀 Componentes Visuais
- **Cards com Glassmorphism**: Transparência e blur effects
- **Botões com Hover**: Efeitos de shimmer e escala
- **Loading Screens**: Spinners duplos com cores neon
- **Progress Bars**: Gradientes animados com brilho
- **Interface Terminal**: Textos monospace com indicadores de sistema

### 🎮 Experiência do Usuário
- **Feedback Visual**: Animações suaves e responsivas
- **Estados Interativos**: Hover effects em todos os elementos clicáveis
- **Hierarquia Visual**: Cores e tamanhos que guiam o usuário
- **Temática Consistent**: Linguagem visual uniforme em toda aplicação

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Utilitários CSS customizados
- **Prisma** - ORM para banco de dados
- **Lucide React** - Ícones modernos
- **Supabase** - Backend como serviço

## 📱 Funcionalidades

### ⚡ Core Features
- ✅ **Nova Partida**: Interface step-by-step para seleção de times
- ✅ **Rankings**: TOP 3 por semana, mês e ano
- ✅ **Histórico**: Database visual de partidas passadas
- ✅ **Gerenciamento**: Controle de jogadores e scores

### 🎯 Interface Highlights
- **Header Dinâmico**: Com navegação e status do sistema
- **Cards Interativos**: Hover effects e animações suaves
- **Loading States**: Indicadores visuais com tema retro
- **Responsive Design**: Otimizado para mobile-first

## 🚀 Como Executar

```bash
# Clone o repositório
git clone https://github.com/maiconsbotelho/sinucalabs

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma migrate dev

# Execute o projeto
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para ver o resultado.

## 🎨 Customização Visual

### Cores Primárias
```css
--retro-cyan: 0 255 255     /* Elementos principais */
--retro-pink: 255 20 147    /* Destaques e CTAs */
--retro-purple: 138 43 226  /* Elementos secundários */
--retro-green: 50 205 50    /* Estados de sucesso */
```

### Efeitos Especiais
- **Scanlines**: Efeito de tela retrô
- **Grid Pattern**: Fundo com grade ciberpunk
- **Neon Glow**: Brilho em elementos importantes
- **Shimmer Effect**: Animação de brilho em hover

## 📁 Estrutura de Componentes

```
src/
├── app/                    # Páginas da aplicação
│   ├── page.tsx           # Homepage retro
│   ├── nova-partida/      # Fluxo de criação de partida
│   ├── ranking/           # Sistema de rankings
│   └── historico/         # Database de partidas
├── components/            # Componentes reutilizáveis
│   ├── RetroHeader.tsx    # Header com navegação
│   ├── RetroCard.tsx      # Cards com efeitos
│   └── RetroLoading.tsx   # Loading screens
└── styles/               # CSS customizado
```

## 🎮 Tema Gaming

O design foi inspirado em:
- **Jogos Arcade dos Anos 80**: Cores neon e tipografia pixelada
- **Sci-Fi Retrô**: Interfaces futuristas com estética vintage  
- **Cyberpunk**: Paleta escura com acentos luminosos
- **Terminal Hacker**: Textos monospace e indicadores de sistema

## 🔮 Próximas Melhorias

- [ ] Tema escuro/claro toggle
- [ ] Animações de transição entre páginas
- [ ] Sound effects retro
- [ ] Partículas de fundo animadas
- [ ] Modo tela cheia para apresentações

## Deploy na Vercel

A maneira mais fácil de fazer deploy é usar a [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Confira a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

---

**Desenvolvido com ❤️ e muito neon** 🌟
