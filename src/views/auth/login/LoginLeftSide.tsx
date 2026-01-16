import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
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
    const { signInUser } = UseAuthContext();




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
            else {
                setErrorMessage("Unknown user role. Please contact support.");
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
            <div className="w-full max-w-md">
                {/* Back to Home Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Home</span>
                </button>
                
                <form onSubmit={handleSubmit} className="w-full space-y-6">
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
                        placeholder="Enter your email"
                        name="identifier"
                        type="text"
                        className='text-black'
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
                </div>
            </form>
            </div>
        </div>
    );
}