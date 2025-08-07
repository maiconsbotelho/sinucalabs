import Link from "next/link";

export default function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-display text-retro-pink text-xl mb-4">ERROR 404</div>
        <div className="font-mono text-retro-light/60 mb-6">Ranking data not found</div>
        <Link href="/" className="btn btn-primary">
          RETURN HOME
        </Link>
      </div>
    </div>
  );
}