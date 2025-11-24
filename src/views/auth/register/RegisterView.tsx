import RegisterLeftSide from './RegisterLeftSide';
import RegisterRightSide from './RegisterRightSide';
import { useEffect, useState } from 'react';
export default function RegisterView() {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        }
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize(); // Initial check
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 md:w-screen flex items-center justify-center">
            <div className="grid lg:grid-cols-2 w-full h-screen max-w-screen">
                {/* Left Side - Register Form */}
                <RegisterLeftSide />

                {!isMobile && (
                    <div className="h-full">
                        <RegisterRightSide />
                    </div>
                )}
                {/* Right Side - NSS Mission Cards */}

            </div>
        </div>
    );
}
