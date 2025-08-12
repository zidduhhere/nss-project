import Navbar from '@/components/common/Navbar';
import { FooterSection } from '@/views/home/sections/FooterSection';

export default function ActivitiesView() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 max-w-5xl mx-auto px-6 pb-24">
                <h1 className="text-4xl font-bold mb-6 text-nss-text">Activities</h1>
                <p className="text-nss-text-secondary max-w-3xl">Upcoming and past NSS activities will be listed here.</p>
            </main>
            <FooterSection />
        </div>
    );
}
