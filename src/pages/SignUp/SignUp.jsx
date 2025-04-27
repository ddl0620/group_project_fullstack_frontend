import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { useAuth } from '@/hooks/useAuth.js';
import SignUpForm from '@/pages/SignUp/SignUpForm.jsx';

function Register() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'attendee',
  });
  const [error, setError] = useState(null);
  const { handleSignUp } = useAuth();

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
        {/*Form Section*/}
        <SignUpForm />

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
