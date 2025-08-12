import images from '@/assets/images/';

export default function LoginRightSide() {
    return (
        <div className="flex h-full bg-gradient-nss relative">
            {/* Logo and NSS APJKTU side by side */}
            <div className='flex items-center space-x-1 absolute top-8 left-8'>
                <img src={images.logo} className='w-16 h-16' alt="NSS Logo" />
                <h1 className="text-white font-isans text-lg">NSS APJKTU</h1>
            </div>

            <div className="flex flex-col justify-center text-center items-center mx-auto ">
                <h1 className="font-isans text-2xl md:text-4xl bg-clip-text text-white my-3">
                    Welcome to NSS Portal
                </h1>
                <p className="my-6 text-white font-isans  text-lg md:text-xl max-w-md font-extralight tracking-wide">
                    National Service Scheme - Building character through community service
                </p>
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
