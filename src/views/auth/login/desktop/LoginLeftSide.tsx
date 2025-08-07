import LoginForm from '../../../../components/forms/LoginForm';

interface LoginLeftSideProps {
    onSwitchToRegister: () => void;
}

export default function LoginLeftSide({ onSwitchToRegister }: LoginLeftSideProps) {
    return (
        <div className='flex items-center justify-center'>
            <LoginForm onSwitchToRegister={onSwitchToRegister}
                onLogin={async (credentials) => {
                    credentials.mobile = "+91" + credentials.mobile; // Ensure mobile number starts with +91
                    console.log("Login attempt with credentials:", credentials);
                    // Placeholder for login function
                    return false;
                }}
                isLoading={false} // Placeholder for loading state
                error={null} // Placeholder for error message
            />
        </div>
    );
}
