import React from 'react';
import { NAVIGATION_TRANSITION_DELAY } from '@/config/constants';
import { useNavigate } from 'react-router-dom';

export interface NavTransitionLinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
    textColorClass?: string; // optional override for gradient/text styles
    onClick?: () => void; // extra side-effect before navigation
    disabled?: boolean;
    navLoading?: boolean; // allow external control; if omitted internal state used
    setNavLoadingExternal?: (v: boolean) => void; // external setter if controlling from parent
    showInlineSpinner?: boolean; // show the small inline spinner next to text
    showOverlaySpinner?: boolean; // show the full-screen overlay spinner
    spinnerSize?: number; // size in px for inline spinner
    preNavigateDelayMs?: number; // override delay constant if needed
    ariaLabel?: string;
}

/**
 * A navigation link button that shows an inline spinner (and optional overlay) during a short transition
 * before navigating to the target route. Useful for visually smoothing Suspense fallbacks.
 */
export const NavTransitionLink: React.FC<NavTransitionLinkProps> = ({
    to,
    children,
    className = '',
    // Default to a simple text-style button (no gradient) with underline on hover
    textColorClass = 'font-bold font-isans text-nss-600 hover:text-nss-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nss-500/40',
    onClick,
    disabled,
    navLoading: navLoadingProp,
    setNavLoadingExternal,
    showInlineSpinner = true,
    showOverlaySpinner = true,
    spinnerSize = 16,
    preNavigateDelayMs = NAVIGATION_TRANSITION_DELAY,
    ariaLabel
}) => {
    const navigate = useNavigate();
    const [internalLoading, setInternalLoading] = React.useState(false);
    const navLoading = navLoadingProp ?? internalLoading;

    const setLoading = (v: boolean) => {
        if (setNavLoadingExternal) setNavLoadingExternal(v);
        setInternalLoading(v);
    };

    const handleClick = () => {
        if (disabled || navLoading) return;
        onClick?.();
        setLoading(true);
        requestAnimationFrame(() => {
            setTimeout(() => navigate(to), preNavigateDelayMs);
        });
    };

    return (
        <>
            <button
                type="button"
                aria-label={ariaLabel}
                disabled={disabled || navLoading}
                onClick={handleClick}
                className={`relative bg-transparent p-0 inline-flex items-center transition-colors duration-150 disabled:opacity-60 ${textColorClass} ${className}`}
            >
                {showInlineSpinner && navLoading && (
                    <span
                        className="absolute -left-6 top-1/2 -translate-y-1/2 inline-flex"
                        style={{ height: spinnerSize, width: spinnerSize }}
                    >
                        <span
                            className="animate-spin rounded-full border-2 border-nss-600 border-t-transparent"
                            style={{ height: spinnerSize, width: spinnerSize }}
                        />
                    </span>
                )}
                {children}
            </button>
            {showOverlaySpinner && navLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                    <div className="h-12 w-12 rounded-full border-4 border-nss-600 border-t-transparent animate-spin" />
                </div>
            )}
        </>
    );
};

export default NavTransitionLink;
