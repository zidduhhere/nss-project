import LoginLeftSide from './LoginLeftSide';
import LoginRightSide from './LoginRightSide';

interface LoginViewProps {
    onSwitchToRegister: () => void;
}

export default function LoginView({ onSwitchToRegister }: LoginViewProps) {
    return (
        <div className="min-h-screen  md:bg-gradient-to-br md:from-nss-50 md:via-blue-50 md:to-indigo-100 flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full">
                {/* Left Side - Login Form */}
                <LoginLeftSide onSwitchToRegister={onSwitchToRegister} />

                {/* Right Side - NSS Branding */}
                <LoginRightSide />
            </div>
        </div>
    );
}
