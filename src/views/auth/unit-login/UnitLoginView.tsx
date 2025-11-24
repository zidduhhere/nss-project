import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, GraduationCap } from 'lucide-react';
import UnitLoginLeftSide from './UnitLoginLeftSide';
import UnitLoginRightSide from './UnitLoginRightSide';

export default function UnitLoginView() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (isMobile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-nss-600 via-blue-600 to-indigo-700 flex flex-col">
                {/* Back to Home Button */}
                <div className="pt-4 px-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </button>
                </div>
                
                {/* Header */}
                <div className="pt-4 pb-6 px-6">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-white text-3xl font-bold font-isans">NSS Portal</h1>
                            <p className="text-white/70 text-sm mt-1 font-isans">Faculty Sign In</p>
                        </div>
                    </div>
                </div>
                
                {/* Login Form Card */}
                <div className="flex-1 bg-white rounded-t-[2rem] shadow-2xl p-6 overflow-y-auto">
                    <UnitLoginLeftSide />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen md:bg-gradient-to-br md:from-nss-50 md:via-blue-50 md:to-indigo-100 flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full">
                <UnitLoginLeftSide />
                <UnitLoginRightSide />
            </div>
        </div>
    );
}
