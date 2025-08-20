import { StatCard } from "@/components/ui";
import { StatSectionWrapper } from "@/components/ui/StatSectionWrapper";


export const TreeTagStatsSection = () => (
    <StatSectionWrapper bgColor="bg-tree-50" paddingY="py-24" className="reveal-on-scroll">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { label: 'Total Trees Tagged (Year)', value: '640', sub: '+22% YoY' },
                { label: 'Average Survival Rate', value: '87%', sub: 'Year 1 Cohort' },
                { label: 'Student Caretakers', value: '430', sub: 'Active' },
                { label: 'Native Species Catalogued', value: '18', sub: 'Verified' },
            ].map((s, i) => (
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
