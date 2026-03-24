export interface TourStep {
  /** CSS selector for the target element (prefer data-tour attributes) */
  target: string;
  /** Short title for the tooltip */
  title: string;
  /** 1-2 sentence description */
  description: string;
  /** Preferred placement of the tooltip relative to the target */
  placement: "top" | "bottom" | "left" | "right";
}

export interface TourConfig {
  /** Unique ID used for localStorage persistence */
  tourId: string;
  /** Ordered list of steps */
  steps: TourStep[];
}
