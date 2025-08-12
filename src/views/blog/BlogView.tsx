import Navbar from '@/components/common/Navbar';
import { FooterSection } from '@/views/home/sections/FooterSection';

export default function BlogView() {
    return (
        <div className="min-h-screen bg-white font-isans">
            <Navbar />
            <main className="pt-32 max-w-5xl mx-auto px-6 pb-24">
                <h1 className="text-4xl font-semibold text-secondary-900 mb-6">Blog</h1>
                <p className="text-secondary-600 leading-relaxed">Updates, highlights, and impact stories will appear here.</p>
            </main>
            <FooterSection />
        </div>
    );
}
