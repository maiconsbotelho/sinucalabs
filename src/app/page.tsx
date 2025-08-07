import Link from "next/link";
import { Trophy, Users, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center text-primary flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            SinucaLabs
          </h1>
          <p className="text-center text-muted-foreground text-sm mt-1">
            Ranking de Sinuca do Laboratório
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-md mx-auto">
        <div className="space-y-6 mt-8">
          {/* Start Match Button */}
          <div className="card p-6 text-center">
            <div className="mb-4">
              <Users className="w-12 h-12 mx-auto text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nova Partida</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Inicie uma nova partida entre duplas
            </p>
            <Link href="/nova-partida" className="btn btn-primary w-full">
              Iniciar Partida
            </Link>
          </div>

          {/* Rankings */}
          <div className="card p-6">
            <div className="mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold mb-4">Rankings</h2>
            <div className="space-y-3">
              <Link 
                href="/ranking/semana" 
                className="block p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">🏆 TOP 3 da Semana</span>
                  <span className="text-xs text-muted-foreground">Ver →</span>
                </div>
              </Link>
              
              <Link 
                href="/ranking/mes" 
                className="block p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">🥇 TOP 3 do Mês</span>
                  <span className="text-xs text-muted-foreground">Ver →</span>
                </div>
              </Link>
              
              <Link 
                href="/ranking/ano" 
                className="block p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">👑 TOP 3 do Ano</span>
                  <span className="text-xs text-muted-foreground">Ver →</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Partidas Recentes</h2>
            <Link 
              href="/historico" 
              className="block p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-center"
            >
              <span className="font-medium">Ver Histórico Completo</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
