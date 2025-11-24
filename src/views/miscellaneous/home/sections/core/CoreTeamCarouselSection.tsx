import { CoreTeamLeft } from './CoreTeamLeft';
import { CoreTeamRight, CoreMember } from './CoreTeamRight';

export const CoreTeamCarouselSection: React.FC = () => {
    const members: CoreMember[] = [
        { name: 'Ananya Rao', role: 'Program Coordinator', image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80', bio: 'Leads strategic planning, partnership development and oversees execution of blood donation and environmental programs.', color: 'bg-pink-100 text-pink-700' },
        { name: 'Rahul Menon', role: 'Operations Lead', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80', bio: 'Coordinates volunteer logistics, on‑ground event management, and compliance with reporting standards.', color: 'bg-emerald-100 text-emerald-700' },
        { name: 'Sana Iqbal', role: 'Community Outreach', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80', bio: 'Builds collaborations with NGOs, hospitals and civic bodies while amplifying student engagement initiatives.', color: 'bg-indigo-100 text-indigo-700' },
        { name: 'Vikram Singh', role: 'Data & Impact Analyst', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80', bio: 'Tracks activity submissions, validates metrics and transforms raw data into actionable impact insights.', color: 'bg-amber-100 text-amber-700' },
        { name: 'Meera Patel', role: 'Volunteer Success', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', bio: 'Enhances student retention, designs orientation experiences and feedback loops to keep motivation high.', color: 'bg-sky-100 text-sky-700' }
    ];

    return (
        <section className="py-32 bg-white fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-16 lg:grid-cols-12 items-center">
                    <CoreTeamLeft />
                    <CoreTeamRight members={members} />
                </div>
            </div>
        </section>
    );
};
