import { useState } from 'react';
import { Activity, Users, ShieldCheck, Syringe, HandHeart, HeartPulse } from 'lucide-react';

export const BloodFlowSection = () => {
    const [showFlow, setShowFlow] = useState(true);
    const flowSteps = [
        { title: 'Awareness & Outreach', icon: <Activity className="h-5 w-5" />, desc: 'Campaigns & orientation sessions' },
        { title: 'Registration Drive', icon: <Users className="h-5 w-5" />, desc: 'Mobilizing willing donors' },
        { title: 'Camp Coordination', icon: <ShieldCheck className="h-5 w-5" />, desc: 'Logistics & partner hospitals' },
        { title: 'Safe Collection', icon: <Syringe className="h-5 w-5" />, desc: 'Medical supervision & hygiene' },
        { title: 'Recognition & Reporting', icon: <HandHeart className="h-5 w-5" />, desc: 'Certificates & impact metrics' },
        { title: 'Follow-Up & Retention', icon: <HeartPulse className="h-5 w-5" />, desc: 'Thank-you + next drive nurture' },
    ];
    // Helper to compute start/end Y positions for segments (percentage of SVG height)
    const getY = (index: number) => (index % 2 === 0 ? 25 : 75);

    return (
        <section className="py-28 bg-nss-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <div className="space-y-4 max-w-xl">
                        <h2 className="text-3xl font-semibold text-secondary-900">NSS Role Flow</h2>
                        <p className="text-secondary-600">A structured lifecycle that drives sustainable donor engagement and safe collection practices.</p>
                    </div>
                    <button onClick={() => setShowFlow(!showFlow)} className="px-5 py-3 rounded-full bg-nss-600 text-white text-sm font-medium hover:bg-nss-700 transition">{showFlow ? 'Hide Flow' : 'Show Flow'}</button>
                </div>
                {showFlow && (
                    <div className="relative hidden md:block h-[480px] select-none">
                        {/* Per-segment SVG connectors */}
                        {flowSteps.slice(0, -1).map((_, i) => {
                            const segmentWidth = 100 / (flowSteps.length - 1); // percent of container width
                            const left = `${i * segmentWidth}%`;
                            const width = `${segmentWidth}%`;
                            const startY = getY(i);
                            const endY = getY(i + 1);
                            const endX = 90; // stop before full width so arrow is not hidden under next card
                            const gradientId = `flowGradient-${i}`;
                            const markerId = `arrowHead-${i}`;
                            return (
                                <svg
                                    key={i}
                                    className="absolute top-0 h-full z-0 pointer-events-none"
                                    style={{ left, width }}
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#0F2027" />
                                            <stop offset="50%" stopColor="#203A43" />
                                            <stop offset="100%" stopColor="#2C5364" />
                                        </linearGradient>
                                        <marker id={markerId} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                                            <path d="M0,0 L6,3 L0,6 z" fill="#2C5364" />
                                        </marker>
                                    </defs>
                                    <path
                                        d={`M0,${startY} C50,${startY} 50,${endY} ${endX},${endY}`}
                                        fill="none"
                                        stroke={`url(#${gradientId})`}
                                        strokeWidth={3}
                                        strokeDasharray="7 9"
                                        markerEnd={`url(#${markerId})`}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{ filter: 'drop-shadow(0 0 1px rgba(12,26,31,0.25))' }}
                                    />
                                </svg>
                            );
                        })}
                        {/* Flow Cards */}
                        <div className="absolute inset-0 flex justify-between items-center px-2 z-10">
                            {flowSteps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`w-48 relative bg-white rounded-2xl shadow-md shadow-nss-800/5 ring-1 ring-transparent hover:ring-nss-300/60 transition-all duration-300 p-5 flex flex-col backdrop-blur-sm ${i % 2 === 0 ? 'translate-y-[-100px]' : 'translate-y-[100px]'}`}
                                >
                                    <div className="flex items-center gap-3 mb-3 text-nss-700 font-medium">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-nss-100 to-nss-200 flex items-center justify-center text-nss-700 shadow-inner">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-[13px] font-semibold text-secondary-800 leading-snug mb-2">{step.title}</h3>
                                    <p className="text-[11px] text-secondary-600 leading-relaxed flex-1">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Mobile stacked version (simpler, no curved lines) */}
                {showFlow && (
                    <div className="md:hidden space-y-5">
                        {flowSteps.map((step, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-5 flex gap-4">
                                <div className="w-12 h-12 rounded-lg bg-nss-100 flex items-center justify-center text-nss-700">
                                    {step.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-secondary-800">{step.title}</h3>
                                    <p className="text-xs text-secondary-600 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
