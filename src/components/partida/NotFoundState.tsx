import Link from "next/link";

export default function NotFoundState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Partida não encontrada</p>
        <Link href="/" className="btn btn-primary mt-4">
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}