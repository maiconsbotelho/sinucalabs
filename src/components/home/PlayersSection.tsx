import Link from "next/link";
import { Users, UserPlus } from "lucide-react";

export default function PlayersSection() {
  return (
    <div className="card p-[10px] relative group mt-[20px]">
      <Link
        href="/jogadores"
        className="block p-[10px] rounded-lg bg-gradient-to-r from-secondary/30 to-secondary/20  hover:border-retro-cyan/50 transition-all duration-300 hover:scale-[1.02] group"
      >
        <div className="flex items-center gap-[10px] mb-4">
          <Users className="w-6 h-6 text-retro-cyan" />
          <h2 className="text-lg font-display font-bold text-retro-light"> GERENCIAR JOGADORES</h2>
        </div>
      </Link>
    </div>
  );
}
