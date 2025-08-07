import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface RetroHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  showBackButton?: boolean;
  backHref?: string;
}

export default function RetroHeader({
  title,
  subtitle,
  icon: Icon,
  showBackButton = false,
  backHref = "/",
}: RetroHeaderProps) {
  return (
    <header className="p-4 border-b border-retro-cyan/30 relative">
      <div className="max-w-md mx-auto flex items-center gap-4 relative z-10">
        {showBackButton && (
          <Link
            href={backHref}
            className="p-3 rounded-lg border border-retro-cyan/30 hover:border-retro-cyan hover:bg-retro-cyan/10 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 text-retro-cyan group-hover:scale-110 transition-transform" />
          </Link>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-8 h-8 text-retro-cyan animate-float" />}
            <div>
              <h1 className="text-xl font-display font-bold text-retro-cyan">{title}</h1>
              {subtitle && <div className="font-mono text-sm text-retro-light/60">{subtitle}</div>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
