import TextInputField from '@/components/shared/TextInputField.jsx';
import SubmitButton from '@/components/shared/SubmitButton.jsx';
import AuthLink from '@/components/shared/AuthLink.jsx';
import { useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth.js';

export const SignInForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { handleSignIn } = useAuth();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async () => {
    await handleSignIn(credentials, setError);
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center p-8 md:p-12">
      <div className="mb-10">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-neutral-800">
          Welcome back
        </h2>
        <p className="text-center text-lg font-light tracking-tight text-neutral-600">
          Login to your <strong>Eventify</strong> account
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <TextInputField
            ref={emailRef}
            label="Email"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Your email"
          />
        </div>

        <div className="space-y-2">
          <TextInputField
            ref={passwordRef}
            label="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <div className="pt-4">
          <SubmitButton
            onClick={handleClick}
            className="w-full rounded-md bg-blue-600 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            Sign In
          </SubmitButton>
        </div>
      </div>

      <div className="mt-12 text-center">
        <AuthLink
          message={"Don't have an account?"}
          linkText={'Create one'}
          linkHref={'/sign-up'}
          className="text-sm"
        />
      </div>
    </div>
  );
};
