interface TeamMember { name: string; role: string; }

const team: TeamMember[] = [
    { name: 'Alice Johnson', role: 'Program Manager' },
    { name: 'Mark Smith', role: 'Lead Developer' },
    { name: 'Sarah Lee', role: 'UI/UX Designer' },
    { name: 'David Kim', role: 'Data Analyst' },
    { name: 'Emily Chen', role: 'Content Writer' },
    { name: "We're hiring!", role: 'Join Us' },
];

export const TeamSection = () => (
    <section className="py-24 bg-nss-50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
                <div className="space-y-4 max-w-xl">
                    <h2 className="text-3xl font-semibold text-secondary-900">Our Team</h2>
                    <p className="text-secondary-600">A cross‑functional group focused on product quality, transparency, and sustainable impact enablement.</p>
                </div>
                <button className="self-start md:self-auto px-5 py-3 rounded-full bg-nss-600 text-white text-sm font-medium hover:bg-nss-700 transition">Open Positions</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((m, i) => (
                    <div key={i} className="group p-6 bg-white rounded-xl border border-nss-200 hover:border-nss-300 transition flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-full bg-nss-200 flex items-center justify-center text-nss-600 text-sm font-medium">{m.name.charAt(0)}</div>
                        <div>
                            <h3 className="font-medium text-secondary-900 mb-1">{m.name}</h3>
                            <p className="text-xs uppercase tracking-wide text-secondary-500">{m.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
