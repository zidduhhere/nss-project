import { MapPin, Hash, ClipboardList, Camera, Database, Leaf } from 'lucide-react';
import FlowDiagram from '@/components/ui/FlowDiagram';

export const TreeTagWorkflowSection = () => {
    const steps = [
        { title: 'Location Identification', description: 'Select viable planting / existing tree site with GPS reference.', icon: <MapPin className="h-5 w-5" /> },
        { title: 'Tag Assignment', description: 'Unique alphanumeric code linked to species & batch.', icon: <Hash className="h-5 w-5" /> },
        { title: 'Baseline Logging', description: 'Record species, height, girth, condition & caretaker.', icon: <ClipboardList className="h-5 w-5" /> },
        { title: 'Photo Capture', description: 'Geo-tagged image for visual baseline & audits.', icon: <Camera className="h-5 w-5" /> },
        { title: 'Database Sync', description: 'Cloud registry update with structured metadata.', icon: <Database className="h-5 w-5" /> },
        { title: 'Periodic Monitoring', description: 'Growth metrics, health updates & maintenance actions.', icon: <Leaf className="h-5 w-5" /> },
    ];
    return (
        <FlowDiagram
            steps={steps}
            className="py-28 bg-tree-50 reveal-on-scroll"
            heading="Tree Tagging Workflow"
            subheading="Transparent chain improves ecological accountability & long-term survivability."
            cardBgClass="bg-white"
            lineColor="#3a5a40"
            lineWidth={3}
            lineDash="7 9"
            cardWidth={192}
            alternateYOffset={100}
            toggleLabels={{ show: 'Show Flow', hide: 'Hide Flow' }}
        />
    );
};
