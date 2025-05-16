import { CheckCircle2 } from 'lucide-react';

export default function EventProgressIndicator({ currentStage, totalStages }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {Array.from({ length: totalStages }, (_, i) => i + 1).map((stage) => (
          <div
            key={stage}
            className={`flex flex-col items-center ${stage <= currentStage ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10 ${
                stage < currentStage
                  ? 'border-primary bg-primary text-white'
                  : stage === currentStage
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground'
              }`}
            >
              {stage < currentStage ? (
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <span className="text-xs sm:text-sm">{stage}</span>
              )}
            </div>
            <span className="mt-1 text-center text-[10px] font-medium sm:mt-2 sm:text-xs">
              {stage === 1 && 'Basic Info'}
              {stage === 2 && 'Date & Time'}
              {stage === 3 && 'Location'}
              {stage === 4 && 'Organizer'}
              {stage === 5 && 'Images'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="bg-muted absolute top-0 h-1 w-full"></div>
        <div
          className="bg-primary absolute top-0 h-1 transition-all duration-300"
          style={{
            width: `${((currentStage - 1) / (totalStages - 1)) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
