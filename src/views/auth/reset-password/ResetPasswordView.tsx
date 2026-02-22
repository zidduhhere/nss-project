import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/services/supabase';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordView() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase handles the token extraction from URL hash automatically
        // when using the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event) => {
                if (event === 'PASSWORD_RECOVERY') {
                    // User arrived via password reset link - ready to set new password
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-nss-50 via-white to-nss-100/30 font-isans flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-nss-500 to-nss-700 flex items-center justify-center shadow-lg">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-secondary-900">Reset Password</h1>
                        <p className="text-secondary-500 mt-2 text-sm">Enter your new password below</p>
                    </div>

                    {/* Success State */}
                    {success && (
                        <div className="text-center space-y-4">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">Password updated successfully! Redirecting to login...</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-800">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-lg border border-nss-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nss-500 bg-nss-50 pr-10"
                                        placeholder="Enter new password"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-800">Confirm Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-nss-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nss-500 bg-nss-50"
                                    placeholder="Confirm new password"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-full bg-nss-600 hover:bg-nss-700 disabled:bg-nss-300 text-white text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
