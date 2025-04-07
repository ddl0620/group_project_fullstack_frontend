import TextInputField from '@/components/sub_components/TextInputField.jsx';
import SubmitButton from '@/components/sub_components/SubmitButton.jsx';
import AuthLink from '@/components/sub_components/AuthLink.jsx';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.js';

export const SignInForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const { handleSignIn } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        await handleSignIn(credentials, setError);
    };

    return (
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-neutral-800">
                Welcome back
                <p className="text-center text-lg font-light tracking-tight text-neutral-600">
                    Login to your EventApp account
                </p>
            </h2>

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <TextInputField
                label="Email"
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Your email"
            />

            <TextInputField
                label="Password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
            />

            <SubmitButton
                onClick={handleLogin}
                className="mt-7 bg-neutral-900 text-white hover:bg-neutral-800"
            >
                Continue
            </SubmitButton>

            <AuthLink
                message={"Don't have an account?"}
                linkText={'Create one'}
                linkHref={'/sign-up'}
            />
        </div>
    );
};
