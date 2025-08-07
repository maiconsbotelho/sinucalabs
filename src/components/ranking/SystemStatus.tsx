export default function SystemStatus() {
  return (
    <div className="text-center py-3">
      <div className="font-mono text-xs text-retro-cyan/40 tracking-wider">
        RANKING.SYSTEM.ONLINE • LAST_UPDATE: {new Date().toLocaleTimeString()}
      </div>
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-retro-cyan/30 to-transparent mx-auto mt-1"></div>
    </div>
  );
}