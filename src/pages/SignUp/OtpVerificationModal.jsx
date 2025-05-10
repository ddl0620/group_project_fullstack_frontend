'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, XCircle } from 'lucide-react';
import OtpInput from './OtpInput';
import { useAuth } from '@/hooks/useAuth.js';
import { Toast } from '@/helpers/toastService.js';

const OtpVerificationModal = ({
  isOpen,
  onClose,
  onVerify,
  email,
  onSendCode,
  userData,
}) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'success', 'error'
  const [countdown, setCountdown] = useState(0); // Start at 0 since we haven't sent the code yet
  const [codeSent, setCodeSent] = useState(false);
  const { handleVerifyCodeSignUp } = useAuth();
  const [error, setError] = useState(null);
  const [isInvalidSignup, setIsInvalidSignup] = useState(false);

  // Mock verification - in a real app, this would call an API
  const verifyOtp = async () => {
    setIsVerifying(true);

    try {
      await handleVerifyCodeSignUp({ code: otp, email }, error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Countdown timer for resend code
  useEffect(() => {
    if (!isOpen || !codeSent) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, codeSent]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp('');
      setVerificationStatus(null);
      setCodeSent(false);
      setCountdown(0);
    }
  }, [isOpen]);

  const handleComplete = (value) => {
    setOtp(value);
  };

  const handleSendCode = async () => {
    setIsSending(true);
    try {
      const response = await onSendCode();
      console.log(response);
      if (!response){
        setIsInvalidSignup(true);
        return;
      }
      if (!response.success){
        setIsInvalidSignup(true);
        return;
      }
      setCodeSent(true);
      setCountdown(30);
      Toast.success(
        'Verification code sent! Please check your email for the verification code.'
      );
    } catch (err) {
      Toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleResendCode = async () => {
    setIsSending(true);
    try {
      const response = await onSendCode();
      if (!response){
        setIsInvalidSignup(true);
        return;
      }
      if (!response.success){
        setIsInvalidSignup(true);
        return;
      }
      setCountdown(30);
      Toast.success(
        'Verification code resent! Please check your email for the verification code.'
      );
    } catch (err) {
      Toast.error('Failed to resend verification code. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle manual close
  const handleCloseModal = () => {
    setIsInvalidSignup(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCloseModal();
      }}
    >
      <DialogContent
        className="max-w-[95vw] p-4 sm:max-w-md"
        onInteractOutside={(e) => {
          // Prevent closing when clicking outside
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with Escape key
          e.preventDefault();
        }}
        hideCloseButton={true}
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-xl font-semibold">
            Verify Your Account
          </DialogTitle>
          <button
            onClick={handleCloseModal}
            className="ring-offset-background focus:ring-ring absolute top-0 right-0 rounded-sm p-2 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="Close"
          >
            {/*<X className="h-4 w-4" />*/}
          </button>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-3 sm:space-y-6 sm:py-4">
          {verificationStatus === 'success' ? (
            <div className="flex flex-col items-center space-y-2 sm:space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 sm:h-16 sm:w-16" />
              <p className="text-center text-base font-medium sm:text-lg">
                Verification successful!
              </p>
              <p className="text-center text-xs text-neutral-500 sm:text-sm">
                Your account has been created.
              </p>
            </div>
          ) : verificationStatus === 'error' ? (
            <div className="flex flex-col items-center space-y-2 sm:space-y-4">
              <XCircle className="h-12 w-12 text-red-500 sm:h-16 sm:w-16" />
              <p className="text-center text-base font-medium sm:text-lg">
                Verification failed
              </p>
              <p className="text-center text-xs text-neutral-500 sm:text-sm">
                The code you entered is incorrect.
              </p>
            </div>
          ) : (
            <>
              <p className="text-center text-xs text-neutral-600 sm:text-sm">
                {codeSent ? (
                  <>
                    We've sent a 6-digit verification code to
                    <br />
                    <span className="font-medium break-all">{email}</span>
                  </>
                ) : (
                  <>
                    Click the button below to send a 6-digit verification code
                    to
                    <br />
                    <span className="font-medium break-all">{email}</span>
                  </>
                )}
              </p>

              {codeSent ? (
                <>
                  <OtpInput length={6} onComplete={handleComplete} />

                  <div className="w-full space-y-4">
                    <Button
                      onClick={verifyOtp}
                      disabled={otp.length !== 6 || isVerifying}
                      className="w-full bg-black text-white hover:bg-gray-800"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Code'}
                    </Button>

                    <div className="text-center text-sm">
                      {countdown > 0 ? (
                        <p className="text-neutral-500">
                          Resend code in{' '}
                          <span className="font-medium">{countdown}s</span>
                        </p>
                      ) : (
                        <button
                          onClick={handleResendCode}
                          disabled={isSending}
                          className="text-blue-600 hover:text-blue-800 hover:underline disabled:text-gray-400 disabled:no-underline"
                        >
                          {isSending
                            ? 'Sending...'
                            : 'Resend verification code'}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <Button
                  onClick={handleSendCode}
                  disabled={isSending || isInvalidSignup}
                  className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                >
                  {isSending && !isInvalidSignup ? 'Sending...' : 'Send Verification Code'}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpVerificationModal;
