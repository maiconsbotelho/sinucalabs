import Link from "next/link";
import { Trophy, Users, BarChart3, Zap, Target, Gamepad2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="p-4 border-b border-retro-cyan/30 relative">
        <div className="max-w-md lg:max-w-lg xl:max-w-xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-2">
              <div className="relative">
                <Trophy className="w-8 h-8 text-retro-cyan animate-pulse-glow" />
                <div className="absolute inset-0 w-8 h-8 text-retro-cyan animate-ping opacity-20">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-retro-cyan via-retro-pink to-retro-purple bg-clip-text text-transparent">
                SINUCA
              </h1>
              <Zap className="w-6 h-6 text-retro-pink animate-pulse" />
            </div>
            <div className="text-retro-cyan font-display text-base sm:text-lg lg:text-xl tracking-[0.3em] mb-1">
              LABS
            </div>
            <div className="text-retro-light/60 text-sm font-mono tracking-wider">&gt; RANKING SYSTEM v2.0</div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-retro-cyan to-transparent mx-auto mt-2"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-md lg:max-w-lg xl:max-w-xl mx-auto relative z-10">
        <div className="space-y-6 mt-8">
          {/* Start Match Button - Hero */}
          <div className="card-glow p-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-retro-cyan/5 via-retro-pink/5 to-retro-purple/5 animate-pulse"></div>

            <div className="relative z-10">
              <div className="mb-6 relative">
                <div className="w-20 h-20 mx-auto relative">
                  <Gamepad2 className="w-20 h-20 text-retro-cyan animate-float" />
                  <div className="absolute inset-0 w-20 h-20 text-retro-pink opacity-30 animate-pulse">
                    <Gamepad2 className="w-20 h-20" />
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-retro-cyan/10 rounded-full animate-ping"></div>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-retro-light mb-2">
                NOVA PARTIDA
              </h2>

              <div className="text-retro-cyan/80 text-sm font-mono mb-6 tracking-wider">
                [SYSTEM] Ready to initialize match...
              </div>

              <Link href="/nova-partida" className="btn btn-primary w-full text-lg py-4">
                <Users className="w-6 h-6 mr-2" />
                INICIAR DUELO
              </Link>
            </div>
          </div>

          {/* Rankings Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="card p-6 relative group">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-retro-pink" />
                <h2 className="text-xl font-display font-bold text-retro-light">RANKINGS</h2>
              </div>

              <div className="space-y-3">
                <Link
                  href="/ranking/semana"
                  className="block p-4 rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-retro-cyan/20 hover:border-retro-cyan/50 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-retro-cyan rounded-full animate-pulse"></div>
                      <span className="font-display font-semibold text-retro-cyan">TOP 3 SEMANA</span>
                    </div>
                    <div className="flex items-center gap-2 text-retro-cyan/60 group-hover:text-retro-cyan transition-colors">
                      <span className="text-xs font-mono">ACCESS</span>
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                </Link>

                <Link
                  href="/ranking/mes"
                  className="block p-4 rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-retro-pink/20 hover:border-retro-pink/50 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-retro-pink rounded-full animate-pulse"></div>
                      <span className="font-display font-semibold text-retro-pink">TOP 3 MÊS</span>
                    </div>
                    <div className="flex items-center gap-2 text-retro-pink/60 group-hover:text-retro-pink transition-colors">
                      <span className="text-xs font-mono">ACCESS</span>
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                </Link>

                <Link
                  href="/ranking/ano"
                  className="block p-4 rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-retro-purple/20 hover:border-retro-purple/50 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-retro-purple rounded-full animate-pulse"></div>
                      <span className="font-display font-semibold text-retro-purple">TOP 3 ANO</span>
                    </div>
                    <div className="flex items-center gap-2 text-retro-purple/60 group-hover:text-retro-purple transition-colors">
                      <span className="text-xs font-mono">ACCESS</span>
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="card p-6">
            <h2 className="text-lg font-display font-bold text-retro-light mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-retro-cyan rounded-full animate-pulse"></div>
              HISTÓRICO
            </h2>

            <Link
              href="/historico"
              className="block p-4 rounded-lg bg-gradient-to-r from-secondary/40 to-secondary/20 border border-retro-cyan/20 hover:border-retro-cyan/50 transition-all duration-300 hover:scale-[1.02] text-center group"
            >
              <div className="font-display font-semibold text-retro-cyan group-hover:text-retro-light transition-colors">
                ACESSAR DATABASE
              </div>
              <div className="text-xs font-mono text-retro-cyan/60 mt-1 group-hover:text-retro-light/60 transition-colors">
                [View match history logs]
              </div>
            </Link>
          </div>

          {/* Footer Info */}
          <div className="text-center py-4">
            <div className="text-xs font-mono text-retro-cyan/40 tracking-wider">
              SYSTEM STATUS: ONLINE • LAB.NETWORK.ACTIVE
            </div>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-retro-cyan/30 to-transparent mx-auto mt-2"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
