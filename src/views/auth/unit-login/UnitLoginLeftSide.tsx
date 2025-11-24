import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuthContext } from '@/context/AuthContext';
import ErrorMessage from '@/components/common/ErrorMessage';

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
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white/60 backdrop-blur rounded-2xl p-8 shadow">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-black font-isans">UNIT Sign In</h2>
                </div>

                {errorMessage && (
                    <ErrorMessage
                        message={errorMessage}
                        type="error"
                        onClose={() => setErrorMessage(null)}
                    />
                )}

                <div>
                    <label className="block text-sm font-medium text-black mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg bg-white/80"
                        placeholder="unit@example.com"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg bg-white/80"
                        placeholder="••••••"
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-nss-600 hover:bg-nss-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing In...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
                <div className="text-center text-xs text-gray-500">Switch to student? <a href="/login" className="text-nss-600 hover:underline">Student Login</a></div>
            </form>
        </div>
    );
}
