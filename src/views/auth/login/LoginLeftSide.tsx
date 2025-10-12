import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@/components/ui';
import { useState, } from 'react';
import ErrorMessage from '@/components/common/ErrorMessage';
import z from 'zod';
import { UseAuthContext } from '@/context/AuthContext';
import { loginSchema } from '@/types/LoginSchema';
export default function LoginLeftSide() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const clearError = () => setErrorMessage(null);
    const { signInUser, logoutUser } = UseAuthContext();




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setErrorMessage(null);
            await loginSchema.parseAsync({ email, password });

            // Call the authentication function
            setIsLoading(true);
            const result = await signInUser(email, password);
            console.log(result);
            // Navigate based on the user role
            if (result.role === 'student') {
                navigate('/dashboard/student');
            } else if (result.role === 'unit') {
                navigate('/dashboard/unit');
            } else if (result.role === 'admin') {
                navigate('/dashboard/admin');
            }
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                setErrorMessage(error.issues.map(issue => issue.message).join(', '));
            } else if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex items-center justify-center w-full p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                <div className="space-y-4">
                    {errorMessage !== null && (
                        <ErrorMessage
                            message={errorMessage}
                            type="error"
                            onClose={() => clearError()}
                        />
                    )}
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your KTU ID / email"
                        name="identifier"
                        type="text"
                    />
                    <TextField
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        name="password"
                        type="password"
                        showPasswordToggle
                        showPassword={false}
                    />
                </div>
                <Button type="submit"
                    variant="primary"
                    size="md"
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    Sign In
                </Button>
                <div className="text-center space-y-3 pt-2">
                    <div className="text-sm text-nss-600">
                        Need an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="font-bold  text-nss-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nss-500/40"
                        >
                            Register
                        </button>
                    </div>
                    <div className="text-sm text-nss-500">
                        Are you faculty?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login/faculty')}
                            className="font-bold text-nss-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nss-500/40"
                        >
                            Login here
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}