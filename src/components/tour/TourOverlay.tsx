import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTour } from "./TourProvider";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 8;
const ARROW_SIZE = 8;

/**
 * Computes tooltip position relative to the target rect.
 * Falls back to "bottom" if the preferred placement doesn't fit.
 */
function computePosition(
  targetRect: Rect,
  tooltipWidth: number,
  tooltipHeight: number,
  preferred: "top" | "bottom" | "left" | "right"
) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const positions = {
    bottom: {
      top: targetRect.top + targetRect.height + PADDING + ARROW_SIZE,
      left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
    },
    top: {
      top: targetRect.top - tooltipHeight - PADDING - ARROW_SIZE,
      left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
    },
    right: {
      top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
      left: targetRect.left + targetRect.width + PADDING + ARROW_SIZE,
    },
    left: {
      top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
      left: targetRect.left - tooltipWidth - PADDING - ARROW_SIZE,
    },
  };

  // Check if preferred placement fits
  const pos = positions[preferred];
  const fits =
    pos.top >= 0 &&
    pos.left >= 0 &&
    pos.top + tooltipHeight <= vh &&
    pos.left + tooltipWidth <= vw;

  if (fits) return { placement: preferred, ...pos };

  // Fallback order
  const order: Array<"bottom" | "top" | "right" | "left"> = [
    "bottom",
    "top",
    "right",
    "left",
  ];
  for (const dir of order) {
    const p = positions[dir];
    if (
      p.top >= 0 &&
      p.left >= 0 &&
      p.top + tooltipHeight <= vh &&
      p.left + tooltipWidth <= vw
    ) {
      return { placement: dir, ...p };
    }
  }

  // If nothing fits, clamp bottom
  return {
    placement: "bottom" as const,
    top: Math.min(Math.max(0, positions.bottom.top), vh - tooltipHeight - 8),
    left: Math.min(Math.max(8, positions.bottom.left), vw - tooltipWidth - 8),
  };
}

function ArrowSvg({
  placement,
}: {
  placement: "top" | "bottom" | "left" | "right";
}) {
  const base = "absolute size-4 text-gray-900";
  switch (placement) {
    case "bottom":
      return (
        <div className={cn(base, "-top-2 left-1/2 -translate-x-1/2")}>
          <svg viewBox="0 0 16 8" fill="currentColor">
            <path d="M0 8L8 0l8 8H0z" />
          </svg>
        </div>
      );
    case "top":
      return (
        <div className={cn(base, "-bottom-2 left-1/2 -translate-x-1/2 rotate-180")}>
          <svg viewBox="0 0 16 8" fill="currentColor">
            <path d="M0 8L8 0l8 8H0z" />
          </svg>
        </div>
      );
    case "left":
      return (
        <div className={cn(base, "-right-2 top-1/2 -translate-y-1/2 rotate-90")}>
          <svg viewBox="0 0 16 8" fill="currentColor">
            <path d="M0 8L8 0l8 8H0z" />
          </svg>
        </div>
      );
    case "right":
      return (
        <div className={cn(base, "-left-2 top-1/2 -translate-y-1/2 -rotate-90")}>
          <svg viewBox="0 0 16 8" fill="currentColor">
            <path d="M0 8L8 0l8 8H0z" />
          </svg>
        </div>
      );
  }
}

export function TourOverlay() {
  const { isActive, step, currentStep, totalSteps, next, prev, skip } =
    useTour();
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
    placement: "top" | "bottom" | "left" | "right";
  } | null>(null);

  const updatePosition = useCallback(() => {
    if (!step) return;

    const el = document.querySelector(step.target);
    if (!el) {
      // Target not found, skip to next
      setTargetRect(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });

    // Scroll into view if needed
    const inView =
      rect.top >= 0 &&
      rect.bottom <= window.innerHeight;
    if (!inView) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [step]);

  // Recalc on step change
  useEffect(() => {
    if (!isActive || !step) return;
    // Small delay for scroll/render
    const timer = setTimeout(updatePosition, 100);
    return () => clearTimeout(timer);
  }, [isActive, step, updatePosition]);

  // Recalc on resize/scroll
  useEffect(() => {
    if (!isActive) return;
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isActive, updatePosition]);

  // Position tooltip after target rect is known
  useEffect(() => {
    if (!targetRect || !tooltipRef.current || !step) return;
    const ttRect = tooltipRef.current.getBoundingClientRect();
    const pos = computePosition(
      targetRect,
      ttRect.width,
      ttRect.height,
      step.placement
    );
    setTooltipPos(pos);
  }, [targetRect, step]);

  // Keyboard: Escape to skip, ArrowRight/Enter to next, ArrowLeft to prev
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isActive, next, prev, skip]);

  if (!isActive || !step) return null;

  const isLast = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      aria-live="polite"
      role="dialog"
      aria-label="Guided tour"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={skip}
      />

      {/* Spotlight cutout */}
      {targetRect && (
        <div
          className="absolute rounded-lg"
          style={{
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={cn(
          "absolute z-50 w-80 rounded-xl bg-gray-900 p-5 text-white shadow-lg",
          !tooltipPos && "opacity-0"
        )}
        style={
          tooltipPos
            ? { top: tooltipPos.top, left: tooltipPos.left }
            : { top: 0, left: 0 }
        }
      >
        {tooltipPos && <ArrowSvg placement={tooltipPos.placement} />}

        {/* Close button */}
        <button
          onClick={skip}
          className="absolute top-3 right-3 rounded-full p-1 text-gray-400 hover:text-white hover:bg-white/10"
          aria-label="Close tour"
        >
          <X className="size-4" />
        </button>

        {/* Content */}
        <h3 className="text-sm font-semibold text-balance mb-1.5 pr-6">
          {step.title}
        </h3>
        <p className="text-sm text-gray-300 text-pretty leading-relaxed">
          {step.description}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          {/* Step indicator */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "size-1.5 rounded-full",
                  i === currentStep ? "bg-white" : "bg-white/30"
                )}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={prev}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="size-3.5" />
                Back
              </button>
            )}
            <button
              onClick={next}
              className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-100"
            >
              {isLast ? "Done" : "Next"}
              {!isLast && <ChevronRight className="size-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
