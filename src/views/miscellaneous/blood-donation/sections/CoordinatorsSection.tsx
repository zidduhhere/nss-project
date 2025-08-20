import { Placeholder } from '@/components/common/Placeholder';
interface Coordinator { name: string; region: string; role: string; image: string; }

const studentCoordinators: Coordinator[] = [
    { name: 'Ananya Rao', region: 'North', role: 'Regional Coordinator', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=60' },
    { name: 'Rohan Mehta', region: 'South', role: 'Regional Coordinator', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=60' },
    { name: 'Neha Sharma', region: 'East', role: 'Regional Coordinator', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=60' },
    { name: 'Kunal Verma', region: 'West', role: 'Regional Coordinator', image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=60' },
];

const facultyCoordinators: Coordinator[] = [
    { name: 'Dr. Priya Nair', region: 'North', role: 'Faculty Coordinator', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=60' },
    { name: 'Prof. Amit Desai', region: 'South', role: 'Faculty Coordinator', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=60' },
    { name: 'Dr. Kavita Sen', region: 'East', role: 'Faculty Coordinator', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=60' },
    { name: 'Prof. Raj Malhotra', region: 'West', role: 'Faculty Coordinator', image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=60' },
];

export const CoordinatorsSection = () => (
    <section className="py-24 bg-nss-50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-20">
            <div>
                <h2 className="text-3xl font-semibold text-secondary-900 mb-8">Regional Student Coordinators</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {studentCoordinators.map((c, i) => (
                        <div key={i} className="group flex flex-col items-center text-center">
                            <div className="mb-5"><Placeholder size="avatar" variant="person" rounded='rounded-full' /></div>
                            <h3 className="font-medium text-secondary-900">{c.name}</h3>
                            <p className="text-xs text-secondary-500 uppercase tracking-wide mt-1">{c.region}</p>
                            <p className="text-xs text-nss-600 mt-1">{c.role}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-3xl font-semibold text-secondary-900 mb-8">Regional Faculty Coordinators</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {facultyCoordinators.map((c, i) => (
                        <div key={i} className="group flex flex-col items-center text-center">
                            <div className="mb-5"><Placeholder size="avatar" variant="person" rounded='rounded-full' /></div>
                            <h3 className="font-medium text-secondary-900">{c.name}</h3>
                            <p className="text-xs text-secondary-500 uppercase tracking-wide mt-1">{c.region}</p>
                            <p className="text-xs text-nss-600 mt-1">{c.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);
