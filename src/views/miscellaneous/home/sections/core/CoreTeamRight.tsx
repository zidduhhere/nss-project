import React, { useEffect, useRef, useState } from 'react';
import { Placeholder } from '@/components/common/Placeholder';

export interface CoreMember {
    name: string;
    role: string;
    image: string;
    bio: string;
    color: string; // Tailwind classes for pastel badge
}

interface CoreTeamRightProps {
    members: CoreMember[];
    autoDelay?: number; // ms
}

export const CoreTeamRight: React.FC<CoreTeamRightProps> = ({ members, autoDelay = 5000 }) => {
    const [index, setIndex] = useState(0);
    const pausedRef = useRef(false);
    const intervalRef = useRef<number | null>(null);

    const advance = () => setIndex(prev => (prev + 1) % members.length);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (pausedRef.current) return;
        intervalRef.current && clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(advance, autoDelay);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [index, autoDelay]);

    const pause = () => { pausedRef.current = true; if (intervalRef.current) clearInterval(intervalRef.current); };
    const resume = () => { if (!pausedRef.current) return; pausedRef.current = false; intervalRef.current = window.setInterval(advance, autoDelay); };
    const goTo = (i: number) => { pause(); setIndex(i); };

    return (
        <div className="relative self-center w-full lg:col-span-8" onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}>
            <div className="relative w-full px-2 sm:px-4">
                {members.map((m, i) => {
                    const isActive = i === index;
                    return (
                        <article
                            key={m.name}
                            aria-hidden={!isActive}
                            className={`flex flex-col sm:flex-row sm:items-center w-full bg-white border border-gray-200 rounded-2xl px-6 py-6 transition-opacity duration-700 ease-out min-h-[360px] ${isActive ? 'opacity-100 relative pointer-events-auto' : 'opacity-0 absolute inset-0 pointer-events-none'}`}
                        >
                            <div className="w-full sm:w-56 sm:h-56 h-64 flex-shrink-0 rounded-xl relative mb-6 sm:mb-0 sm:mr-8">
                                <Placeholder size="avatar" variant="person" rounded="rounded-xl" shadow />
                            </div>
                            <div className="flex-1 flex flex-col items-start justify-center">
                                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 font-isans leading-tight">{m.name}</h3>
                                <span className={`mt-2 inline-block text-[11px] uppercase tracking-wide px-3 py-1 rounded-full font-medium ${m.color}`}>{m.role}</span>
                                <p className="mt-5 text-base md:text-lg leading-relaxed text-black font-normal max-w-prose">{m.bio}</p>
                            </div>
                        </article>
                    );
                })}
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-2 mt-8">
                {members.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? 'bg-nss-600 w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
                        aria-label={`Show ${members[i].name}`}
                        aria-pressed={i === index}
                    />
                ))}
            </div>
        </div>
    );
};
