import { Droplet } from 'lucide-react';
import { Placeholder } from '@/components/common/Placeholder';

export const BloodHeroSection = () => (
    <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <h1 className="text-4xl md:text-6xl font-thin tracking-tight text-secondary-900"><span className="text-blood-700">Donate Blood</span>. Sustain Life.</h1>
                <p className="text-lg text-secondary-600 leading-relaxed max-w-xl">NSS blood donation initiatives streamline awareness, mobilize volunteers, and ensure safe, ethical collection. Each unit impacts multiple lives—your contribution matters.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#importance" className="inline-flex items-center justify-center px-8 py-4 text-md font-medium text-secondary-700 rounded-full transition bg-blood-50 hover:bg-blood-100">Why It Matters</a>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-6">
                    <div className="text-center"><div className="text-2xl md:text-3xl font-semibold text-secondary-900">1200+</div><div className="text-xs text-secondary-500 uppercase tracking-wide">Units Collected</div></div>
                    <div className="text-center"><div className="text-2xl md:text-3xl font-semibold text-secondary-900">45</div><div className="text-xs text-secondary-500 uppercase tracking-wide">Camps</div></div>
                    <div className="text-center"><div className="text-2xl md:text-3xl font-semibold text-secondary-900">72%</div><div className="text-xs text-secondary-500 uppercase tracking-wide">Repeat Donors</div></div>
                </div>
            </div>
            <div className="relative">
                <Placeholder size="hero" label="Blood Hero" />
                <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-lg flex items-center gap-3">
                    <div className="bg-blood-700 p-2 rounded-lg"><Droplet className="h-6 w-6 text-white" /></div>
                    <div><div className="text-secondary-900 font-semibold">Every Drop Counts</div><div className="text-secondary-600 text-xs">Help replenish blood banks</div></div>
                </div>
            </div>
        </div>
    </section>
);
