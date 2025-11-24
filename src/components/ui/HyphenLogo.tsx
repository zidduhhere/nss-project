interface HyphenLogoProps {
    variant?: 'light' | 'dark';
    className?: string;
}

/**
 * HyphenLogo Component
 * 
 * A branded attribution component with two variants:
 * - dark: For use on dark backgrounds (default)
 * - light: For use on white/light backgrounds
 * 
 * @param {string} variant - 'light' or 'dark' (default: 'dark')
 * @param {string} className - Additional CSS classes for the container
 */
export default function HyphenLogo({ variant = 'dark', className = '' }: HyphenLogoProps) {
    const isDark = variant === 'dark';
    
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <p className={`font-isans text-sm ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                Designed and developed by
            </p>
            {/* Glass container wrapping both H and Hyphen */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-md ${
                isDark 
                    ? 'bg-white/10 border border-white/20 shadow-lg' 
                    : 'bg-gray-900/5 border border-gray-900/10 shadow-md'
            }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isDark 
                        ? 'bg-white/20' 
                        : 'bg-gray-900/10'
                }`}>
                    <span className={`text-xs font-bold font-isans ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        H
                    </span>
                </div>
                <span className={`font-isans font-semibold text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                    Hyphen
                </span>
            </div>
        </div>
    );
}
