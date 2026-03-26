import { Navbar } from '@/components/common';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useHomepageStats } from '@/hooks/useHomepageStats';
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
    const { stats, isLoading } = useHomepageStats();
    return (
        <div className="min-h-screen  bg-nss-gradient">
            <Navbar />
            <HeroSection stats={stats} isLoading={isLoading} />
            <FeaturesSection />
            <HowItWorksSection stats={stats} isLoading={isLoading} />
            <ImpactValuesSection />
            <CoreTeamCarouselSection />
            <FinalCTA />
            <Footer />
        </div>
    );
}
