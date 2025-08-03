import RegisterForm from '../../components/auth/RegisterForm';

interface RegisterViewProps {
    onSwitchToLogin: () => void;
}

export default function RegisterView({ onSwitchToLogin }: RegisterViewProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-nss-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="grid lg:grid-cols-2 gap-8 w-full max-w-7xl">
                {/* Left Side - NSS Mission Cards */}
                <div className="hidden lg:flex flex-col justify-center items-center p-8 space-y-8">
                    <div className="text-center space-y-4 mb-8">
                        <div className="mx-auto h-32 w-32 p-[4px] bg-gradient-to-r from-nss-400 to-nss-600 rounded-full animate-pulse">
                            <div className="bg-white h-full w-full rounded-full flex items-center justify-center shadow-inner">
                                <span className="text-nss-600 font-bold text-4xl">NSS</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-nss-700 to-nss-900 bg-clip-text text-transparent">
                            Join NSS Today
                        </h1>
                        <p className="text-nss-600 text-xl">
                            Be the change you want to see in the world
                        </p>
                    </div>

                    {/* Mission Cards */}
                    <div className="space-y-6 max-w-md">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-nss-200 hover:shadow-lg transition-all duration-300">
                            <h3 className="font-bold text-nss-700 text-lg mb-2">Community Service</h3>
                            <p className="text-nss-600">Engage in meaningful community development projects and make a real difference.</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-nss-200 hover:shadow-lg transition-all duration-300">
                            <h3 className="font-bold text-nss-700 text-lg mb-2">Personal Growth</h3>
                            <p className="text-nss-600">Develop leadership skills, social awareness, and civic responsibility.</p>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-nss-200 hover:shadow-lg transition-all duration-300">
                            <h3 className="font-bold text-nss-700 text-lg mb-2">Network Building</h3>
                            <p className="text-nss-600">Connect with like-minded individuals and build lasting friendships.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="flex items-center justify-center p-8">
                    <div className="w-full bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 max-h-[90vh] overflow-y-auto">
                        <RegisterForm onSwitchToLogin={onSwitchToLogin} />
                    </div>
                </div>
            </div>
        </div>
    );
}
