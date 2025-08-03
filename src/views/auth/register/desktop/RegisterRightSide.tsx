import images from '../../../../assets/images';
import { GlassCard } from '../../../common';
import { nssCards } from '../../../../utils/CardDetails';
import HyphenLogo from '../../../../utils/HyphenLogo';

export default function RegisterRightSide() {
    return (
        <div className="flex h-full bg-gradient-nss relative">
            {/* Logo and NSS APJKTU side by side */}
            <div className='flex items-center space-x-1 absolute top-8 left-8'>
                <img src={images.logo} className='w-16 h-16' alt="NSS Logo" />
                <h1 className="text-white font-isans text-lg">NSS APJKTU</h1>
            </div>

            {/* NSS Cards Grid */}
            <div className="flex flex-col justify-center items-center w-full mx-10  ">
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
            <div className='absolute bottom-8 left-8'>
                <HyphenLogo />
            </div>
        </div>
    );
}
