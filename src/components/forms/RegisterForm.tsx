import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { TextField, Dropdown, Button } from '../ui';
import StudentInfo from './StudentInfo';
import { NAVIGATION_TRANSITION_DELAY } from '@/config/constants';

interface RegisterFormProps {
  onRegister: (userData: any) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export default function RegisterForm({ onRegister, isLoading: externalLoading, error: externalError }: RegisterFormProps) {
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
    address: '',
    ktuRegistrationNumber: '',
    unitNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const [navLoading, setNavLoading] = useState(false);
  const navigate = useNavigate();

  // Use external loading/error states or fallback to internal ones
  const currentLoading = externalLoading;
  const currentError = externalError || error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const userData = {
        name: formData.name,
        mobile: formData.mobile,
        role: formData.role,
        password: formData.password,
        ...(formData.role === 'student' && {
          age: parseInt(formData.age),
          place: formData.place,
          college: formData.college,
          fatherName: formData.fatherName,
          address: formData.address,
          ktuRegistrationNumber: formData.ktuRegistrationNumber,
          unitNumber: formData.unitNumber
        })
      };

      const success = await onRegister(userData);
      if (!success && !externalError) {
        setError('Mobile number already exists');
      }
    } catch (err) {
      if (!externalError) {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto h-24 w-24 p-[3px] bg-gradient-to-r from-nss-400 to-nss-600 rounded-full mb-8">
          <div className="bg-white h-full w-full rounded-full flex items-center justify-center shadow-inner">
            <UserPlus className='h-12 w-12 text-nss-600' />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-nss-700 to-nss-900 bg-clip-text text-transparent mb-2">
          Create Account
        </h2>
        <p className="text-nss-600 text-lg">Join the NSS community today</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Full Name *"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <TextField
            label="Mobile Number *"
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            required
          />
        </div>

        <Dropdown
          label="Role *"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={['Student', 'Faculty']}
          required
        />

        {formData.role === 'student' && (
          <StudentInfo
            formData={{
              age: formData.age,
              place: formData.place,
              college: formData.college,
              fatherName: formData.fatherName,
              address: formData.address,
              ktuRegistrationNumber: formData.ktuRegistrationNumber,
              unitNumber: formData.unitNumber
            }}
            onChange={handleChange}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Password *"
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />

          <TextField
            label="Confirm Password *"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            required
          />
        </div>

        {currentError && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-medium">
            {currentError}
          </div>
        )}

        <div className='space-y-2'></div>
        <Button
          type="submit"
          disabled={currentLoading}
          isLoading={currentLoading}
          loadingText="Creating Account..."
          size="md"
          variant="primary"
        >
          Create NSS Account
        </Button>
      </form>

      <div className="mt-4 text-center mb-24">
        <p className="text-nss-600 text-md">
          Already have an account?{' '}
          <button
            disabled={navLoading}
            onClick={() => {
              setNavLoading(true);
              requestAnimationFrame(() => setTimeout(() => navigate('/login'), NAVIGATION_TRANSITION_DELAY));
            }}
            className="relative text-nss-700 hover:text-nss-800 font-bold transition-colors hover:underline disabled:opacity-60"
          >
            {navLoading && (
              <span className="absolute -left-6 top-1/2 -translate-y-1/2 inline-flex h-4 w-4">
                <span className="animate-spin h-4 w-4 rounded-full border-2 border-nss-600 border-t-transparent" />
              </span>
            )}
            Sign in here
          </button>
        </p>
      </div>
      {navLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="h-12 w-12 rounded-full border-4 border-nss-600 border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}