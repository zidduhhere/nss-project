import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { LoginCredentials } from '../../models';
import { validateMobile, validateRequired } from '../../utils';
import { ErrorMessage, LoadingSpinner } from '../common';
import { images } from '../../assets/images';

interface LoginFormProps {
    onLogin: (credentials: LoginCredentials) => Promise<boolean>;
    onSwitchToRegister: () => void;
    isLoading: boolean;
    error: string | null;
}

export default function LoginForm({ onLogin, onSwitchToRegister, isLoading, error }: LoginFormProps) {
    const [formData, setFormData] = useState<LoginCredentials>({
        mobile: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        const mobileValidation = validateMobile(formData.mobile);
        if (!mobileValidation.isValid) {
            errors.mobile = mobileValidation.error!;
        }

        const passwordValidation = validateRequired(formData.password, 'Password');
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.error!;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onLogin(formData);
    };

    const handleChange = (field: keyof LoginCredentials, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full ">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                        <img src={images.logo} alt="NSS Logo" className="h-10 w-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">NSS Portal Login</h1>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            id="mobile"
                            value={formData.mobile}
                            onChange={(e) => handleChange('mobile', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${fieldErrors.mobile ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter your mobile number"
                            disabled={isLoading}
                        />
                        {fieldErrors.mobile && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.mobile}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 ${fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your password"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {fieldErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                        )}
                    </div>

                    {error && <ErrorMessage message={error} type="error" />}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span className="ml-2">Signing in...</span>
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-blue-600 hover:text-blue-500 font-medium"
                            disabled={isLoading}
                        >
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
