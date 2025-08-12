import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';
import { FinalCTA } from '@/components/ui/FinalCTA';
import { AboutHeroSection } from './sections/HeroSection';
import { MissionVisionSection } from './sections/MissionVisionSection';
import { TeamSection } from './sections/TeamSection';
import { FAQSection } from './sections/FAQSection';
import { ContactSection } from './sections/ContactSection';

export default function AboutView() {
    return (
        <div className="min-h-screen bg-nss-50 font-isans text-secondary-800">
            <Navbar />
            <main className="pt-32">
                <AboutHeroSection />
                <MissionVisionSection />
                <TeamSection />
                <FAQSection />
                <ContactSection />
            </main>
            <FinalCTA />
            <Footer />
        </div>
    );
}