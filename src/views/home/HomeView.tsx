import { Navbar } from '../../components/common';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { HeroSection } from './sections/HeroSection';
import { FeaturesSection } from './sections/FeaturesSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { ImpactValuesSection } from './sections/ImpactValuesSection';
import { CoreTeamCarouselSection } from './sections/core/CoreTeamCarouselSection';
import { FinalCTA } from '@/components/ui/FinalCTA';
import { Footer } from '@/components/ui/Footer';

interface HomePageProps {
    onGetStarted?: () => void;
    onLearnMore?: () => void;
}

export default function HomePage({ }: HomePageProps) {
    useScrollReveal();
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <ImpactValuesSection />
            <CoreTeamCarouselSection />
            <FinalCTA />
            <Footer />
        </div>
    );
}
