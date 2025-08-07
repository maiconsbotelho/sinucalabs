import Link from "next/link";
import { Trophy, Users, BarChart3, Zap, Target, Gamepad2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header - Compact Mobile */}
      <header className="p-3 border-b border-retro-cyan/30">
        <div className="max-w-sm mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 bg-red-500 p-2 rounded">
              <Trophy className="w-10 h-10 text-retro-cyan animate-pulse-glow" />
              <h1 className="text-xl  font-bold text-gradient-cyber ml-[10px]">SINUCA</h1>
              <p className="text-retro-cyan font-display text-sm tracking-[0.3em] ">LABS</p>
              <Zap className="w-5 h-5 text-retro-pink animate-pulse" />
            </div>
            <div className="text-retro-light/60 text-xs font-mono tracking-wider mt-1">&gt; RANKING SYSTEM v2.0</div>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-retro-cyan to-transparent mx-auto mt-1"></div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile Optimized */}
      <main className="p-3 max-w-[90%] mx-auto relative z-10 mt-[32px]">
        <div className="space-y-4 mt-4">
          {/* Start Match Button - Compact Hero */}
          <div className="card-glow p-[16px] text-center overflow-hidden mt-[32] group">
            <div className="absolute inset-0 bg-gradient-to-r from-retro-cyan/5 via-retro-pink/5 to-retro-purple/5 animate-pulse"></div>

            <div className="relative z-10">
              <div className="mb-4 relative">
                <div className="w-16 h-16 mx-auto relative z-[50]">
                  <Gamepad2 className="w-16 h-16 text-retro-cyan animate-float" />
                  <div className="absolute inset-0 w-16 h-16 text-retro-pink opacity-30 animate-pulse">
                    <Gamepad2 className="w-16 h-16" />
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-retro-cyan/10 rounded-full animate-ping"></div>
              </div>

              <h2 className="text-lg font-display font-bold text-retro-light mb-2">NOVA PARTIDA</h2>

              <div className="text-retro-cyan/80 text-xs font-mono mb-4 tracking-wider">
                [SYSTEM] Ready to initialize match...
              </div>

              <Link href="/nova-partida" className="btn btn-primary w-[80%] mx-auto mt-[16px] text-base py-3">
                <Users className="w-5 h-5" />
                INICIAR DUELO
              </Link>
            </div>
          </div>

          {/* Rankings Grid - Simplified Mobile */}
          <div className="card p-[16px] relative group mt-[32px]">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-retro-pink" />
              <h2 className="text-lg font-display font-bold text-retro-light">RANKINGS</h2>
            </div>

            <div className="space-y-2">
              <Link
                href="/ranking/semana"
                className="block p-3 rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-retro-cyan/20 hover:border-retro-cyan/50 transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-retro-cyan rounded-full animate-pulse"></div>
                    <span className="font-display font-semibold text-retro-cyan text-sm">TOP 3 SEMANA</span>
                  </div>
                  <div className="flex items-center gap-1 text-retro-cyan/60 group-hover:text-retro-cyan transition-colors">
                    <span className="text-xs font-mono">ACCESS</span>
                    <Target className="w-3 h-3" />
                  </div>
                </div>
              </Link>

              <Link
                href="/ranking/mes"
                className="block p-3 rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-retro-pink/20 hover:border-retro-pink/50 transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-retro-pink rounded-full animate-pulse"></div>
                    <span className="font-display font-semibold text-retro-pink text-sm">TOP 3 MÊS</span>
                  </div>
                  <div className="flex items-center gap-1 text-retro-pink/60 group-hover:text-retro-pink transition-colors">
                    <span className="text-xs font-mono">ACCESS</span>
                    <Target className="w-3 h-3" />
                  </div>
                </div>
              </Link>

              <Link
                href="/ranking/ano"
                className="block p-3 rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20 border border-retro-purple/20 hover:border-retro-purple/50 transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-retro-purple rounded-full animate-pulse"></div>
                    <span className="font-display font-semibold text-retro-purple text-sm">TOP 3 ANO</span>
                  </div>
                  <div className="flex items-center gap-1 text-retro-purple/60 group-hover:text-retro-purple transition-colors">
                    <span className="text-xs font-mono">ACCESS</span>
                    <Target className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Matches - Compact */}
          <div className="card p-4">
            <h2 className="text-base font-display font-bold text-retro-light mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-retro-cyan rounded-full animate-pulse"></div>
              HISTÓRICO
            </h2>

            <Link
              href="/historico"
              className="block p-3 rounded-lg bg-gradient-to-r from-secondary/40 to-secondary/20 border border-retro-cyan/20 hover:border-retro-cyan/50 transition-all duration-300 hover:scale-[1.02] text-center group"
            >
              <div className="font-display font-semibold text-retro-cyan group-hover:text-retro-light transition-colors text-sm">
                ACESSAR DATABASE
              </div>
              <div className="text-xs font-mono text-retro-cyan/60 mt-1 group-hover:text-retro-light/60 transition-colors">
                [View match history logs]
              </div>
            </Link>
          </div>

          {/* Footer Info - Minimal */}
          <div className="text-center py-3 mt-[">
            <div className="text-xs font-mono text-retro-cyan/40 tracking-wider">
              SYSTEM STATUS: ONLINE • LAB.NETWORK.ACTIVE
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-retro-cyan/30 to-transparent mx-auto mt-1"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
