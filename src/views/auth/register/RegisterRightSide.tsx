import { GlassCard } from '../../../components/ui';
import { nssCards } from '../../../utils/CardDetails';
import HyphenLogo from '../../../components/ui/HyphenLogo';
import images from '@/assets/images';

export default function RegisterRightSide() {
    return (
        <div className="flex flex-col h-full bg-gradient-nss relative overflow-hidden">
            {/* Logo and NSS APJKTU side by side */}
            <div className='flex items-center space-x-2 md:space-x-4 absolute top-4 md:top-8 left-4 md:left-8 z-10'>
                <img
                    src={images.logo}
                    alt="Rudhirasena Logo"
                    className='size-14'
                />
                <h1 className="text-white font-isans text-sm md:text-base lg:text-lg font-medium">
                    NSS APJKTU
                </h1>
            </div>

            {/* NSS Cards Grid - with proper spacing from top */}
            <div className="flex-1 flex items-center justify-center px-4 md:px-8 lg:px-10 pt-20 md:pt-24 lg:pt-28 pb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-5 w-full max-w-2xl">
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
            <div className='absolute bottom-4 md:bottom-8 left-4 md:left-8 z-10'>
                <HyphenLogo />
            </div>
        </div>
    );
}
