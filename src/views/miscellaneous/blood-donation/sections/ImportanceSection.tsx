import { HeartPulse, ShieldCheck, Droplet, Users } from 'lucide-react';
import { ListTileCardWithIcon } from '@/components/ui/ListTileCardWithIcon';

export const BloodImportanceSection = () => {
    const cards = [
        { icon: <HeartPulse className="h-6 w-6" />, title: 'Saves Lives', description: 'A single unit can aid multiple patients via component separation.' },
        { icon: <ShieldCheck className="h-6 w-6" />, title: 'Ensures Supply Stability', description: 'Maintains optimal inventory for trauma & scheduled procedures.' },
        { icon: <Droplet className="h-6 w-6" />, title: 'Encourages Health Screening', description: 'Donors receive periodic health insights fostering wellness.' },
        { icon: <Users className="h-6 w-6" />, title: 'Builds Community', description: 'Shared purpose strengthens social cohesion & leadership.' },
    ];
    return (
        <section id="importance" className="py-24 bg-white border-y border-nss-100 fade-in">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-3 gap-14">
                <div className="space-y-6 lg:col-span-1">
                    <h2 className="text-3xl font-semibold text-secondary-900">Why Blood Donation Matters</h2>
                    <p className="text-secondary-600 leading-relaxed">Regular blood donation sustains emergency readiness, supports oncology & surgical care, and fosters a culture of empathy & civic responsibility on campus.</p>
                </div>
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                    {cards.map((c, i) => (
                        <ListTileCardWithIcon
                            key={i}
                            icon={c.icon}
                            title={c.title}
                            description={c.description}
                            iconBackground="bg-nss-200"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
