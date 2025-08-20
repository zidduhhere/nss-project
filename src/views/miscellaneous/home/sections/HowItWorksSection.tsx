import React from 'react';

export const HowItWorksSection: React.FC = () => {
    return (
        <section className="py-24 bg-white reveal-on-scroll">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-14 items-start">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-isans font-semibold text-gray-900">How It Works</h2>
                        <p className="text-gray-600 text-lg">We simplify NSS participation with a transparent, student‑friendly workflow that keeps faculty in control and students motivated.</p>
                        <ul className="space-y-5">
                            {[{ step: '01', title: 'Log Your Activity', desc: 'Submit blood donation, tree tagging, or community service details with proof.' }, { step: '02', title: 'Faculty Review', desc: 'Faculty verify authenticity and award NSS points.' }, { step: '03', title: 'Track Progress', desc: 'Monitor your cumulative points and achievements in real-time.' }, { step: '04', title: 'Earn Recognition', desc: 'Reach milestones and gain badges and certificates.' }].map(item => (
                                <li key={item.step} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-nss-600 text-white flex items-center justify-center font-semibold text-sm">{item.step}</div>
                                    <div><p className="font-medium text-gray-900 font-isans">{item.title}</p><p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-nss-600/10 via-nss-600/5 to-transparent rounded-3xl" />
                        <div className="relative bg-white border border-gray-200 rounded-2xl p-8 shadow-lg space-y-6">
                            <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-900 font-isans">Live Impact</h3><span className="text-xs px-2 py-1 rounded-full bg-nss-600 text-white">Updated</span></div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl bg-nss-600/5 border border-nss-600/20"><div className="text-2xl font-bold text-nss-600 font-isans">500+</div><p className="text-xs uppercase tracking-wide text-gray-600 mt-1">Blood Donations</p></div>
                                <div className="p-4 rounded-xl bg-nss-600/5 border border-nss-600/20"><div className="text-2xl font-bold text-nss-600 font-isans">1000+</div><p className="text-xs uppercase tracking-wide text-gray-600 mt-1">Trees Tagged</p></div>
                                <div className="p-4 rounded-xl bg-nss-600/5 border border-nss-600/20"><div className="text-2xl font-bold text-nss-600 font-isans">200+</div><p className="text-xs uppercase tracking-wide text-gray-600 mt-1">Active Students</p></div>
                                <div className="p-4 rounded-xl bg-nss-600/5 border border-nss-600/20"><div className="text-2xl font-bold text-nss-600 font-isans">80+</div><p className="text-xs uppercase tracking-wide text-gray-600 mt-1">Faculty Reviews</p></div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">Data represents cumulative impact recorded on the platform and inspires continuous participation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
