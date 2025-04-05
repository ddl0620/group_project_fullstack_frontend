import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { useAuth } from "../../hooks/useAuth.js";
import AuthLink from "../../components/sub_components/AuthLink.jsx";
import SubmitButton from "../../components/sub_components/SubmitButton.jsx";
import TextInputField from "../../components/sub_components/TextInputField.jsx";

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
            className="flex min-h-screen items-center justify-center bg-neutral-100"
        >
            <form
                className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg border border-neutral-200"
            >
                <h2 className="mb-6 text-3xl font-semibold text-neutral-800 tracking-tight text-center">
                    Register
                </h2>

                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                <div className="mb-3.5">
                    <TextInputField
                        label="Name"
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

                <div className="mb-5">
                    <label className="block text-sm text-neutral-600 mb-1 font-bold">Role</label>
                    <select
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        <option value="organizer">Organizer</option>
                        <option value="attendee">Attendee</option>
                    </select>
                </div>

                <SubmitButton
                    type="button"
                    onClick={handleRegister}
                    className="bg-blue-500 text-white hover:bg-blue-600 mt-2.5"
                >
                    Register
                </SubmitButton>

                <AuthLink
                    message={"Already have an account?"}
                    linkText={"Login"}
                    linkHref={"/sign-in"}
                />
            </form>
        </motion.div>
    );
}

export default Register;