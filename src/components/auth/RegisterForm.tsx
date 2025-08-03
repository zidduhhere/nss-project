import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useApp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
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
          address: formData.address
        })
      };

      const success = await register(userData);
      if (!success) {
        setError('Mobile number already exists');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-nss-700 mb-3">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-nss-50/50 border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 placeholder-nss-400 text-nss-800 font-medium"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-semibold text-nss-700 mb-3">
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-nss-50/50 border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 placeholder-nss-400 text-nss-800 font-medium"
              placeholder="Enter your mobile number"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-nss-700 mb-3">
            Role *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-4 bg-nss-50/50 border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 text-nss-800 font-medium"
            required
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        {formData.role === 'student' && (
          <div className="space-y-6 p-6 bg-gradient-to-r from-nss-50 to-blue-50 rounded-2xl border border-nss-200">
            <h3 className="text-lg font-bold text-nss-700 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-nss-700 mb-3">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 placeholder-nss-400 text-nss-800 font-medium"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label htmlFor="place" className="block text-sm font-semibold text-nss-700 mb-3">
                  Place *
                </label>
                <input
                  type="text"
                  id="place"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 placeholder-nss-400 text-nss-800 font-medium"
                  placeholder="Enter your place"
                  required
                />
              </div>

              <div>
                <label htmlFor="college" className="block text-sm font-semibold text-nss-700 mb-3">
                  College *
                </label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 placeholder-nss-400 text-nss-800 font-medium"
                  placeholder="Enter your college name"
                  required
                />
              </div>

              <div>
                <label htmlFor="fatherName" className="block text-sm font-semibold text-nss-700 mb-3">
                  Father's Name
                </label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 placeholder-nss-400 text-nss-800 font-medium"
                  placeholder="Enter father's name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-nss-700 mb-3">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-4 bg-white border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 placeholder-nss-400 text-nss-800 font-medium"
                placeholder="Enter your complete address"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-nss-700 mb-3">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-nss-50/50 border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 pr-12 placeholder-nss-400 text-nss-800 font-medium"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nss-500 hover:text-nss-700 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-nss-700 mb-3">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-nss-50/50 border-2 border-nss-200 rounded-xl focus:ring-2 focus:ring-nss-500 focus:border-nss-500 transition-all duration-200 pr-12 placeholder-nss-400 text-nss-800 font-medium"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nss-500 hover:text-nss-700 transition-colors p-1"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-nss-500 to-nss-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-nss-600 hover:to-nss-700 focus:ring-4 focus:ring-nss-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isLoading ? 'Creating Account...' : 'Create NSS Account'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-nss-600 text-lg">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-nss-700 hover:text-nss-800 font-bold transition-colors hover:underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}