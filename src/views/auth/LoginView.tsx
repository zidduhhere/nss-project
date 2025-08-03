import images from '../../assets/images';
import LoginForm from '../../components/auth/LoginForm';

interface LoginViewProps {
    onSwitchToRegister: () => void;
}

export default function LoginView({ onSwitchToRegister }: LoginViewProps) {
    return (
        <div className="min-h-screen bg-white md:bg-gradient-to-br md:from-nss-50 md:via-blue-50 md:to-indigo-100 flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full">
                {/* Left Side - Branding */}
                <div className="flex flex-col justify-center items-center p-8 md:bg-">
                    <div className="text-center">
                        <div className='w-40 h-40 md:w-60 md:h-60 mx-auto'><img src={images.logo} alt="" /></div>

                        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-nss-700 to-nss-900 bg-clip-text text-transparent my-3" style={{ fontFamily: 'Instrument Sans Variable, Instrument Sans, sans-serif' }}>
                            Welcome to NSS Portal
                        </h1>
                        <p className="text-nss-600 text-lg md:text-xl max-w-md font-medium" style={{ fontFamily: 'Instrument Sans Variable, Instrument Sans, sans-serif' }}>
                            National Service Scheme - Building character through community service
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex items-center h-full justify-center p-8 bg-white lg:bg-gradient-radial lg:from-nss-800 lg:via-nss-600 lg:to-nss-400" style={{ backgroundImage: 'radial-gradient(ellipse at top left, rgb(30 58 138), rgb(37 99 235), rgb(96 165 250))' }}>
                    <div className="w-full max-w-md bg-white lg:bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200 lg:border-white/40">
                        <LoginForm onSwitchToRegister={onSwitchToRegister} />
                    </div>
                </div>
            </div>
        </div>
    );
}
