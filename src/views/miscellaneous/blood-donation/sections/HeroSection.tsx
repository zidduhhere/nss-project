import { Droplet } from 'lucide-react';
import { Placeholder } from '@/components/common/Placeholder';
import { HeroInfoBadge } from '@/components/ui/HeroInfoBadge';

export const BloodHeroSection = () => (
    <section className="relative overflow-hidden reveal-on-scroll">
        <div className="absolute pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 text-white">
                <h1 className="text-4xl md:text-6xl font-thin tracking-tight"><span className="text-white">Donate Blood</span>. Sustain Life.</h1>
                <p className="text-lg leading-relaxed max-w-xl text-blood-100">NSS blood donation initiatives streamline awareness, mobilize volunteers, and ensure safe, ethical collection. Each unit impacts multiple lives—your contribution matters.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#importance" className="inline-flex items-center justify-center px-8 py-4 text-md font-medium rounded-full transition bg-blood-400/20 hover:bg-blood-400/30 text-blood-50 ring-1 ring-blood-300/30 backdrop-blur-sm">Why It Matters</a>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-6 max-w-xl">
                    <div className="text-left"><div className="text-2xl md:text-3xl font-semibold text-white">1200+</div><div className="text-xs text-blood-200 uppercase tracking-wide">Units Collected</div></div>
                    <div className="text-left"><div className="text-2xl md:text-3xl font-semibold text-white">45</div><div className="text-xs text-blood-200 uppercase tracking-wide">Camps</div></div>
                    <div className="text-left"><div className="text-2xl md:text-3xl font-semibold text-white">72%</div><div className="text-xs text-blood-200 uppercase tracking-wide">Repeat Donors</div></div>
                </div>
            </div>
            <div className="relative">
                <Placeholder size="hero" label="Blood Hero" />
                <HeroInfoBadge
                    className="absolute -top-4 -left-4"
                    icon={<Droplet className="h-6 w-6 text-white" />}
                    title="Every Drop Counts"
                    subtitle="Help replenish blood banks"
                    iconBackground="bg-blood-700"
                    titleColor="text-blood-900"
                    subtitleColor="text-blood-700"
                    iconBackgroundRadius="rounded-lg"
                />
            </div>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.15), transparent 60%)' }} />
    </section>
);
