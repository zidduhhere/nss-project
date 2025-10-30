import { UserPlus } from 'lucide-react';
import { TextField, Button } from '../ui';
import StudentInfo from './StudentInfo';
import NavTransitionLink from '../common/NavTransitionLink';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { useForm } from 'react-hook-form';
import { SubmitHandler } from 'react-hook-form';
import { FormFields, FormSchema } from '@/types/StudentFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { UseAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../common/SuccessModal';


export default function RegisterForm() {

  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<FormFields>({
    resolver: zodResolver(FormSchema)
  });

  const [showPassword, setShowPassword] = useState(false);
  const [externalError, setExternalError] = useState<string | false>(false);
  const { signUpUser, session } = UseAuthContext();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      setExternalError(false);
      console.log("Logged In")
      const result = await signUpUser(data)
      console.log(result);
      // Handle successful registration (e.g., show success message, redirect)
      if (session?.user) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);

          navigate('/dashboard/student');
        }, 1000);
      }
    }
    catch (error: any) {
      console.error(error);
      setExternalError(error.message || "An unexpected error occurred");
    }

  }


  return (
    <div className="w-full font-isans max-w-2xl mx-auto">


      {
        showSuccessModal && <SuccessModal
          title='Success'
          message="Account created successfully!" />
      }
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

      {isSubmitting && (
        <div className="mb-6 flex justify-center">
          <LoadingSpinner size="md" message="Processing your request..." />
        </div>
      )}

      {externalError && (
        <div className="mx-6 mb-6">
          <ErrorMessage
            message={externalError}
            type="error"
            onClose={() => { }}
          />
        </div>
      )}

      <form className="space-y-6 mx-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            {...register("fullName")}
            label="Full Name"
            type="text"
            error={errors.fullName}
            placeholder="Enter your full name"
            required

          />

          <TextField
            {...register("mobileNumber")}
            label="Mobile Number"
            type="tel"
            error={errors.mobileNumber}
            placeholder="Enter your mobile number"
            required
          />
        </div>

        <StudentInfo
          register={register}
          errors={errors}

        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            {...register("password")}
            label="Password"
            type='password'
            placeholder="Enter your password"
            showPasswordToggle
            showPassword={showPassword}
            error={errors.password}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />

          <TextField
            {...register("confirmPassword")}
            label="Confirm Password"
            type='password'
            placeholder="Confirm your password"
            showPasswordToggle
            error={errors.confirmPassword}
            required
          />
        </div>

        <div className='space-y-2'></div>
        <Button
          type="submit"
          loadingText="Creating Account..."
          size="md"
          variant="primary"
          isLoading={isSubmitting}
        >
          Create NSS Account
        </Button>
      </form>

      <div className="mt-4 text-center mb-24">
        <div className="text-nss-600 text-md">
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
        </div>

        <div className='text-nss-600 text-md'>
          <NavTransitionLink
            to="/home"
            showInlineSpinner
            showOverlaySpinner

            ariaLabel="Navigate to home page"
            textColorClass=" font-isans text-nss-700 hover:text-nss-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nss-500/40"
          >
            Back to Home
          </NavTransitionLink>
        </div>
      </div>
    </div>
  );
}