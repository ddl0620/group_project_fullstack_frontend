import { Calendar } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Line 1: Larger icon and name */}
        <div className="flex items-center">
          <Calendar className="w-16 h-16 text-[#3b82f6] mr-3" strokeWidth={1.5} />
          <h1 className="text-4xl font-bold text-[#1f2937]">Eventify</h1>
        </div>

        {/* Line 2: Longer loading indicator */}
        <div className="mt-6 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#3b82f6] animate-loading-bar"></div>
        </div>
      </div>
    </div>
  )
}
