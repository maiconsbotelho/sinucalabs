export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-retro-cyan border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <div className="font-display text-retro-cyan text-lg tracking-wider">LOADING PLAYERS...</div>
        <div className="font-mono text-retro-cyan/60 text-sm mt-2">[Accessing database...]</div>
      </div>
    </div>
  );
}