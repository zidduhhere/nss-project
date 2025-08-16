import { useState } from 'react';
/**
 * LoginForm
 * -------------
 * A single unified login form component that supports BOTH student and faculty
 * authentication flows through the `roleMode` prop.
 *
 * Core ideas:
 * - Identifier Field Switching:
 *   Students authenticate with their KTU ID, while faculty use an Email ID.
 *   The label / input type changes automatically based on `roleMode`.
 * - External vs Internal State:
 *   Loading & error states can be driven by a parent (e.g. async auth calls) via
 *   the `isLoading` and `error` props. If an auth attempt fails and no external
 *   error is supplied, the component sets an internal, role-aware error string.
 * - Navigation Enhancements:
 *   Uses <NavTransitionLink /> for smoother route transitions with optional
 *   inline / overlay spinners. Secondary link switches between student / faculty
 *   login depending on context.
 * - Accessibility & UX:
 *   Provides clear labeling, required attributes, password visibility toggle,
 *   and concise error messaging adjusted per role (KTU ID vs email).
 *
 * Props Contract:
 * - onLogin: (credentials) => Promise<boolean>
 *     Should resolve to true on success, false on invalid credentials.
 * - isLoading: externally controlled loading indicator for submit button.
 * - error: externally supplied error message (overrides internal one if present).
 * - hideRegisterLink: suppresses the register prompt (used for faculty login).
 * - secondaryLinkMode: decides which alternate login link to show (faculty|student).
 * - roleMode: selects identifier semantics ('student' => KTU ID, 'faculty' => Email).
 *
 * Failure Messaging Logic:
 * - If onLogin returns false and no external error is provided, an internal
 *   message like `Invalid KTU ID or password` or `Invalid email or password` is set.
 * - Unexpected exceptions fall back to a generic retry message.
 */
import { LogIn } from 'lucide-react';
import NavTransitionLink from '../common/NavTransitionLink';
import { TextField, Button } from '../ui';
// import { NAVIGATION_TRANSITION_DELAY } from '@/config/constants'; // no longer needed after NavTransitionLink abstraction

interface LoginFormProps {
  onLogin: (credentials: { identifier: string; password: string }) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  hideRegisterLink?: boolean; // hide register for faculty login
  secondaryLinkMode?: 'faculty' | 'student'; // controls the bottom alternate link
  roleMode?: 'student' | 'faculty'; // determines which identifier field to show
}

export default function LoginForm({ onLogin, isLoading: externalLoading, error: externalError, hideRegisterLink = false, secondaryLinkMode = 'faculty', roleMode = 'student' }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [navLoading, setNavLoading] = useState(false);
  // const navigate = useNavigate(); // no longer used; NavTransitionLink handles navigation

  // Use external loading/error states or fallback to internal ones
  const currentLoading = externalLoading;
  const currentError = externalError || error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await onLogin({ identifier, password });
      if (!success && !externalError) {
        const idLabel = roleMode === 'student' ? 'KTU ID' : 'email';
        setError(`Invalid ${idLabel} or password`);
      }
    } catch (err) {
      if (!externalError) {
        setError('Login failed. Please try again.');
      }
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
        {/* Identifier Field (Dynamic: KTU ID for students, Email for faculty) */}
        {roleMode === 'student' && (
          <TextField
            label="KTU ID"
            type="text"
            id="ktuId"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your KTU Registration ID"
            required
          />
        )}
        {roleMode === 'faculty' && (
          <TextField
            label="Email ID"
            type="email"
            id="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your institutional email"
            required
          />
        )}

        {/* Password Field (with show / hide toggle) */}
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

        {/* Error Message (externalError takes precedence unless absent) */}
        {currentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-600">
            <span>{currentError}</span>
          </div>
        )}        {/* Submit Button */}
        <Button
          type="submit"
          disabled={currentLoading}
          isLoading={currentLoading}
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

      <div className="mt-6 text-center">
        {!hideRegisterLink && (
          <p className="text-black">
            Don't have an account?{' '}
            <NavTransitionLink
              to="/register"
              navLoading={navLoading}
              setNavLoadingExternal={setNavLoading}
              showInlineSpinner
              showOverlaySpinner
              ariaLabel="Navigate to registration form"
            >
              Register here
            </NavTransitionLink>
          </p>
        )}
        {secondaryLinkMode === 'faculty' && (
          <p className="text-xs text-secondary-600 mt-4">
            Faculty member?{' '}
            <NavTransitionLink
              to="/login/faculty"
              textColorClass="font-medium text-nss-600 hover:text-nss-700 hover:underline"
              ariaLabel="Navigate to faculty login"
              showInlineSpinner={false}
              showOverlaySpinner={false}
            >
              Faculty Login
            </NavTransitionLink>
          </p>
        )}
        {secondaryLinkMode === 'student' && (
          <p className="text-xs text-secondary-600 mt-4">
            Student member?{' '}
            <NavTransitionLink
              to="/login"
              textColorClass="font-medium text-nss-600 hover:text-nss-700 hover:underline"
              ariaLabel="Navigate to student login"
              showInlineSpinner={false}
              showOverlaySpinner={false}
            >
              Student Login
            </NavTransitionLink>
          </p>
        )}
      </div>
    </div>
  );
}