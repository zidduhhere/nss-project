export default function HyphenLogo() {
    return (
        <div className='flex items-center space-x-2'>
            <p className="text-white/80 font-isans text-sm">Designed and developed by</p>
            <div className='flex items-center space-x-1'>
                {/* Hyphen Logo placeholder - replace with actual logo */}
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">H</span>
                </div>
                <span className="text-white font-isans font-semibold text-sm">Hyphen</span>
            </div>
        </div>
    );
}
