import { TreePine } from 'lucide-react';

export const GreenCampusSection = () => (
    <section className="py-24 bg-white border-y border-nss-100 fade-in">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
                <h2 className="text-3xl font-semibold text-secondary-900">Green Campus Program</h2>
                <p className="text-secondary-600 leading-relaxed">The Green Campus Program is the NSS flagship vertical for ecological stewardship—coordinating tree tagging, survival monitoring, community planting drives, and habitat micro-interventions. It integrates students, faculty, and local environmental partners to accelerate campus sustainability goals.</p>
                <div className="p-6 rounded-xl bg-nss-50 border border-nss-200 space-y-3">
                    <div className="flex items-center gap-3 text-nss-700 font-medium"><TreePine className="h-5 w-5" /><span>Core Focus Areas</span></div>
                    <ul className="text-sm text-secondary-600 list-disc pl-5 space-y-1">
                        <li>Structured tagging & geo-registry</li>
                        <li>Survival analytics & care interventions</li>
                        <li>Native species propagation & diversity</li>
                        <li>Carbon & biomass estimation mapping</li>
                    </ul>
                </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl bg-nss-100 border border-nss-200 flex items-center justify-center text-secondary-400 text-sm">Green Campus Media / Graphic Placeholder</div>
        </div>
    </section>
);
