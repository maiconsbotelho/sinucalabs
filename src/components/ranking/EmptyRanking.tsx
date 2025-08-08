import Link from "next/link";
import { TrendingUp, Zap } from "lucide-react";

export default function EmptyRanking() {
  return (
    <div className="card-glow p-[10px] text-center">
      <TrendingUp className="w-12 h-12 mx-auto text-retro-purple/60 mb-4 animate-float" />
      <h3 className="font-display font-bold text-lg text-retro-light mb-2">NO DATA FOUND</h3>
      <p className="font-mono text-retro-light/60 text-xs mb-4 tracking-wide">
        [SYSTEM] No Partidass registradas in this period
      </p>
      <Link href="/nova-partida" className="btn btn-primary text-sm py-2">
        <Zap className="w-4 h-4 mr-2" />
        INITIATE FIRST Partidas
      </Link>
    </div>
  );
}
