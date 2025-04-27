import { motion } from 'framer-motion'; // Import Framer Motion
import { SignInForm } from '@/pages/SignIn/SignInForm.jsx';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.js';

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="flex min-h-screen items-center justify-center bg-neutral-100 px-6"
      onKeyDown={handleKeyDown}
    >
      <div className="grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
        {/*<SignInForm/>*/}
        <SignInForm />

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
