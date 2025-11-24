import { ArrowRight, Heart, TreePine, Users, Award } from 'lucide-react';
import React from 'react';

export const FeaturesSection: React.FC = () => {
    const features = [
        { icon: Heart, title: 'Blood Donation', description: 'Save lives by donating blood and track your donations for NSS points.', color: 'bg-blood-500' },
        { icon: TreePine, title: 'Tree Tagging', description: 'Contribute to environmental conservation through tree planting and tagging.', color: 'bg-tree-500' },
        { icon: Users, title: 'Community Service', description: 'Engage in various community service activities and make a difference.', color: 'bg-nss-500' },
        { icon: Award, title: 'Earn Points', description: 'Get recognition for your contributions with our point-based system.', color: 'bg-nss-500' }
    ];
    return (
        <section className="py-20 bg-gray-50 border-t border-gray-100 fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-isans font-semibold text-gray-900 mb-4">What You Can Do</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Engage in meaningful service activities and track every contribution you make through our unified NSS platform.</p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((f, i) => (
                        <div key={i} className="group relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${f.color} shadow-inner mb-5`}><f.icon className="h-6 w-6 text-white" /></div>
                            <h3 className="font-semibold text-gray-900 mb-2 font-isans">{f.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-600">{f.description}</p>
                            <div className="mt-4 inline-flex items-center text-sm font-medium text-nss-600 group-hover:underline">Learn more <ArrowRight className="ml-1 h-4 w-4" /></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
