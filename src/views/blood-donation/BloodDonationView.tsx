import Navbar from '@/components/common/Navbar';
import { FooterSection } from '@/views/home/sections/FooterSection';
import { BloodHeroSection } from './sections/HeroSection';
import { BloodStatsSection } from './sections/StatsSection';
import { BloodImportanceSection } from './sections/ImportanceSection';
import { BloodFlowSection } from './sections/FlowSection';
import { RudhirasenaSection } from './sections/RudhirasenaSection';
import { CoordinatorsSection } from './sections/CoordinatorsSection';
import { FinalCTASection } from '../home/sections/FinalCTASection';

export default function BloodDonationView() {

    return (
        <div className="min-h-screen bg-nss-50 font-isans text-secondary-800">
            <Navbar />
            <main className="pt-32">
                <BloodHeroSection />
                <BloodStatsSection />
                <BloodImportanceSection />
                <BloodFlowSection />
                <RudhirasenaSection />
                <CoordinatorsSection />
            </main>
            <FinalCTASection />
            <FooterSection />
        </div>
    );
}
