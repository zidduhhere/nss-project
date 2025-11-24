import HyphenLogo from '../../../components/ui/HyphenLogo';
import images from '@/assets/images';

export default function RegisterRightSide() {
    return (
        <div className=" font-isans flex flex-col h-full bg-gradient-nss relative overflow-hidden">
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

           {/* {Simple NSS related quote} */}
            <div className="flex-grow flex flex-col justify-center items-center px-6 text-center">
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-isans text-300 mb-4 md:mb-6">
                    "The best way to find yourself is to lose yourself in the service of others."
                </h2>
                <p className="text-white/80 text-lg md:text-xl lg:text-2xl">
                    - Mahatma Gandhi
                </p>
            </div>
            
            {/* Bottom Attribution */}
            <div className='absolute bottom-2 md:bottom-4 left-4 md:left-8 z-10'>
                <HyphenLogo />
            </div>
        </div>
    );
}
