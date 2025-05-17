'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// Date picker components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TextInputField from '@/components/shared/TextInputField.jsx';
import OtpVerificationModal from '@/pages/SignUp/OtpVerificationModal.jsx';
import SubmitButton from '@/components/shared/SubmitButton.jsx';
import AuthLink from '@/components/shared/AuthLink.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import { PureCalendar } from '@/components/ui/pure-calendar.js';

function SignUpForm() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    dateOfBirth: undefined,
  });
  const [error, setError] = useState(null);
  const [yearInput, setYearInput] = useState('2007'); // Initial year set to 2007
  const [yearError, setYearError] = useState('');
  const [currentYear, setCurrentYear] = useState(2007); // Initial year set to 2007
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [calendarKey, setCalendarKey] = useState(0); // To force re-render
  const { handleSignUp } = useAuth();

  // OTP modal state
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle year input change
  const handleYearChange = (e) => {
    const value = e.target.value;
    setYearInput(value);
    const year = Number.parseInt(value, 10);
    if (!isNaN(year) && year >= 1900 && year <= 2007) {
      setCurrentYear(year);
      setYearError('');
      setCalendarKey((prev) => prev + 1); // Update calendar on valid input
    } else if (value && (isNaN(year) || year < 1900 || year > 2007)) {
      setYearError('Year must be between 1900 and 2007');
    }
  };

  // Handle year update on Enter
  const handleYearEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      const year = Number.parseInt(yearInput, 10);
      if (!isNaN(year) && year >= 1900 && year <= 2007) {
        setCurrentYear(year);
        setYearError('');
        setCalendarKey((prev) => prev + 1); // Force calendar update
      } else {
        setYearError('Year must be between 1900 and 2007');
      }
    }
  };

  // Handle date of birth selection
  const handleDateChange = (date) => {
    if (date) {
      setCurrentYear(date.getFullYear());
      setCurrentMonth(date.getMonth());
      setYearInput(date.getFullYear().toString());
      setYearError('');
      setCalendarKey((prev) => prev + 1); // Ensure calendar updates
    }
    setUserData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Basic validation
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!userData.name || !userData.email || !userData.password) {
      setError('Please fill in all required fields');
      return;
    }

    // Just open the OTP modal without sending the verification code yet
    setError(null);
    setIsOtpModalOpen(true);
  };

  // Handle the actual sign up process
  const handleSignUpProcess = async () => {
    setIsSubmitting(true);
    try {
      return await handleSignUp(userData, setError);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (success) => {
    setIsOtpModalOpen(false);

    if (success) {
      await handleSignUp(userData, setError);
    }
  };

  // Handle closing the OTP modal
  const handleCloseOtpModal = () => {
    setIsOtpModalOpen(false);
  };

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col justify-center p-6 md:p-10"
      onSubmit={handleRegister}
    >
      <div>
        <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight text-neutral-800">
          Create an account. <br /> Join us today!
        </h2>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="flex flex-col justify-center gap-y-4">
          <TextInputField
            label="Full name"
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <TextInputField
            label="Email"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          {/* Date of Birth Field */}
          <div className="space-y-2">
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-neutral-700"
            >
              Date of Birth
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dateOfBirth"
                  variant="outline"
                  className={cn(
                    'w-full justify-start border border-neutral-300 bg-white text-left font-normal hover:bg-neutral-50',
                    !userData.dateOfBirth && 'text-neutral-500'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {userData.dateOfBirth ? (
                    format(userData.dateOfBirth, 'PPP')
                  ) : (
                    <span>Select your date of birth</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <PureCalendar
                  key={calendarKey} // Force re-render when year changes
                  mode="single"
                  selected={userData.dateOfBirth}
                  onSelect={handleDateChange}
                  disabled={(date) =>
                    date > new Date('2007-12-31') ||
                    date < new Date('1900-01-01')
                  }
                  defaultMonth={new Date(currentYear, currentMonth)}
                  showYearInput={true}
                  minYear={1900}
                  maxYear={2007}
                  onMonthChange={(date) => {
                    setCurrentYear(date.getFullYear());
                    setCurrentMonth(date.getMonth());
                    setYearInput(date.getFullYear().toString());
                    setYearError('');
                    setCalendarKey((prev) => prev + 1);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <TextInputField
            label="Password"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <TextInputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />

          <SubmitButton
            className="mt-5 bg-black p-2 text-white hover:bg-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Register'}
          </SubmitButton>
        </div>

        <AuthLink
          message={'Already have an account?'}
          linkText={'Login'}
          linkHref={'/sign-in'}
        />
      </div>

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={handleCloseOtpModal}
        onVerify={handleOtpVerification}
        email={userData.email}
        onSendCode={handleSignUpProcess}
        userData={userData}
      />
    </form>
  );
}

export default SignUpForm;
