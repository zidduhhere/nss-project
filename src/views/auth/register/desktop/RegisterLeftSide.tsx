import RegisterForm from '../../../../components/auth/RegisterForm';

interface RegisterLeftSideProps {
    onSwitchToLogin: () => void;
}

export default function RegisterLeftSide({ onSwitchToLogin }: RegisterLeftSideProps) {
    return (
        <div className="flex items-center justify-center ">
            <div className="w-full bg-white/70 pt-8">
                <RegisterForm onSwitchToLogin={onSwitchToLogin} />
            </div>
        </div>
    );
}
