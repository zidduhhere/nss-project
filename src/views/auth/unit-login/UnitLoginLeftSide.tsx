import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { UseAuthContext } from '@/context/AuthContext';
import ErrorMessage from '@/components/common/ErrorMessage';
import { TextField, FilledButton } from '@/components/ui';

export default function UnitLoginLeftSide() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { signInUser } = UseAuthContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setErrorMessage(null);

            // Call the authentication function
            const result = await signInUser(email, password);

            // Navigate based on the user role
            if (result.role === 'unit') {
                navigate('/dashboard/unit');
            } else {
                setErrorMessage("This login is for unit administrators only. Please use the correct login page.");
            }
        } catch (error) {
            setIsLoading(false);
            if (error instanceof Error) {
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
                {/* Back to Home - Desktop only */}
                <button
                    onClick={() => navigate('/')}
                    className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Home</span>
                </button>
                
                <form onSubmit={handleSubmit} className="w-full space-y-6 bg-white/60 backdrop-blur rounded-2xl p-8 shadow-lg lg:bg-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-black font-isans">Faculty Sign In</h2>
                        <p className="text-gray-600 text-sm mt-1">Access your unit dashboard</p>
                    </div>

                    {errorMessage && (
                        <ErrorMessage
                            message={errorMessage}
                            type="error"
                            onClose={() => setErrorMessage(null)}
                        />
                    )}

                    <div className="space-y-4">
                        <TextField
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="faculty@example.com"
                            name="email"
                            type="email"
                            disabled={isLoading}
                        />
                        
                        <TextField
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            name="password"
                            type="password"
                            showPasswordToggle
                            disabled={isLoading}
                        />
                    </div>
                    
                    <FilledButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isLoading}
                        isLoading={isLoading}
                        loadingText="Signing in..."
                        className="w-full"
                    >
                        Sign In
                    </FilledButton>
                    
                    <div className="text-center text-sm text-gray-600">
                        Not a faculty member?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-nss-600 hover:text-nss-700 hover:underline font-semibold"
                        >
                            Student Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
