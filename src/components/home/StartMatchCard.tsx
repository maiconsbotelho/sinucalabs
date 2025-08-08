import Link from "next/link";
import { Users, Gamepad2 } from "lucide-react";

export default function StartMatchCard() {
  return (
    <div className="card-glow p-[10px] text-center overflow-hidden mt-[32] group">
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

        <div className="text-retro-cyan/80 text-xs font-mono mb-4 tracking-wider">[SYSTEM] Vocês estão prontos??</div>

        <Link href="/nova-partida" className="btn btn-primary w-[80%] mx-auto mt-[16px] text-base py-3">
          <Users className="w-5 h-5 mr-[5px]" />
          INICIAR PARTIDA
        </Link>
      </div>
    </div>
  );
}
