import { useState } from 'react';
import { Activity, Users, ShieldCheck, Syringe, HandHeart, HeartPulse, ArrowRight } from 'lucide-react';

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
    return (
        <section className="py-24 bg-nss-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
                    <div className="space-y-4 max-w-xl">
                        <h2 className="text-3xl font-semibold text-secondary-900">NSS Role Flow</h2>
                        <p className="text-secondary-600">A structured lifecycle that drives sustainable donor engagement and safe collection practices.</p>
                    </div>
                    <button onClick={() => setShowFlow(!showFlow)} className="px-5 py-3 rounded-full bg-nss-600 text-white text-sm font-medium hover:bg-nss-700 transition">{showFlow ? 'Hide Flow' : 'Show Flow'}</button>
                </div>
                {showFlow && (
                    <div className="overflow-x-auto pb-4">
                        <div className="min-w-[900px] flex items-stretch gap-6">
                            {flowSteps.map((step, i) => (
                                <div key={i} className="relative flex-1 bg-white rounded-xl border border-nss-200 p-6 flex flex-col min-w-[220px]">
                                    <div className="flex items-center gap-3 mb-3 text-nss-700 font-medium">
                                        <div className="w-10 h-10 rounded-lg bg-nss-100 flex items-center justify-center">{step.icon}</div>
                                        <span className="text-sm leading-snug font-semibold text-secondary-800">{step.title}</span>
                                    </div>
                                    <p className="text-xs text-secondary-600 leading-relaxed flex-1">{step.desc}</p>
                                    {i < flowSteps.length - 1 && <div className="hidden md:block absolute top-1/2 -right-3 translate-y-[-50%] w-6 h-6 text-nss-500"><ArrowRight className="h-6 w-6" /></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
