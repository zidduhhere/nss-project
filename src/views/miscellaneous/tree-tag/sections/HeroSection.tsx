import { Leaf } from 'lucide-react';
import { Placeholder } from '@/components/common/Placeholder';
import { HeroInfoBadge } from '@/components/ui/HeroInfoBadge';

export const TreeTagHeroSection = () => (
    <section className="relative reveal-on-scroll">
        {/* Soft radial highlight without blend-mode to avoid top-left seam */}
        <div className="absolute bg-transparent " />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 text-white">
                <h1 className="text-4xl md:text-6xl font-thin font-isans tracking-tight">Tag Trees. Track Growth.</h1>
                <p className="text-lg leading-relaxed max-w-xl text-tree-100">Our tree tagging initiative creates a living registry of campus & community green cover—monitoring survival, biodiversity impact, and student stewardship over time.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#impact" className="inline-flex items-center justify-center px-8 py-4 text-md font-medium rounded-full transition bg-tree-400/20 hover:bg-tree-400/30 text-tree-50 ring-1 ring-tree-300/30 backdrop-blur-sm">Why It Matters</a>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-6 max-w-xl">
                    <div className="text-left"><div className="text-2xl md:text-3xl font-semibold text-white">2100+</div><div className="text-xs text-tree-200 uppercase tracking-wide">Trees Tagged</div></div>
                    <div className="text-left"><div className="text-2xl md:text-3xl font-semibold text-white">87%</div><div className="text-xs text-tree-200 uppercase tracking-wide">Survival Rate</div></div>
                    <div className="text-left"><div className="text-2xl md:text-3xl font-semibold text-white">18</div><div className="text-xs text-tree-200 uppercase tracking-wide">Native Species</div></div>
                </div>
            </div>
            <div className="relative">
                <Placeholder size="hero" label="Tree Tag Hero" />
                <HeroInfoBadge
                    className="absolute -top-4 -left-4"
                    icon={<Leaf className="h-6 w-6 text-white" />}
                    title="Every Tree Counts"
                    subtitle="Track, nurture, sustain"
                    iconBackground="bg-tree-700"
                    titleColor="text-tree-900"
                    subtitleColor="text-tree-700"
                    iconBackgroundRadius="rounded-lg"
                />
            </div>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.15), transparent 60%)' }} />
    </section>
);
