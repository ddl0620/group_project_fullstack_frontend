import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { useAuth } from '../../hooks/useAuth.js';
import AuthLink from '../../components/sub_components/AuthLink.jsx';
import SubmitButton from '../../components/sub_components/SubmitButton.jsx';
import TextInputField from '../../components/sub_components/TextInputField.jsx';

function Register() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'attendee',
    });
    const [error, setError] = useState(null);
    const { handleSignUp } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async () => {
        await handleSignUp(userData, setError);
    };

    // Animation variants for fade-in effect
    const fadeIn = {
        hidden: { opacity: 0, y: 50 }, // Start with opacity 0 and move down
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Fade in and move to original position
    };

    // Add a global keydown listener for the Enter key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent default form submission behavior
                handleRegister(); // Call handleRegister when Enter is pressed
            }
        };

        // Attach the event listener to the document
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [userData]); // Dependency array ensures the latest userData is used

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex min-h-screen items-center justify-center bg-neutral-100 px-6 py-0" // Giảm py và giữ min-h-screen
        >
            <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
                {/* Form Section */}
                <form className="mx-auto flex w-full max-w-sm flex-col justify-center p-7 md:p-10">
                    <h2 className="mb-6 text-left text-3xl font-semibold tracking-tight text-neutral-800">
                        Create an account. <br/>Join us!
                    </h2>

                    {error && (
                        <p className="mb-4 text-sm text-red-500">{error}</p>
                    )}

                    <div className="mb-3.5">
                        <TextInputField
                            label="Full name"
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-3.5">
                        <TextInputField
                            label="Email"
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-3.5">
                        <TextInputField
                            label="Password"
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="mb-3.5">
                        <TextInputField
                            label="Confirm Password"
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                        />
                    </div>

                    {/*<div className="mb-5">*/}
                    {/*    <label className="mb-1 block text-sm font-bold text-neutral-600">*/}
                    {/*        Role*/}
                    {/*    </label>*/}
                    {/*    <select*/}
                    {/*        name="role"*/}
                    {/*        value={userData.role}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"*/}
                    {/*    >*/}
                    {/*        <option value="user">User</option>*/}
                    {/*        <option value="admin">Admin</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}

                    <SubmitButton
                        type="button"
                        onClick={handleRegister}
                        className="mt-4.5 w-full rounded-lg bg-black py-2 font-medium text-white shadow-md transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
                    >
                        Register
                    </SubmitButton>

                    <AuthLink
                        message={'Already have an account?'}
                        linkText={'Login'}
                        linkHref={'/sign-in'}
                    />
                </form>

                {/* Image Section */}
                <div className="relative hidden md:block">
                    <img
                        src="../../../public/images/apple-product.jpg" // Replace with your image path
                        alt="Sign Up Illustration"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default Register;
