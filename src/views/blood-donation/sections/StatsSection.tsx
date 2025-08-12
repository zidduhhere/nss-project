export const BloodStatsSection = () => (
    <section className="py-24 bg-nss-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Units Collected (Year)', value: '820', sub: '+18% YoY' },
                    { label: 'Emergency Requests', value: '310', sub: 'Fulfilled 94%' },
                    { label: 'Active Donor Pool', value: '560', sub: 'Verified' },
                    { label: 'Hospital Partners', value: '12', sub: 'MoUs Signed' },
                ].map((s, i) => (
                    <div key={i} className="p-6 bg-white rounded-xl border border-nss-200 hover:shadow-sm transition">
                        <div className="text-3xl font-semibold text-secondary-900 mb-1">{s.value}</div>
                        <div className="text-sm font-medium text-secondary-600">{s.label}</div>
                        <div className="text-xs text-nss-600 mt-1">{s.sub}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
