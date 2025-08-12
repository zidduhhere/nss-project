import { HeartPulse, ShieldCheck, Droplet, Users } from 'lucide-react';

export const BloodImportanceSection = () => (
    <section id="importance" className="py-24 bg-white border-y border-nss-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-3 gap-14">
            <div className="space-y-6 lg:col-span-1">
                <h2 className="text-3xl font-semibold text-secondary-900">Why Blood Donation Matters</h2>
                <p className="text-secondary-600 leading-relaxed">Regular blood donation sustains emergency readiness, supports oncology & surgical care, and fosters a culture of empathy & civic responsibility on campus.</p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                {[
                    { icon: <HeartPulse className="h-6 w-6" />, title: 'Saves Lives', desc: 'A single unit can aid multiple patients via component separation.' },
                    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Ensures Supply Stability', desc: 'Maintains optimal inventory for trauma & scheduled procedures.' },
                    { icon: <Droplet className="h-6 w-6" />, title: 'Encourages Health Screening', desc: 'Donors receive periodic health insights fostering wellness.' },
                    { icon: <Users className="h-6 w-6" />, title: 'Builds Community', desc: 'Shared purpose strengthens social cohesion & leadership.' },
                ].map((c, i) => (
                    <div key={i} className="p-6 rounded-xl border border-nss-200 bg-nss-50 hover:bg-white transition group">
                        <div className="w-11 h-11 rounded-lg bg-nss-200 flex items-center justify-center text-nss-700 mb-4 group-hover:shadow">{c.icon}</div>
                        <h3 className="font-medium text-secondary-900 mb-2">{c.title}</h3>
                        <p className="text-sm text-secondary-600 leading-relaxed">{c.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
