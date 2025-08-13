import RegisterForm from '../../../components/forms/RegisterForm';

export default function RegisterLeftSide() {
    return (
        <div className="flex items-center justify-center ">
            <div className="w-full bg-white/70 pt-8">
                <RegisterForm
                    onRegister={async (credentials) => {
                        credentials.mobile = "+91" + credentials.mobile; // Ensure mobile number starts with +91
                        console.log("Register attempt with credentials:", credentials);
                        // Placeholder for register function
                        return false;
                    }}
                    isLoading={false} // Placeholder for loading state
                    error={null} // Placeholder for error message
                />
            </div>
        </div>
    );
}
