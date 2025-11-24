import { Activity, Users, ShieldCheck, Syringe, HandHeart, HeartPulse } from 'lucide-react';
import FlowDiagram from '@/components/ui/FlowDiagram';

export const BloodFlowSection = () => {
    const steps = [
        { title: 'Awareness & Outreach', description: 'Campaigns & orientation sessions', icon: <Activity className="h-5 w-5" /> },
        { title: 'Registration Drive', description: 'Mobilizing willing donors', icon: <Users className="h-5 w-5" /> },
        { title: 'Camp Coordination', description: 'Logistics & partner hospitals', icon: <ShieldCheck className="h-5 w-5" /> },
        { title: 'Safe Collection', description: 'Medical supervision & hygiene', icon: <Syringe className="h-5 w-5" /> },
        { title: 'Recognition & Reporting', description: 'Certificates & impact metrics', icon: <HandHeart className="h-5 w-5" /> },
        { title: 'Follow-Up & Retention', description: 'Thank-you + next drive nurture', icon: <HeartPulse className="h-5 w-5" /> },
    ];
    return (
        <FlowDiagram
            steps={steps}
            className="py-28 bg-blood-50 reveal-on-scroll"
            heading="NSS Role Flow"
            subheading="A structured lifecycle that drives sustainable donor engagement and safe collection practices."
            cardBgClass="bg-white"
            lineColor="#770b13"
            lineWidth={3}
            lineDash="7 9"
            cardWidth={192}
            alternateYOffset={100}
            toggleLabels={{ show: 'Show Flow', hide: 'Hide Flow' }}
        />
    );
};
