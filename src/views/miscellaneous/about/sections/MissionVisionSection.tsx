import { Target, HeartHandshake } from 'lucide-react';

export const MissionVisionSection = () => (
    <section className="bg-white border-y border-nss-100 py-24 fade-in">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-3 gap-14 items-start">
            <div className="space-y-6 lg:col-span-1">
                <h2 className="text-3xl font-semibold text-secondary-900">Mission & Vision</h2>
                <p className="text-secondary-600 leading-relaxed">Our framework elevates volunteerism beyond checkbox tasks. We equip institutions with transparency and students with motivation through recognition and verified milestones.</p>
            </div>
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-nss-100 border border-nss-200 hover:shadow-sm transition">
                    <div className="flex items-center gap-3 mb-4 text-nss-700"><Target className="h-6 w-6" /><span className="font-medium">Our Mission</span></div>
                    <p className="text-sm leading-relaxed text-secondary-700">To streamline community engagement by providing a unified portal where student initiatives are documented, validated, and celebrated.</p>
                </div>
                <div className="p-8 rounded-2xl bg-nss-100 border border-nss-200 hover:shadow-sm transition">
                    <div className="flex items-center gap-3 mb-4 text-nss-700"><HeartHandshake className="h-6 w-6" /><span className="font-medium">Our Vision</span></div>
                    <p className="text-sm leading-relaxed text-secondary-700">To cultivate a culture where measurable social contribution becomes a fundamental pillar of holistic education and leadership.</p>
                </div>
            </div>
        </div>
    </section>
);
