import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/ui/Footer';
import { BloodHeroSection } from './sections/HeroSection';
import { BloodStatsSection } from './sections/StatsSection';
import { BloodImportanceSection } from './sections/ImportanceSection';
import { BloodFlowSection } from './sections/FlowSection';
import { RudhirasenaSection } from './sections/RudhirasenaSection';
import { CoordinatorsSection } from './sections/CoordinatorsSection';
import { FinalCTA } from '@/components/ui/FinalCTA';

export default function BloodDonationView() {

    return (
        <div className="min-h-screen  font-isans bg-white">
            <Navbar />
            <main className="">
                <BloodHeroSection />
                <BloodStatsSection />
                <BloodImportanceSection />
                <BloodFlowSection />
                <RudhirasenaSection />
                <CoordinatorsSection />
            </main>
            <FinalCTA />
            <Footer />
        </div>
    );
}
