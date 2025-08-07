interface RetroLoadingProps {
  message?: string;
  submessage?: string;
}

export default function RetroLoading({ 
  message = "LOADING...", 
  submessage = "[System initializing...]" 
}: RetroLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Spinning Border */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-retro-cyan/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-retro-cyan animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-retro-pink/20"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-retro-pink animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
          
          {/* Center Glow */}
          <div className="absolute inset-6 rounded-full bg-retro-cyan/20 animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="font-display text-retro-cyan text-xl tracking-[0.3em] font-bold mb-2 animate-pulse">
          {message}
        </div>
        
        {/* Submessage */}
        <div className="font-mono text-retro-cyan/60 text-sm tracking-wider">
          {submessage}
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-retro-cyan rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 bg-retro-pink rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-retro-purple rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
}
