import { Droplet } from 'lucide-react';

export const RudhirasenaSection = () => (
    <section className="py-24 bg-white border-y border-nss-100 fade-in">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
                <h2 className="text-3xl font-semibold text-secondary-900">Rudhirasena Flagship</h2>
                <p className="text-secondary-600 leading-relaxed">Rudhirasena is the dedicated NSS flagship vertical that orchestrates campus blood donation impact—strategizing drives, building donor reliability, and integrating post-donation retention programs. It aligns stakeholders: students, faculty, medical partners, and civic networks.</p>
                <div className="p-6 rounded-xl bg-nss-50 border border-nss-200 space-y-3">
                    <div className="flex items-center gap-3 text-nss-700 font-medium"><Droplet className="h-5 w-5" /><span>Key Focus Areas</span></div>
                    <ul className="text-sm text-secondary-600 list-disc pl-5 space-y-1">
                        <li>Strategic camp calendar & capacity planning</li>
                        <li>Emergency blood availability response system</li>
                        <li>Donor retention & wellness engagement loop</li>
                        <li>Data-backed reporting & transparency</li>
                    </ul>
                </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl bg-nss-100 border border-nss-200 flex items-center justify-center text-secondary-400 text-sm">Rudhirasena Media / Graphic Placeholder</div>
        </div>
    </section>
);
