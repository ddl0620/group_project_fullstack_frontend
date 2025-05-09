"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import OtpInput from "./OtpInput"
import { useAuth } from "@/hooks/useAuth.js"
import { Toast } from "@/helpers/toastService.js"

const OtpVerificationModal = ({ isOpen, onClose, onVerify, email, onResendCode, userData }) => {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null) // null, 'success', 'error'
  const [countdown, setCountdown] = useState(30)
  const { handleVerifyCodeSignUp, handleSignUp } = useAuth()
  const [error, setError] = useState(null)

  // Mock verification - in a real app, this would call an API
  const verifyOtp = async () => {
    setIsVerifying(true)

    try {
      await handleVerifyCodeSignUp({ code: otp, email }, error)
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

  const handleResendCode = async () => {
    await handleSignUp(userData, setError)
    setCountdown(30)
    setVerificationStatus(null)
    Toast.success("Verification code sent! Please check your email for the verification code.")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only allow closing through the explicit close button
        // This prevents closing on unfocus/clicking outside
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md p-4 max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Verify Your Account</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 sm:space-y-6 py-3 sm:py-4">
          {verificationStatus === "success" ? (
            <div className="flex flex-col items-center space-y-2 sm:space-y-4">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
              <p className="text-center text-base sm:text-lg font-medium">Verification successful!</p>
              <p className="text-center text-xs sm:text-sm text-neutral-500">Your account has been created.</p>
            </div>
          ) : verificationStatus === "error" ? (
            <div className="flex flex-col items-center space-y-2 sm:space-y-4">
              <XCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500" />
              <p className="text-center text-base sm:text-lg font-medium">Verification failed</p>
              <p className="text-center text-xs sm:text-sm text-neutral-500">The code you entered is incorrect.</p>
            </div>
          ) : (
            <>
              <p className="text-center text-xs sm:text-sm text-neutral-600">
                We've sent a 6-digit verification code to
                <br />
                <span className="font-medium break-all">{email}</span>
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
