import React from 'react';
import { User } from 'lucide-react';

/**
 * Props for the Placeholder component.
 *
 * Use this to render a lightweight visual block in place of an image/logo/avatar
 * during development or while content is loading. You can either provide fixed
 * Tailwind width/height classes (via `width`/`height`) or use one of the sizing
 * tokens via `size` for consistent dimensions.
 *
 * - width: Tailwind width class that overrides the size token (e.g., `w-48`, `w-full`).
 * - height: Tailwind height class that overrides the size token (e.g., `h-24`, `h-40`).
 * - size: Sizing token for consistent dimensions: `hero` | `avatar` | `logo` | `card` | `auto`.
 * - shadow: When true, applies a strong drop shadow (Tailwind `shadow-2xl`).
 * - variant: Visual style: `person` (user icon), `generic` (label/text), or `logo`.
 * - className: Additional Tailwind classes to append to the container.
 * - rounded: Tailwind rounding class to override the default (e.g., `rounded-xl`).
 * - label: Optional center label text; when provided, it replaces the default generic text.
 */
interface PlaceholderProps {
    width?: string;            // Tailwind width class (overrides size token)
    height?: string;           // Tailwind height class (overrides size token)
    size?: 'hero' | 'avatar' | 'logo' | 'card' | 'auto'; // Consistent sizing tokens
    shadow?: boolean;
    variant?: 'person' | 'generic' | 'logo';
    className?: string;
    rounded?: string;
    label?: string;
}

/**
 * Generic placeholder block for replacing images during development.
 *
 * Behavior
 * - If `width`/`height` are provided, they take precedence over `size`.
 * - The `variant` decides what appears inside (user icon, generic text, or logo icon).
 * - When `label` is provided, it is centered and shown instead of the default generic text.
 *
 * Examples
 * ```tsx
 * // Avatar-sized user icon with shadow
 * <Placeholder size="avatar" variant="person" shadow />
 *
 * // Custom dimensions with label for a logo spot
 * <Placeholder width="w-48" height="h-24" variant="logo" label="UNIT Logo" />
 *
 * // Full-width hero banner placeholder
 * <Placeholder size="hero" className="mb-8" />
 * ```
 */
export const Placeholder: React.FC<PlaceholderProps> = ({
    width,
    height,
    size = 'auto',
    shadow = false,
    variant = 'generic',
    className = '',
    rounded = 'rounded-2xl',
    label,
}) => {
    const sizeMap: Record<string, { w: string; h: string; rounded?: string }> = {
        hero: { w: 'w-full', h: 'h-[500px]' },
        avatar: { w: 'w-36', h: 'h-36', rounded: 'rounded-2xl' },
        logo: { w: 'w-16', h: 'h-16', rounded: 'rounded-xl' },
        card: { w: 'w-full', h: 'h-40' },
        auto: { w: 'w-full', h: 'h-40' },
    };
    const token = sizeMap[size] || sizeMap.auto;
    const finalW = width || token.w;
    const finalH = height || token.h;
    const finalRounded = rounded || token.rounded || 'rounded-2xl';
    const base = `relative flex items-center justify-center ${finalW} ${finalH} ${finalRounded} bg-nss-100 border border-nss-200 text-secondary-400 text-xs select-none overflow-hidden`;
    const withShadow = shadow ? 'shadow-2xl' : '';
    const iconColor = 'text-nss-300';

    return (
        <div className={[base, withShadow, className].join(' ')}>
            {variant === 'person' && <User className={`h-12 w-12 ${iconColor}`} strokeWidth={1.25} />}
            {variant === 'logo' && <User className={`h-10 w-10 ${iconColor}`} strokeWidth={1.25} />} {/* Adjust later for real logo placeholder */}
            {variant === 'generic' && !label && <span className="opacity-70">Image Placeholder</span>}
            {label && <span className="font-medium text-secondary-500 text-[11px] tracking-wide">{label}</span>}
        </div>
    );
};

export default Placeholder;
