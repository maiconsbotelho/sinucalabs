import { ArrowLeft, Zap, Check, Play } from "lucide-react";

interface NavigationButtonsProps {
  step: "team1" | "team2" | "confirm";
  canProceed: boolean;
  creating?: boolean;
  onNext: () => void;
  onBack: () => void;
  onCreateMatch?: () => void;
}

export default function NavigationButtons({ 
  step, 
  canProceed, 
  creating = false,
  onNext, 
  onBack, 
  onCreateMatch 
}: NavigationButtonsProps) {
  if (step === "confirm") {
    return (
      <div className="flex gap-[10px] mt-[32px]">
        <button 
          onClick={onBack} 
          className="btn btn-secondary flex-1 text-sm py-2" 
          disabled={creating}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          MODIFY
        </button>
        <button
          onClick={onCreateMatch}
          disabled={creating}
          className="btn btn-primary flex-1 disabled:opacity-50 relative overflow-hidden text-sm py-2"
        >
          {creating ? (
            <div className="flex items-center gap-[10px]">
              <div className="w-4 h-4 border-2 border-retro-dark border-t-transparent rounded-full animate-spin"></div>
              INIT...
            </div>
          ) : (
            <div className="flex items-center gap-[10px]">
              <Play className="w-4 h-4" />
              START BATTLE
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-[10px] mt-6">
      {step === "team2" && (
        <button onClick={onBack} className="btn btn-secondary flex-1 text-sm py-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2"
      >
        {step === "team1" ? (
          <>
            NEXT
            <Zap className="w-4 h-4 ml-2" />
          </>
        ) : (
          <>
            CONFIRM
            <Check className="w-4 h-4 ml-2" />
          </>
        )}
      </button>
    </div>
  );
}