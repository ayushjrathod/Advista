import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export function MaintenanceBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 text-white py-3 px-4 relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-400" />
          <div className="text-sm md:text-base">
            <span className="font-semibold text-white">System Redesign:</span>{" "}
            <span className="text-gray-300">
              Currently redesigning the system architecture for improved scalability and performance. Some features may
              be temporarily unavailable during this enhancement phase.
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 flex-shrink-0 hover:bg-gray-800 rounded-full p-1 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
}
