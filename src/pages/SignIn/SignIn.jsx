"use client"

import { motion } from "framer-motion"
import { SignInForm } from "@/pages/SignIn/SignInForm.jsx"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth.js"

function Login() {
  // Animation variants for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleLogin()
    }
  }

  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [error, setError] = useState(null)
  const { handleSignIn } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async () => {
    await handleSignIn(credentials, setError)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="flex min-h-screen items-center justify-center bg-neutral-100 px-6 py-12"
      onKeyDown={handleKeyDown}
    >
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
        {/* Sign In Form */}
        <SignInForm />

        {/* Image Section */}
        <div className="relative hidden md:block">
          <img
            src="/bgImageSignIn.png"
            alt="Login Illustration"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h3 className="mb-2 text-2xl font-bold">Welcome Back!</h3>
            <p className="text-sm">Sign in to continue your journey with us.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
