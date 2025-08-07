import { ReactNode } from "react";

interface RetroCardProps {
  children: ReactNode;
  variant?: "default" | "glow" | "battle";
  className?: string;
  glowColor?: "cyan" | "pink" | "purple" | "green";
}

export default function RetroCard({
  children,
  variant = "default",
  className = "",
  glowColor = "cyan",
}: RetroCardProps) {
  const getCardClasses = () => {
    const baseClasses =
      "rounded-xl border-2 bg-gradient-to-br backdrop-blur-sm relative overflow-hidden transition-all duration-300";

    switch (variant) {
      case "glow":
        return `${baseClasses} border-retro-${glowColor}/50 from-card/80 to-card/60 hover:scale-[1.02] shadow-neon-${glowColor} hover:shadow-retro-strong`;

      case "battle":
        return `${baseClasses} border-retro-purple/30 from-card/90 to-card/70 hover:scale-[1.01] group`;

      default:
        return `${baseClasses} border-retro-purple/30 from-card/80 to-card/60 hover:scale-[1.01]`;
    }
  };

  return (
    <div className={`${getCardClasses()} ${className}`}>
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-cyan to-transparent"></div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Hover shimmer effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer pointer-events-none"></div>
    </div>
  );
}
