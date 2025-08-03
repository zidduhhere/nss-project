import LoginForm from '../../../../components/auth/LoginForm';

interface LoginLeftSideProps {
    onSwitchToRegister: () => void;
}

export default function LoginLeftSide({ onSwitchToRegister }: LoginLeftSideProps) {
    return (
        <div className='flex items-center justify-center'>
            <LoginForm onSwitchToRegister={onSwitchToRegister} />
        </div>
    );
}
