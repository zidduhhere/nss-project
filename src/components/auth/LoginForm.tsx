import { useState } from 'react';
import { LogIn, Eye, EyeOff, } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(mobile, password);
      if (!success) {
        setError('Invalid mobile number or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto h-20 w-20 p-[2px] bg-gradient-to-r from-nss-400 to-nss-600 rounded-full mb-6">
          <div className="bg-nss-500 h-full w-full rounded-full flex items-center justify-center shadow-inner">
            <LogIn className='h-12 w-12 text-white' />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-black">
          Welcome Back
        </h2>
        <p className="text-black mt-2">Sign in to your NSS account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mobile Number */}
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-black mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-blue-400 rounded-lg focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 placeholder-gray-500"
            placeholder="Enter your mobile number"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border border-blue-400 rounded-lg focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 pr-12 placeholder-gray-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-nss-500 to-nss-600 hover:from-nss-600 hover:to-nss-700 text-white py-3 px-4 rounded-lg font-medium focus:ring-2 focus:ring-nss-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-black">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="bg-gradient-to-r from-nss-600 to-nss-700 bg-clip-text text-transparent hover:from-nss-700 hover:to-nss-800 font-medium transition-all duration-200"
          >
            Register here
          </button>
        </p>
      </div>


      {/* <div className="mt-8 p-4 bg-nss-50 border border-black rounded-lg">
        <p className="text-sm text-black font-medium mb-2 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Demo Accounts:
        </p>
        <div className="text-xs text-black space-y-1">
          <p className="font-mono bg-white px-2 py-1 rounded">Student: 9876543210 / password</p>
          <p className="font-mono bg-white px-2 py-1 rounded">Faculty: 9876543211 / password</p>
        </div>
      </div> */}
    </div>
  );
}