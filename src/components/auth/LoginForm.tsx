import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TextField, Button } from '@/components/ui';

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
        <h2 className="text-2xl font-bold text-black font-isans">
          Welcome Back
        </h2>
        <p className="font-isans text-black mt-2">Sign in to your NSS account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mobile Number */}
        <TextField
          label="Mobile Number"
          type="tel"
          id="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter your mobile number"
          required
        />

        {/* Password */}
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          required
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          loadingText="Signing in..."
          size="md"
          variant="primary"
        >
          Sign In
        </Button>
      </form>

      {/* Forgot Password Button */}
      <div className="mt-4 text-left">
        <button
          className="text-sm text-nss-600 hover:text-nss-700 transition-colors duration-200"
          onClick={() => {
            // TODO: Implement forgot password functionality
            console.log('Forgot password clicked');
          }}
        >
          Forgot Password?
        </button>
      </div>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-black">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="bg-gradient-to-r font-bold font-isans from-nss-600 to-nss-700 bg-clip-text text-transparent hover:from-nss-700 hover:to-nss-800 transition-all duration-200"
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