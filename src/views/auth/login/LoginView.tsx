import LoginLeftSide from './LoginLeftSide';
import LoginRightSide from './LoginRightSide';
import { useState, useEffect } from 'react';

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

    // Mobile/Tablet Layout
    if (isMobile) {
        return (
            <div className="min-h-screen bg-gradient-nss flex flex-col">
                {/* Mobile Header */}

                <div className="p-6 text-center">
                    <h1 className="text-white text-2xl font-bold font-isans mb-2">NSS Portal</h1>
                    <p className="text-white/80 font-isans">Sign in to continue</p>
                </div>

                {/* Mobile Login Form */}
                <div className="flex-1 bg-white/10 backdrop-blur-lg mx-4 mb-4 rounded-3xl p-6">
                    <LoginLeftSide />
                </div>
            </div>
        );
    }

    // Desktop Layout
    return (
        <div className="min-h-screen md:bg-gradient-to-br md:from-nss-50 md:via-blue-50 md:to-indigo-100 flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full">
                {/* Left Side - Login Form */}
                <LoginLeftSide />
                {/* Right Side - NSS Branding */}
                <LoginRightSide />
            </div>
        </div>
    );
}
