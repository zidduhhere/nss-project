import { Sprout, ShieldCheck, Globe2, Recycle } from 'lucide-react';

export const TreeTagImpactSection = () => (
    <section id="impact" className="py-24 bg-white border-y border-nss-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-3 gap-14">
            <div className="space-y-6 lg:col-span-1">
                <h2 className="text-3xl font-semibold text-secondary-900">Why Tree Tagging Matters</h2>
                <p className="text-secondary-600 leading-relaxed">A transparent, data-backed green registry drives better care, biodiversity appreciation, and measurable climate resilience across campus landscapes.</p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                {[
                    { icon: <Sprout className="h-6 w-6" />, title: 'Monitors Growth', desc: 'Periodic measurements help assess survival, stress & maintenance needs.' },
                    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Prevents Neglect', desc: 'Assigned caretakers create accountability & stewardship culture.' },
                    { icon: <Globe2 className="h-6 w-6" />, title: 'Biodiversity Insight', desc: 'Species data supports native planting & ecological planning.' },
                    { icon: <Recycle className="h-6 w-6" />, title: 'Carbon Awareness', desc: 'Aggregated biomass & sequestration estimates inform sustainability goals.' },
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
