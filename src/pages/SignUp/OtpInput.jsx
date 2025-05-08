"use client"

import { useState, useRef, useEffect } from "react"

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(""))
  const inputRefs = useRef([])

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (e, index) => {
    const value = e.target.value

    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Update the OTP array
    const newOtp = [...otp]
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Check if we've filled this input
    if (value && index < length - 1) {
      // Move to the next input
      inputRefs.current[index + 1].focus()
    }

    // Check if OTP is complete
    const otpValue = newOtp.join("")
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue)
    }
  }

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        inputRefs.current[index - 1].focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted data is all digits
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]

    // Fill the OTP array with pasted digits
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newOtp[i] = pastedData[i]
    }

    setOtp(newOtp)

    // Focus the appropriate input
    if (pastedData.length < length) {
      inputRefs.current[pastedData.length].focus()
    } else {
      inputRefs.current[length - 1].focus()
    }

    // Check if OTP is complete
    const otpValue = newOtp.join("")
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue)
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : null}
          className="h-12 w-12 rounded-md border border-neutral-300 bg-white text-center text-xl font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      ))}
    </div>
  )
}

export default OtpInput
