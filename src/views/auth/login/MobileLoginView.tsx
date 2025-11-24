import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Home } from 'lucide-react';
import { TextField, FilledButton } from '@/components/ui';
import ErrorMessage from '@/components/common/ErrorMessage';
import { UseAuthContext } from '@/context/AuthContext';
import { loginSchema } from '@/types/LoginSchema';
import z from 'zod';

export default function MobileLoginView() {
    const navigate = useNavigate();
    const { signInUser } = UseAuthContext();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setErrorMessage(null);
            await loginSchema.parseAsync({ email, password });
            
            setIsLoading(true);
            const result = await signInUser(email, password);
            
            // Navigate based on user role
            const roleRoutes: Record<string, string> = {
                student: '/dashboard/student',
                unit: '/dashboard/unit',
                admin: '/dashboard/admin',
            };
            
            if (result.role && roleRoutes[result.role]) {
                navigate(roleRoutes[result.role]);
            } else {
                setErrorMessage("Unknown user role. Please contact support.");
            }
        } catch (error) {
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
        <div className="min-h-screen bg-gradient-to-br from-nss-600 via-nss-800 to-indigo-700 flex flex-col">
            {/* Back to Home Button */}
            <div className="pt-4 px-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Home</span>
                </button>
            </div>
            
            {/* Header */}
            <div className="pt-4 pb-6 px-6">
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-white text-3xl font-bold font-isans">NSS Portal</h1>
                        <p className="text-white/70 text-sm mt-1 font-isans">Sign in to continue</p>
                    </div>
                </div>
            </div>

            {/* Login Form Card */}
            <div className="flex-1 bg-white rounded-t-[2rem] shadow-2xl p-6 overflow-y-auto">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                    {/* Error Message */}
                    {errorMessage && (
                        <ErrorMessage
                            message={errorMessage}
                            type="error"
                            onClose={() => setErrorMessage(null)}
                        />
                    )}

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            name="email"
                            type="email"
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

                    {/* Submit Button */}
                    <FilledButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isLoading}
                        isLoading={isLoading}
                        loadingText="Signing in..."
                        className="w-full"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <LogIn className="w-5 h-5" />
                            <span>Sign In</span>
                        </div>
                    </FilledButton>

                    {/* Divider */}
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-gray-500">New to NSS?</span>
                        </div>
                    </div>

                    {/* Action Links */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-nss-50 text-nss-700 rounded-full font-semibold hover:bg-nss-100 transition-colors shadow-sm"
                        >
                            <UserPlus className="w-5 h-5" />
                            <span>Create Account</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
