import { HelpCircle } from "lucide-react";
import { useTour } from "./TourProvider";

export function TourHelpButton() {
  const { isActive, restart } = useTour();

  // Hide while the tour is running
  if (isActive) return null;

  return (
    <button
      onClick={restart}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-gray-800"
      aria-label="Restart guided tour"
    >
      <HelpCircle className="size-4" />
      <span className="hidden sm:inline">Tour</span>
    </button>
  );
}
