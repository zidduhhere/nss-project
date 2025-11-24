import React, { ReactNode, useState } from 'react';
import { ListTileCardWithIcon } from './ListTileCardWithIcon';

export interface FlowStep {
    title: string;
    description: string;
    icon: ReactNode;
    iconBackground?: string;
    cardClassName?: string;
}

export interface FlowDiagramProps {
    steps: FlowStep[];
    className?: string;
    height?: number;
    cardWidth?: number;
    alternateYOffset?: number;
    lineColor?: string;
    lineWidth?: number;
    lineDash?: string;
    showToggle?: boolean;
    initialExpanded?: boolean;
    cardBgClass?: string;
    cardContainerClass?: string;
    mobileStacked?: boolean;
    toggleLabels?: { show: string; hide: string };
    heading?: ReactNode;
    subheading?: ReactNode;
    headingContainerClass?: string;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
    steps,
    className = '',
    height = 480,
    cardWidth = 192,
    alternateYOffset = 100,
    lineColor = '#2C5364',
    lineWidth = 3,
    lineDash = '7 9',
    showToggle = true,
    initialExpanded = true,
    cardBgClass = 'bg-white',
    cardContainerClass = '',
    mobileStacked = true,
    toggleLabels = { show: 'Show Flow', hide: 'Hide Flow' },
    heading,
    subheading,
    headingContainerClass = 'space-y-4 max-w-xl'
}) => {
    const [expanded, setExpanded] = useState(initialExpanded);

    const segmentCount = Math.max(0, steps.length - 1);
    const getYPercent = (index: number) => (index % 2 === 0 ? 25 : 75);
    const cardOffsetStyle = (index: number) => ({ transform: `translateY(${index % 2 === 0 ? -alternateYOffset : alternateYOffset}px)` });

    return (
        <section className={className}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {(heading || subheading || showToggle) && (
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                        {(heading || subheading) && (
                            <div className={headingContainerClass}>
                                {typeof heading === 'string' ? <h2 className="text-3xl font-semibold text-secondary-900">{heading}</h2> : heading}
                                {typeof subheading === 'string' ? <p className="text-secondary-600">{subheading}</p> : subheading}
                            </div>
                        )}
                        {showToggle && (
                            <button
                                onClick={() => setExpanded(e => !e)}
                                className="px-5 py-3 rounded-full bg-nss-600 text-white text-sm font-medium hover:bg-nss-700 transition"
                            >
                                {expanded ? toggleLabels.hide : toggleLabels.show}
                            </button>
                        )}
                    </div>
                )}

                {expanded && (
                    <div style={{ height }} className="relative hidden md:block select-none">
                        {Array.from({ length: segmentCount }).map((_, i) => {
                            const segmentWidthPercent = 100 / (steps.length - 1);
                            const left = `${i * segmentWidthPercent}%`;
                            const width = `${segmentWidthPercent}%`;
                            const startY = getYPercent(i);
                            const endY = getYPercent(i + 1);
                            const endX = 90;
                            return (
                                <svg
                                    key={i}
                                    className="absolute top-0 h-full z-0 pointer-events-none"
                                    style={{ left, width }}
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d={`M0,${startY} C50,${startY} 50,${endY} ${endX},${endY}`}
                                        fill="none"
                                        stroke={lineColor}
                                        strokeWidth={lineWidth}
                                        strokeDasharray={lineDash}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            );
                        })}
                        <div className={`absolute inset-0 flex justify-between items-center px-2 z-10 ${cardContainerClass}`}>
                            {steps.map((step, i) => (
                                <div key={i} style={{ width: cardWidth, ...cardOffsetStyle(i) }} className="relative">
                                    <ListTileCardWithIcon
                                        title={step.title}
                                        description={step.description}
                                        icon={step.icon}
                                        iconBackground={step.iconBackground || 'bg-gradient-to-br from-nss-100 to-nss-200'}
                                        className={`shadow-md shadow-nss-800/5 ring-1 ring-transparent hover:ring-nss-300/60 backdrop-blur-sm text-[11px] leading-snug ${cardBgClass} ${step.cardClassName || ''}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {expanded && mobileStacked && (
                    <div className="md:hidden space-y-5">
                        {steps.map((step, i) => (
                            <ListTileCardWithIcon
                                key={i}
                                title={step.title}
                                description={step.description}
                                icon={step.icon}
                                iconBackground={step.iconBackground || 'bg-nss-200'}
                                className={`${cardBgClass}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FlowDiagram;
