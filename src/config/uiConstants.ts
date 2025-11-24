// Centralized UI styling & timing constants
// Consolidate repeated Tailwind class strings / numeric UI config here.

// Transition / timing
export const NAVIGATION_TRANSITION_DELAY = 350; // ms

// Text color utility presets
export const TEXT_LINK_PRIMARY =
  "font-bold font-isans text-nss-600 hover:text-nss-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nss-500/40";
export const TEXT_LINK_SECONDARY =
  "font-medium text-nss-600 hover:text-nss-700 hover:underline";
export const TEXT_SUBTLE = "text-nss-600";

// Button variants (mirrors Button.tsx mapping; keep in sync if refactoring)
export const BTN_VARIANT_PRIMARY =
  "bg-gradient-to-r from-nss-600 to-nss-700 text-white hover:from-nss-700 hover:to-nss-800 focus-visible:ring-nss-500/40";
export const BTN_VARIANT_SECONDARY =
  "bg-white border-2 border-nss-500 text-nss-600 hover:bg-nss-50";
export const BTN_VARIANT_GHOST = "bg-transparent text-nss-600 hover:bg-nss-50";

// Spinner classes
export const INLINE_SPINNER_CLASS =
  "animate-spin rounded-full border-2 border-nss-600 border-t-transparent";
export const OVERLAY_SPINNER_CLASS =
  "h-12 w-12 rounded-full border-4 border-nss-600 border-t-transparent animate-spin";

// Misc elements
export const STAT_DESCRIPTION_TEXT = "text-xs text-nss-600 mt-1";
export const CTA_BUTTON_CLASS =
  "px-6 py-3 rounded-full bg-white text-nss-600 font-semibold text-sm hover:bg-gray-100 transition";
