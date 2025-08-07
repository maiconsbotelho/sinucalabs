import Link from "next/link";

export default function HistorySection() {
  return (
    <div className="card p-[10px] mt-[32px]">
      <h2 className="text-base font-display font-bold text-retro-light mb-3 flex items-center gap-[10px]">
        <div className="w-1.5 h-1.5 bg-retro-cyan rounded-full animate-pulse"></div>
        HISTÓRICO
      </h2>

      <Link
        href="/historico"
        className="block p-[10px] rounded-lg bg-gradient-to-r from-secondary/40 to-secondary/20 border border-retro-cyan/20 hover:border-retro-cyan/50 transition-all duration-300 hover:scale-[1.02] text-center group"
      >
        <div className="font-display font-semibold text-retro-cyan group-hover:text-retro-light transition-colors text-sm">
          ACESSAR DATABASE
        </div>
        <div className="text-xs font-mono text-retro-cyan/60 mt-1 group-hover:text-retro-light/60 transition-colors">
          [View match history logs]
        </div>
      </Link>
    </div>
  );
}