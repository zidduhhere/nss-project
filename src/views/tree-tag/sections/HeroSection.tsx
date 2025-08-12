import { Leaf } from 'lucide-react';
import { Placeholder } from '@/components/common/Placeholder';

export const TreeTagHeroSection = () => (
    <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <h1 className="text-4xl md:text-6xl font-thin font-isans tracking-tight text-secondary-900">Tag Trees. Track Growth.</h1>
                <p className="text-lg text-secondary-600 leading-relaxed max-w-xl">Our tree tagging initiative creates a living registry of campus & community green cover—monitoring survival, biodiversity impact, and student stewardship over time.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#impact" className="inline-flex items-center justify-center px-8 py-4 text-md font-medium text-secondary-700 border border-nss-300 hover:bg-nss-100 rounded-full transition">Why It Matters</a>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-6">
                    <div className="text-center"><div className="text-2xl md:text-3xl font-semibold text-secondary-900">2100+</div><div className="text-xs text-secondary-500 uppercase tracking-wide">Trees Tagged</div></div>
                    <div className="text-center"><div className="text-2xl md:text-3xl font-semibold text-secondary-900">87%</div><div className="text-xs text-secondary-500 uppercase tracking-wide">Survival Rate</div></div>
                    <div className="text-center"><div className="text-2xl md:text-3xl font-semibold text-secondary-900">18</div><div className="text-xs text-secondary-500 uppercase tracking-wide">Native Species</div></div>
                </div>
            </div>
            <div className="relative">
                <Placeholder size="hero" label="Tree Tag Hero" />
                <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-lg border border-nss-200 rounded-xl p-4 shadow-lg flex items-center gap-3">
                    <div className="bg-green-600 p-2 rounded-lg"><Leaf className="h-6 w-6 text-white" /></div>
                    <div><div className="text-secondary-900 font-semibold">Every Tree Counts</div><div className="text-secondary-600 text-xs">Track, nurture, sustain</div></div>
                </div>
            </div>
        </div>
    </section>
);
