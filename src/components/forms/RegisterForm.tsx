import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { TextField, Button } from '../ui';
import StudentInfo from './StudentInfo';
import NavTransitionLink from '../common/NavTransitionLink';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import Student from '@/models/student';
import { validateRegisterForm } from '@/utils/validationUtils';

interface RegisterFormProps {
  onRegister: (userData: Student, password: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  onErrorClear?: () => void;  // New prop for clearing errors
}

export default function RegisterForm({ onRegister, isLoading, error: externalError, onErrorClear }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    district: '',
    college: '',
    ktuRegistrationNumber: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Add validation logic here
    const { isValid, error } = validateRegisterForm({
      name: formData.name,
      mobile: formData.mobile,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      district: formData.district,
      college: formData.college,
      ktuRegistrationNumber: formData.ktuRegistrationNumber,
      email: formData.email
    });

    if (isValid) {


      // Create Student object from form data
      const student: Student = {
        id: '',
        name: formData.name,
        email: formData.email,
        mobile_number: formData.mobile,
        ktu_id: formData.ktuRegistrationNumber,
        college_id: formData.college
      };

      // Use the onRegister prop from parent component
      await onRegister(student, formData.password);
    };

  }

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

      {isLoading && (
        <div className="mb-6 flex justify-center">
          <LoadingSpinner size="md" message="Processing your request..." />
        </div>
      )}

      {externalError && (
        <div className="mx-6 mb-6">
          <ErrorMessage
            message={externalError}
            type="error"
            onClose={onErrorClear}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mx-6">
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

        <StudentInfo
          formData={{
            district: formData.district,
            college: formData.college,
            ktuRegistrationNumber: formData.ktuRegistrationNumber,
            email: formData.email
          }}
          onChange={handleChange}
        />

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

        <div className='space-y-2'></div>
        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
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
          <NavTransitionLink
            to="/login"
            showInlineSpinner
            showOverlaySpinner
            ariaLabel="Navigate to login form"
            textColorClass="font-bold font-isans text-nss-700 hover:text-nss-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nss-500/40"
          >
            Sign in here
          </NavTransitionLink>
        </p>
      </div>
    </div>
  );
}