'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.js';
import AuthLink from '../../components/shared/AuthLink.jsx';
import SubmitButton from '../../components/shared/SubmitButton.jsx';
import TextInputField from '../../components/shared/TextInputField.jsx';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// Date picker components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

function SignUpForm() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    dateOfBirth: undefined, // Add date of birth field
  });
  const [error, setError] = useState(null);
  const { handleSignUp } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date of birth selection
  const handleDateChange = (date) => {
    setUserData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    await handleSignUp(userData, setError);
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
          />

          <TextInputField
            label="Email"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter your email"
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
                <Calendar
                  mode="single"
                  selected={userData.dateOfBirth}
                  onSelect={handleDateChange}
                  initialFocus
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
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
          />

          <TextInputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />

          <SubmitButton
            type="submit"
            className="mt-5 bg-black p-2 text-white hover:bg-gray-800"
          >
            Register
          </SubmitButton>
        </div>

        <AuthLink
          message={'Already have an account?'}
          linkText={'Login'}
          linkHref={'/sign-in'}
        />
      </div>
    </form>
  );
}

export default SignUpForm;
