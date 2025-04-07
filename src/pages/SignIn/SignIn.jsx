import { useState } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { useAuth } from '@/hooks/useAuth.js';
import AuthLink from '../../components/sub_components/AuthLink.jsx';
import SubmitButton from '../../components/sub_components/SubmitButton.jsx';
import TextInputField from '../../components/sub_components/TextInputField.jsx';

function Login() {
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

    // Animation variants for fade-in effect
    const fadeIn = {
        hidden: { opacity: 0, y: 50 }, // Start with opacity 0 and move down
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Fade in and move to original position
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission behavior
            handleLogin(); // Call handleLogin when Enter is pressed
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex min-h-screen items-center justify-center bg-neutral-100 px-6"
            onKeyDown={handleKeyDown}
        >
            <div className="grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
                {/* Form Section */}
                <form className="mx-auto flex w-full max-w-sm flex-col justify-center p-6 md:p-10">
                    <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-neutral-800">
                        Welcome back
                        <h5 className="pt-3 pb-8 text-center text-lg font-light tracking-tight text-neutral-600">
                            Login to your EventApp account
                        </h5>
                    </h2>

                    {error && (
                        <p className="mb-4 text-sm text-red-500">{error}</p>
                    )}

                    <div className="mb-4">
                        <TextInputField
                            label="Email"
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Your email address"
                        />
                    </div>

                    <TextInputField
                        label="Password"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />

                    <SubmitButton
                        onClick={handleLogin}
                        className="mt-4.5 w-full rounded-lg bg-black py-2 font-medium text-white shadow-md transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
                    >
                        Login
                    </SubmitButton>

                    <AuthLink
                        message={"Don't have an account?"}
                        linkText={'Create one'}
                        linkHref={'/sign-up'}
                    />
                </form>

                {/* Image Section */}
                <div className="relative hidden md:block">
                    <img
                        src="../../../public/images/apple-product.jpg" // Replace with your image path
                        alt="Login Illustration"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default Login;
