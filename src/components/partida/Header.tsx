import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Game {
  id: string;
  gameNumber: number;
  winner: { id: string; name: string };
  createdAt: string;
}

interface HeaderProps {
  gamesCount: number;
}

export default function Header({ gamesCount }: HeaderProps) {
  return (
    <header className="p-4 border-b border-border">
      <div className="max-w-md mx-auto flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-secondary/50 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-primary">Partida em Andamento</h1>
          <p className="text-sm text-muted-foreground">
            {gamesCount} jogo{gamesCount !== 1 ? "s" : ""} disputado{gamesCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </header>
  );
}