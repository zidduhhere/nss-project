import React from 'react';

export const ImpactValuesSection: React.FC = () => {
    const blocks = [
        { title: 'Structured Tracking', desc: 'Centralized portal for logging and validating activities with transparency.' },
        { title: 'Recognition System', desc: 'Point mechanics and milestones that reward consistency and impact.' },
        { title: 'Faculty Oversight', desc: 'Efficient review workflows ensure authenticity and fairness.' },
        { title: 'Student Growth', desc: 'Encourages leadership, empathy, and long-term civic engagement.' }
    ];
    return (
        <section className="py-24 bg-gray-50 fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-3xl font-isans font-semibold text-gray-900">Why NSS Matters</h2>
                        <p className="text-gray-600">We cultivate responsible citizens by turning everyday actions into measurable social good. Our platform brings structure, recognition, and motivation.</p>
                    </div>
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                        {blocks.map((b, i) => (
                            <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition">
                                <h3 className="font-semibold text-gray-900 mb-2 font-isans">{b.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
