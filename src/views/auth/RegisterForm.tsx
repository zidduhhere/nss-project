import { useState } from 'react';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { RegisterData } from '../../models';
import { validateMobile, validatePassword, validateRequired, validateNumber } from '../../utils';
import { ErrorMessage, LoadingSpinner } from '../common';

interface RegisterFormProps {
    onRegister: (userData: RegisterData) => Promise<boolean>;
    onSwitchToLogin: () => void;
    isLoading: boolean;
    error: string | null;
}

export default function RegisterForm({ onRegister, onSwitchToLogin, isLoading, error }: RegisterFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        role: 'student' as 'student' | 'faculty',
        age: '',
        place: '',
        college: '',
        fatherName: '',
        address: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Validate required fields
        const nameValidation = validateRequired(formData.name, 'Name');
        if (!nameValidation.isValid) {
            errors.name = nameValidation.error!;
        }

        const mobileValidation = validateMobile(formData.mobile);
        if (!mobileValidation.isValid) {
            errors.mobile = mobileValidation.error!;
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.error!;
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        // Validate student-specific fields
        if (formData.role === 'student') {
            if (formData.age) {
                const ageValidation = validateNumber(formData.age, 'Age', 16, 35);
                if (!ageValidation.isValid) {
                    errors.age = ageValidation.error!;
                }
            }

            const placeValidation = validateRequired(formData.place, 'Place');
            if (!placeValidation.isValid) {
                errors.place = placeValidation.error!;
            }

            const collegeValidation = validateRequired(formData.college, 'College');
            if (!collegeValidation.isValid) {
                errors.college = collegeValidation.error!;
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const userData: RegisterData = {
            name: formData.name,
            mobile: formData.mobile,
            role: formData.role,
            password: formData.password,
            ...(formData.role === 'student' && {
                age: formData.age ? parseInt(formData.age) : undefined,
                place: formData.place,
                college: formData.college,
                fatherName: formData.fatherName || undefined,
                address: formData.address || undefined
            })
        };

        await onRegister(userData);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-600 mt-2">Join the NSS Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${fieldErrors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your full name"
                                disabled={isLoading}
                            />
                            {fieldErrors.name && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                value={formData.mobile}
                                onChange={(e) => handleChange('mobile', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${fieldErrors.mobile ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your mobile number"
                                disabled={isLoading}
                            />
                            {fieldErrors.mobile && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.mobile}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Role *
                        </label>
                        <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12 ${fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-12 ${fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Confirm password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {formData.role === 'student' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        id="age"
                                        value={formData.age}
                                        onChange={(e) => handleChange('age', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${fieldErrors.age ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your age"
                                        min="16"
                                        max="35"
                                        disabled={isLoading}
                                    />
                                    {fieldErrors.age && (
                                        <p className="mt-1 text-sm text-red-600">{fieldErrors.age}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-2">
                                        Place *
                                    </label>
                                    <input
                                        type="text"
                                        id="place"
                                        value={formData.place}
                                        onChange={(e) => handleChange('place', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${fieldErrors.place ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your place"
                                        disabled={isLoading}
                                    />
                                    {fieldErrors.place && (
                                        <p className="mt-1 text-sm text-red-600">{fieldErrors.place}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">
                                        College *
                                    </label>
                                    <input
                                        type="text"
                                        id="college"
                                        value={formData.college}
                                        onChange={(e) => handleChange('college', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${fieldErrors.college ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your college name"
                                        disabled={isLoading}
                                    />
                                    {fieldErrors.college && (
                                        <p className="mt-1 text-sm text-red-600">{fieldErrors.college}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Father's Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fatherName"
                                        value={formData.fatherName}
                                        onChange={(e) => handleChange('fatherName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        placeholder="Enter father's name"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Enter your address"
                                    rows={3}
                                    disabled={isLoading}
                                />
                            </div>
                        </>
                    )}

                    {error && <ErrorMessage message={error} type="error" />}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span className="ml-2">Creating Account...</span>
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-green-600 hover:text-green-500 font-medium"
                            disabled={isLoading}
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
