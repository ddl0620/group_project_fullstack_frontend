import { motion } from 'framer-motion'; // Import Framer Motion
import {SignInForm} from "@/pages/SignIn/SignInForm.jsx";

function Login() {
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
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Form Section */}
                <SignInForm/>

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