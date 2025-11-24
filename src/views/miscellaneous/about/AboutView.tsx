import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';
import { FinalCTA } from '@/components/ui/FinalCTA';
import { AboutHeroSection } from './sections/HeroSection';
import { MissionVisionSection } from './sections/MissionVisionSection';
import { TeamSection } from './sections/TeamSection';
import { FAQSection } from './sections/FAQSection';
import { ContactSection } from './sections/ContactSection';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function AboutView() {
    useScrollReveal();
    return (
        <div className="min-h-screen font-isans text-secondary-800 bg-nss-gradient">
            <Navbar />
            <main className="">
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