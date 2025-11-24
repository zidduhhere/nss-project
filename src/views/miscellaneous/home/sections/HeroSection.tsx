import { Heart, TreePine } from 'lucide-react';
import { Placeholder } from '@/components/common/Placeholder';
import { HeroInfoBadge } from '@/components/ui/HeroInfoBadge';
import React from 'react';

export const HeroSection: React.FC = () => {
    return (
        <section className="relative overflow-hidden fade-in">
            <div className="absolute pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8 text-white">
                    <h1 className="text-4xl md:text-6xl font-thin tracking-tight font-isans">
                        <span className="text-white">Empower Your Community</span> with NSS.
                    </h1>
                    <p className="text-lg leading-relaxed max-w-xl text-gray-100">
                        Join the National Service Scheme and contribute to society through blood donation, environmental conservation, and community service. Track your impact and earn recognition for your valuable contributions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="/about" className="inline-flex items-center justify-center px-8 py-4 text-md font-medium rounded-full transition bg-white/20 hover:bg-white/30 text-white ring-1 ring-white/30 backdrop-blur-sm">
                            About Us
                        </a>
                        <a href="/login" className="inline-flex items-center justify-center px-8 py-4 text-md font-medium rounded-full transition bg-transparent hover:bg-white/10 text-white ring-1 ring-white/30 backdrop-blur-sm">
                            Sign In
                        </a>
                    </div>
                    <div className="grid grid-cols-3 gap-6 pt-6 max-w-xl">
                        <div className="text-left">
                            <div className="text-2xl md:text-3xl font-semibold text-white">500+</div>
                            <div className="text-xs text-gray-200 uppercase tracking-wide">Blood Donations</div>
                        </div>
                        <div className="text-left">
                            <div className="text-2xl md:text-3xl font-semibold text-white">1000+</div>
                            <div className="text-xs text-gray-200 uppercase tracking-wide">Trees Planted</div>
                        </div>
                        <div className="text-left">
                            <div className="text-2xl md:text-3xl font-semibold text-white">200+</div>
                            <div className="text-xs text-gray-200 uppercase tracking-wide">Active Members</div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <Placeholder size="hero" label="Home Hero" />
                    <HeroInfoBadge
                        className="absolute -top-4 -left-4"
                        icon={<Heart className="h-6 w-6 text-white" />}
                        title="Rudhirasena"
                        subtitle="Save Lives"
                        iconBackground="bg-blood-500"
                        titleColor="text-gray-900"
                        subtitleColor="text-gray-700"
                        iconBackgroundRadius="rounded-lg"
                    />
                    <HeroInfoBadge
                        className="absolute -bottom-4 -right-4"
                        icon={<TreePine className="h-6 w-6 text-white" />}
                        title="NRPF"
                        subtitle="Go Green"
                        iconBackground="bg-tree-500"
                        titleColor="text-gray-900"
                        subtitleColor="text-gray-700"
                        iconBackgroundRadius="rounded-lg"
                    />
                </div>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.15), transparent 60%)' }} />
        </section>
    );
};
