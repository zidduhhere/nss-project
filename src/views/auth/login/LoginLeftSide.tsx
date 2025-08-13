import LoginForm from '@/components/forms/LoginForm';

export default function LoginLeftSide() {
    return (
        <div className='flex items-center justify-center'>
            <LoginForm
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
