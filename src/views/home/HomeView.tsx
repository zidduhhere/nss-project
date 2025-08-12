import { Navbar } from '../../components/common';
import { useEffect } from 'react';
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
    // Simple intersection observer for fade-in animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            el.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700');
            observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);
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
