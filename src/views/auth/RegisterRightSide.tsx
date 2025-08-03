import images from '../../assets/images';
import { Heart, Users, BookOpen, Award, TreePine, Globe, Lightbulb, Target } from 'lucide-react';
import { GlassCard } from '../../components/global';

export default function RegisterRightSide() {
    const nssCards = [
        {
            icon: Heart,
            title: "Community Service",
            message: "Serve with passion and make a difference"
        },
        {
            icon: Users,
            title: "Unity in Diversity",
            message: "Building bridges across communities"
        },
        {
            icon: BookOpen,
            title: "Education for All",
            message: "Empowering through knowledge and learning"
        },
        {
            icon: Award,
            title: "Excellence",
            message: "Striving for excellence in service"
        },
        {
            icon: TreePine,
            title: "Environment",
            message: "Protecting our planet for future generations"
        },
        {
            icon: Globe,
            title: "Social Impact",
            message: "Creating positive change in society"
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            message: "Creative solutions for social challenges"
        },
        {
            icon: Target,
            title: "Purpose Driven",
            message: "Working towards meaningful goals"
        }
    ];

    return (
        <div className="flex h-full bg-gradient-nss relative">
            {/* Logo and NSS APJKTU side by side */}
            <div className='flex items-center space-x-1 absolute top-8 left-8'>
                <img src={images.logo} className='w-16 h-16' alt="NSS Logo" />
                <h1 className="text-white font-isans text-lg">NSS APJKTU</h1>
            </div>

            {/* NSS Cards Grid */}
            <div className="flex flex-col justify-center items-center  ">
                <div className="grid grid-cols-2 gap-4 max-w-full w-full">
                    {nssCards.map((card, index) => (
                        <GlassCard
                            key={index}
                            icon={card.icon}
                            title={card.title}
                            message={card.message}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Attribution */}
            <div className='flex items-center space-x-2 absolute bottom-8 left-8'>
                <p className="text-white/80 font-isans text-sm">Designed and developed by</p>
                <div className='flex items-center space-x-1'>
                    {/* Hyphen Logo placeholder - replace with actual logo */}
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">H</span>
                    </div>
                    <span className="text-white font-isans font-semibold text-sm">Hyphen</span>
                </div>
            </div>
        </div>
    );
}
