import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { TourConfig, TourStep } from "./types";

interface TourContextValue {
  /** Whether the tour is currently active */
  isActive: boolean;
  /** Current step index */
  currentStep: number;
  /** Current step config */
  step: TourStep | null;
  /** Total number of steps */
  totalSteps: number;
  /** Go to next step */
  next: () => void;
  /** Go to previous step */
  prev: () => void;
  /** Skip/close the tour */
  skip: () => void;
  /** Restart the tour */
  restart: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

const STORAGE_PREFIX = "nss_onboarding_";

function getStorageKey(tourId: string) {
  return `${STORAGE_PREFIX}${tourId}_completed`;
}

interface TourProviderProps {
  config: TourConfig;
  children: ReactNode;
}

export function TourProvider({ config, children }: TourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-start on first visit (after a short delay so DOM is rendered)
  useEffect(() => {
    const key = getStorageKey(config.tourId);
    const completed = localStorage.getItem(key);
    if (!completed && config.steps.length > 0) {
      const timer = setTimeout(() => setIsActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, [config.tourId, config.steps.length]);

  const complete = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem(getStorageKey(config.tourId), "true");
  }, [config.tourId]);

  const next = useCallback(() => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      complete();
    }
  }, [currentStep, config.steps.length, complete]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const skip = useCallback(() => {
    complete();
  }, [complete]);

  const restart = useCallback(() => {
    localStorage.removeItem(getStorageKey(config.tourId));
    setCurrentStep(0);
    setIsActive(true);
  }, [config.tourId]);

  const step = isActive ? config.steps[currentStep] ?? null : null;

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        step,
        totalSteps: config.steps.length,
        next,
        prev,
        skip,
        restart,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error("useTour must be used inside <TourProvider>");
  }
  return ctx;
}
