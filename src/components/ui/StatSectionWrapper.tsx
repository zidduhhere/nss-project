import { ReactNode } from 'react';

interface StatSectionWrapperProps {
    children: ReactNode;
    bgColor?: string; // Tailwind bg utility e.g. 'bg-white'
    paddingY?: string; // vertical padding e.g. 'py-24'
    paddingXInner?: string; // container horizontal padding e.g. 'px-6 lg:px-12'
    height?: string; // optional height utilities
    margin?: string; // optional margin utilities
    className?: string; // outer section extra classes
    containerClassName?: string; // inner container extras
}

export const StatSectionWrapper = ({
    children,
    bgColor = 'bg-white',
    paddingY = 'py-24',
    paddingXInner = 'px-6 lg:px-12',
    height = '',
    margin = '',
    className = '',
    containerClassName = '',
}: StatSectionWrapperProps) => {
    return (
        <section className={[paddingY, bgColor, height, margin, className].filter(Boolean).join(' ')}>
            <div className={["max-w-7xl mx-auto", paddingXInner, containerClassName].filter(Boolean).join(' ')}>
                {children}
            </div>
        </section>
    );
};

export default StatSectionWrapper;
