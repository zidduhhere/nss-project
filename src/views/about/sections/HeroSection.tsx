export const AboutHeroSection = () => (
    <section className="bg-nss-gradient/60 backdrop-blur-sm mx-auto px-6 lg:px-12 pb-20 reveal-on-scroll">
        <div className="mx-auto max-w-7xl ">
            <div className="grid lg:grid-cols-2 gap-12 items-start ">
                <div className="space-y-8">
                    <h1 className="text-4xl md:text-6xl font-isans font-thin tracking-tight text-white">Empowering Social Impact</h1>
                    <p className="text-lg leading-relaxed text-white max-w-xl">We enable students to transform intent into measurable community contribution. Through structured tracking and faculty validation, NSSApp builds lifelong civic responsibility.</p>
                    <div className="grid grid-cols-3 gap-6 pt-4">
                        <div><div className="text-2xl font-semibold text-white">500+</div><div className="text-xs text-white uppercase tracking-wide">Donations</div></div>
                        <div><div className="text-2xl font-semibold text-white">1K+</div><div className="text-xs text-white uppercase tracking-wide">Trees Tagged</div></div>
                        <div><div className="text-2xl font-semibold text-white">200+</div><div className="text-xs text-white uppercase tracking-wide">Active Members</div></div>
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-nss-100 to-nss-200 border border-nss-200 flex items-center justify-center text-secondary-400 text-sm">Image Placeholder</div>
                </div>
            </div>
        </div>
    </section>
);
