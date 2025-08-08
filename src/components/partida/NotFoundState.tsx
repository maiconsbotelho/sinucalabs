import Link from "next/link";
import { AlertTriangle, Home, Search } from "lucide-react";

export default function NotFoundState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-retro-purple/5 to-background relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-retro-grid bg-retro-grid opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none"></div>

      {/* Floating warning elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-retro-orange/10 rounded-full animate-float opacity-30"></div>
      <div
        className="absolute bottom-20 right-10 w-20 h-20 border border-retro-pink/10 rounded-full animate-float opacity-20"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 text-center max-w-md mx-auto p-4">
        {/* Error card */}
        <div className="relative rounded-xl border-2 border-retro-orange/50 bg-gradient-to-br from-retro-orange/10 to-card/60 backdrop-blur-sm p-8 overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-orange to-transparent"></div>

          <div className="flex flex-col items-center gap-6">
            {/* Warning icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-retro-orange bg-retro-orange/10 flex items-center justify-center animate-pulse-glow">
                <AlertTriangle className="w-10 h-10 text-retro-orange" />
              </div>

              {/* Rotating warning ring */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-retro-orange animate-spin opacity-50"></div>
            </div>

            {/* Error message */}
            <div className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-retro-orange uppercase tracking-wider mb-2">
                  404 - ERROR
                </h2>
                <div className="font-mono text-lg text-gradient-cyber uppercase tracking-wide">
                  Partida Não Encontrada
                </div>
              </div>

              <div className="font-mono text-sm text-retro-light/70 uppercase tracking-wide">
                [SYSTEM] A partida solicitada não existe ou foi removida
              </div>
            </div>

            {/* Action button */}
            <div className="pt-4">
              <Link
                href="/"
                className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-lg border-2 border-retro-cyan/50 bg-gradient-to-r from-retro-cyan/10 to-retro-purple/10 hover:from-retro-cyan/20 hover:to-retro-purple/20 hover:border-retro-cyan transition-all duration-300 hover:scale-105"
              >
                <Home className="w-5 h-5 text-retro-cyan group-hover:scale-110 transition-transform" />
                <span className="font-display font-bold text-retro-cyan uppercase tracking-wider">
                  Voltar ao Início
                </span>

                {/* Button shimmer effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-retro-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
