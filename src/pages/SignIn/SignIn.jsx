import { useState } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { useAuth } from "../../hooks/useAuth.js";
import AuthLink from "../../components/sub_components/AuthLink.jsx";
import SubmitButton from "../../components/sub_components/SubmitButton.jsx";
import TextInputField from "../../components/sub_components/TextInputField.jsx";

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
            className="flex min-h-screen items-center justify-center bg-neutral-100"
            onKeyDown={handleKeyDown} // Add onKeyDown to the outermost container
        >
            <form
                className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg border border-neutral-200"
            >
                <h2 className="mb-6 text-3xl font-bold text-neutral-800 tracking-tight text-center">
                    Welcome back
                    <br />
                    <h5 className="mb-6 text-lg font-light text-neutral-800 tracking-tight text-center">
                        Login to your EventApp account
                    </h5>
                </h2>

                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                <div className="mb-4">
                    <TextInputField
                        label="Email"
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
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
                    className="bg-neutral-900 text-white hover:bg-neutral-800 mt-4.5"
                >
                    Login
                </SubmitButton>

                <AuthLink
                    message={"Don't have an account?"}
                    linkText={"Create one"}
                    linkHref={"/sign-up"}
                />
            </form>
        </motion.div>
    );
}

export default Login;