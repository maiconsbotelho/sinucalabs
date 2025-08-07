import { formatDate } from "@/lib/utils";

interface PeriodInfoProps {
  startDate: string;
  endDate: string;
}

export default function PeriodInfo({ startDate, endDate }: PeriodInfoProps) {
  return (
    <div className="card p-[10px] text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-retro-cyan/5 via-retro-pink/5 to-retro-purple/5 animate-pulse"></div>
      <div className="relative z-10">
        <div className="font-display text-base font-bold text-retro-light mb-2">BATTLE PERIOD</div>
        <div className="font-mono text-xs text-retro-cyan/80 tracking-wider">
          {formatDate(new Date(startDate))} → {formatDate(new Date(endDate))}
        </div>
      </div>
    </div>
  );
}