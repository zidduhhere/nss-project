import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function WebsiteTeamView() {
    return (
        <div className="min-h-screen bg-white font-isans">
            <Navbar />
            <main className="pt-32 max-w-6xl mx-auto px-6 pb-24">
                <h1 className="text-4xl font-semibold text-secondary-900 mb-8">Website Team</h1>
                <p className="text-secondary-600 max-w-3xl mb-12">Meet the developers, designers, and contributors maintaining the NSS portal platform.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="p-6 rounded-xl bg-nss-50 border border-nss-200 flex flex-col items-center text-center">
                            <div className="w-28 h-28 rounded-xl bg-nss-100 border border-nss-200 mb-5" />
                            <h3 className="font-medium text-secondary-900">Member {i}</h3>
                            <p className="text-xs uppercase tracking-wide text-secondary-500 mt-1">Role</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
