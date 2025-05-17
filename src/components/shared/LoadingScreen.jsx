import { Calendar, ClockIcon } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <Calendar
            className="mr-3 h-16 w-16 text-[#3b82f6]"
            strokeWidth={1.5}
          />
          <h1 className="text-4xl font-bold text-[#1f2937]">Eventify</h1>
        </div>

        {/* Line 2: Longer loading indicator */}
        <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-gray-200">
          <div className="animate-loading-bar h-full bg-[#3b82f6]"></div>
        </div>
      </div>
    </div>
  );
};

export const IsNotReleased = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Line 1: Larger icon and name */}
        <div className="flex items-center">
          <Calendar
            className="mr-3 h-16 w-16 text-[#3b82f6]"
            strokeWidth={1.5}
          />
          <h1 className="text-4xl font-bold text-[#1f2937]">Eventify</h1>
        </div>
        <div
          className={
            'mt-10 flex flex-row items-center gap-2 border-t-2 pt-2 text-xl text-[#1f2937]'
          }
        >
          <ClockIcon className={'mr-2 h-6 w-6'} />
          <span className="font-bold text-[#3b82f6]">
            Not released yet. Come back later
          </span>
        </div>
      </div>
    </div>
  );
};
