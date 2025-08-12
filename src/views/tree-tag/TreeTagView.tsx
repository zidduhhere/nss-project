import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';
import { FinalCTA } from '@/components/ui/FinalCTA';
import { TreeTagHeroSection } from './sections/HeroSection';
import { TreeTagStatsSection } from './sections/StatsSection';
import { TreeTagImpactSection } from './sections/ImpactSection';
import { TreeTagWorkflowSection } from './sections/WorkflowSection';
import { GreenCampusSection } from './sections/FlagshipSection';
import { StewardsSection } from './sections/StewardsSection';

export default function TreeTagView() {
    return (
        <div className="min-h-screen font-isans bg-white">
            <Navbar />
            <main>
                <TreeTagHeroSection />
                <TreeTagStatsSection />
                <TreeTagImpactSection />
                <TreeTagWorkflowSection />
                <GreenCampusSection />
                <StewardsSection />
            </main>
            <FinalCTA />
            <Footer />
        </div>
    );
}
