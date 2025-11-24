import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, HyphenLogo, FilledButton } from '@/components/ui';
import { UseAuthContext } from '@/context/AuthContext';
import ErrorMessage from '@/components/common/ErrorMessage';
import { images } from '@/assets/images';

import { loginSchema } from '@/types/LoginSchema';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { signInUser, logoutUser } = UseAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const clearError = () => setErrorMessage(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setErrorMessage(null);
            await loginSchema.parseAsync({ email, password });

            setIsLoading(true);
            const result = await signInUser(email, password);
            
            if (result.role === 'admin') {
                navigate('/dashboard/admin');
            } else {
                setErrorMessage('Access denied. Admin credentials required.');
                await logoutUser();
                
            }
        } catch (error) {
             if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 font-isans">
            <div className="w-full max-w-md">
                {/* Admin Badge */}
                <div className="text-center mb-8">
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
                    <p className="text-gray-600">Secure access for administrators</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center justify-center mb-6">
                        <img src={images.logo} alt="NSS Logo" className="w-16 h-16 mr-3" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">NSS APJKTU</h2>
                            <p className="text-sm text-gray-500">Administrator Login</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMessage && (
                            <ErrorMessage
                                message={errorMessage}
                                type="error"
                                onClose={clearError}
                            />
                        )}

                        <TextField
                            label="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@nss.edu"
                            name="email"
                            type="email"
                            required
                        />

                        <TextField
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            name="password"
                            type="password"
                            showPasswordToggle
                            required
                        />

                       <FilledButton
                            type='submit'
                            size='lg'
                            disabled={isLoading}
                            isLoading={isLoading}
                            className='justify-center w-full flex'
                       >
                           Sign In
                        </FilledButton>
                    </form>


                    {/* Footer Links */}

                    <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-2">
                        <HyphenLogo variant="light" className="justify-center mb-4" />
                        <p className="text-sm text-gray-600">
                            Not an admin?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                            >
                                Student Login
                            </button>
                        </p>
                        <p className="text-sm text-gray-600">
                            Faculty?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login/faculty')}
                                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                            >
                                Unit Login
                            </button>
                        </p>
                    </div>
                </div>

                {/* Bottom Attribution */}
               
            </div>
        </div>
    );
};

export default AdminLogin;
