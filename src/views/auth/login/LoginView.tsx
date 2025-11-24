import LoginLeftSide from './LoginLeftSide';
import LoginRightSide from './LoginRightSide';
import MobileLoginView from './MobileLoginView';
import { useEffect, useState } from 'react';

export default function LoginView() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Mobile / Tablet Layout
    if (isMobile) {
        return <MobileLoginView />;
    }

    // Desktop Layout
    return (
        <>
            <div className="min-h-screen md:bg-gradient-to-br md:from-nss-50 md:via-blue-50 md:to-indigo-100 flex items-center justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full">
                    {/* Left Side - Login Form */}
                    <LoginLeftSide />
                    {/* Right Side - NSS Branding */}
                    <LoginRightSide />
                </div>
            </div>
        </>
    );
}
