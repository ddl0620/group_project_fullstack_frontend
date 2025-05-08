"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import OtpInput from "./OtpInput"

const OtpVerificationModal = ({ isOpen, onClose, onVerify, email }) => {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null) // null, 'success', 'error'
  const [countdown, setCountdown] = useState(30)

  // Mock verification - in a real app, this would call an API
  const verifyOtp = async () => {
    setIsVerifying(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes: OTP "123456" is considered valid
      if (otp === "123456") {
        setVerificationStatus("success")
        // Wait a moment to show success state before closing
        setTimeout(() => {
          onVerify(true)
        }, 1500)
      } else {
        setVerificationStatus("error")
        // Reset after showing error
        setTimeout(() => {
          setVerificationStatus(null)
          setOtp("")
        }, 2000)
      }
    } finally {
      setIsVerifying(false)
    }
  }

  // Countdown timer for resend code
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp("")
      setVerificationStatus(null)
      setCountdown(30)
    }
  }, [isOpen])

  const handleComplete = (value) => {
    setOtp(value)
  }

  const handleResendCode = () => {
    // In a real app, this would call an API to resend the code
    setCountdown(30)
    // Mock notification that code was sent
    alert("A new verification code has been sent to your email.")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Verify Your Account</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {verificationStatus === "success" ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center text-lg font-medium">Verification successful!</p>
              <p className="text-center text-sm text-neutral-500">Your account has been created.</p>
            </div>
          ) : verificationStatus === "error" ? (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-center text-lg font-medium">Verification failed</p>
              <p className="text-center text-sm text-neutral-500">The code you entered is incorrect.</p>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-neutral-600">
                We've sent a 6-digit verification code to
                <br />
                <span className="font-medium">{email}</span>
              </p>

              <OtpInput length={6} onComplete={handleComplete} />

              <div className="w-full space-y-4">
                <Button
                  onClick={verifyOtp}
                  disabled={otp.length !== 6 || isVerifying}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-center text-sm">
                  {countdown > 0 ? (
                    <p className="text-neutral-500">
                      Resend code in <span className="font-medium">{countdown}s</span>
                    </p>
                  ) : (
                    <button onClick={handleResendCode} className="text-blue-600 hover:text-blue-800 hover:underline">
                      Resend verification code
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OtpVerificationModal
