import { Loader, Zap } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-retro-purple/5 to-background relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-retro-grid bg-retro-grid opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-retro-cyan/10 rounded-full animate-float opacity-30"></div>
      <div
        className="absolute bottom-20 right-10 w-20 h-20 border border-retro-pink/10 rounded-full animate-float opacity-20"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 text-center">
        {/* Main loading card */}
        <div className="relative rounded-xl border-2 border-retro-cyan/30 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm p-8 overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-cyan to-transparent"></div>

          <div className="flex flex-col items-center gap-6">
            {/* Loading spinner with glow */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-retro-cyan/20 border-t-retro-cyan rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-retro-pink rounded-full animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "3s" }}
              ></div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-6 h-6 text-retro-cyan animate-pulse" />
              </div>
            </div>

            {/* Loading text */}
            <div className="space-y-3">
              <h2 className="font-display font-bold text-xl text-gradient-cyber uppercase tracking-wider">
                Carregando Partida
              </h2>
              <div className="font-mono text-sm text-retro-light/70 uppercase tracking-wide">
                [SYSTEM] Sincronizando dados...
              </div>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1 mt-4">
                <div className="w-2 h-2 bg-retro-cyan rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-retro-pink rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-retro-purple rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
