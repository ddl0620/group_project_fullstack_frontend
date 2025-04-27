import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.js';
import AuthLink from '../../components/shared/AuthLink.jsx';
import SubmitButton from '../../components/shared/SubmitButton.jsx';
import TextInputField from '../../components/shared/TextInputField.jsx';

function SignUpForm() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState(null);
  const { handleSignUp } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    await handleSignUp(userData, setError);
  };

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col justify-center p-6 md:p-10"
      onSubmit={handleRegister} // Wrap in a form and use onSubmit
    >
      <div>
        <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight text-neutral-800">
          Create an account. <br /> Join us today!
        </h2>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="flex flex-col justify-center gap-y-2">
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
            type="confirmPassword"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />

          <SubmitButton
            type="submit" // Change to type="submit" instead of onClick
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
