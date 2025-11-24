import { StatCard } from '@/components/ui/StatCard';
import { StatSectionWrapper } from '@/components/ui/StatSectionWrapper';

export const BloodStatsSection = () => {
    const stats = [
        { value: '820', label: 'Units Collected (Year)', sub: '+18% YoY' },
        { value: '310', label: 'Emergency Requests', sub: 'Fulfilled 94%' },
        { value: '560', label: 'Active Donor Pool', sub: 'Verified' },
        { value: '12', label: 'Hospital Partners', sub: 'MoUs Signed' },
    ];
    return (
        <StatSectionWrapper
            bgColor="bg-blood-50"
            paddingY="py-24"
            className="fade-in"
        >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((s, i) => (
                    <StatCard
                        key={i}
                        titleStat={s.value}
                        subtitle={s.label}
                        description={s.sub}
                    />
                ))}
            </div>
        </StatSectionWrapper>
    );
};
