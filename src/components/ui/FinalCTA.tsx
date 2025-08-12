import React from 'react';

export const FinalCTA: React.FC = () => (
    <section className="py-24 relative overflow-hidden reveal-on-scroll">
        <div className="absolute inset-0 bg-gradient-to-br from-nss-600 via-nss-600 to-nss-700" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-isans font-semibold text-white mb-6">Be Part of the Impact</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">Join the NSS platform today and start contributing to meaningful social and environmental change while earning recognition for your efforts.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="px-6 py-3 rounded-full bg-white text-nss-600 font-semibold text-sm hover:bg-gray-100 transition">Get Started</button>
                <button className="px-6 py-3 rounded-full border-2 border-white/60 text-white font-semibold text-sm hover:bg-white/10 transition">Learn More</button>
            </div>
        </div>
    </section>
);

export default FinalCTA;
