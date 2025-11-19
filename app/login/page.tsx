"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignupLogo from "../../public/SignupLogo.svg";
import GoogleIcon from "../../public/GoogleIcon.svg";
import Container from "../../public/Container.svg";
import Image from "next/image";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"email" | "verification">("email");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/send-code', {
      //   method: 'POST',
      //   body: JSON.stringify({ email }),
      // });
      // if (!response.ok) throw new Error('Failed to send verification code');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Switch to verification step
      setStep("verification");
      toast.success("Verification code sent");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send verification code. Please try again."
      );
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to send verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate verification code format (assuming 6 digits)
      if (verificationCode.length < 4) {
        throw new Error("Please enter a valid verification code");
      }

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/verify-code', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, code: verificationCode }),
      // });
      // if (!response.ok) throw new Error('Invalid verification code');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Verification successful");
      router.push("/Dashboard/Library");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again."
      );
      toast.error(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
    window.location.href = "/signup";
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
  };

  if (step === "verification") {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Left Side - Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-16 bg-white overflow-y-auto scrollbar-hide">
          <div className="w-full max-w-sm sm:max-w-md flex items-center justify-center">
            {/* Form Card */}
            <div className="w-full max-w-[412px] min-h-[430px] bg-[rgba(0,0,0,0.001)] rounded-[24px] p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
              {/* Logo and Heading */}
              <div className="flex flex-col gap-2.5">
                {/* Company Logo */}
                <div>
                  <Image src={SignupLogo} alt="Signup Logo" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-normal text-[#09090B] w-full">
                  Welcome Back
                </h1>

                <p className="text-sm text-gray-500 w-full">
                  We sent a temporary login code to {email}. Not you?
                </p>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-5 w-full">
                {/* Error Message */}
                {error && (
                  <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Verification Code Input with Error Handling */}
                <div className="space-y-1.5 w-full">
                  <div className="relative">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleVerificationSubmit(e as React.FormEvent);
                        }
                      }}
                      placeholder="Enter verification code"
                      className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                        error
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {/* Error Message - Positioned absolutely to prevent layout shift */}
                    <div
                      className={`absolute left-0 right-0 transition-all duration-200 ${
                        error
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      {error && (
                        <p className="text-sm text-red-600 py-2">{error}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="mt-3">
                  <Button
                    onClick={handleVerificationSubmit}
                    disabled={!verificationCode.trim() || isLoading}
                    className="w-full h-11 cursor-pointer bg-[#09090B] hover:bg-gray-800 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Verifying..." : "Continue"}
                  </Button>
                </div>

                {/* Back to Signup */}
                <button
                  onClick={handleBackToSignup}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors text-left"
                >
                  Not you? Use a different email
                </button>

                {/* Link to Signup */}
                <div className="text-center">
                  <Link href="/signup">
                    <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                      Don&apos;t have an account?{" "}
                      <span className="text-gray-900 font-medium">
                        Create Account
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Background Graphics (Hidden on small/medium, visible on large) */}
        <div className="hidden lg:block lg:w-1/2 bg-gray-50 relative overflow-hidden">
          <Image
            src={Container}
            alt="Verification Graphic"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Email Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-16 bg-white overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-sm sm:max-w-md flex items-center justify-center">
          {/* Form Card */}
          <div className="w-full max-w-[412px] min-h-[484px] bg-[rgba(0,0,0,0.001)] rounded-[24px] p-4 sm:p-6 flex flex-col gap-6 sm:gap-8">
            {/* Logo and Heading */}
            <div className="flex flex-col gap-2.5">
              {/* Company Logo */}
              <div>
                <Image src={SignupLogo} alt="Signup Logo" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-normal text-[#09090B] w-full">
                Welcome Back
              </h1>
            </div>

            {/* Google Sign In Button - Wrapped in a fixed height container */}
            <div className="h-12">
              <button
                onClick={handleGoogleSignIn}
                className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
              >
                <div className="w-5 h-5 relative rounded-sm overflow-hidden">
                  <Image src={GoogleIcon} alt="Google Logo" />
                </div>
                <span className="text-base font-medium text-gray-700">
                  Continue with Google
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative bg-white px-4">
                <span className="text-base text-gray-500 font-medium">or</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="w-full space-y-5">
              {/* Email Input with Error Message */}
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleEmailSubmit(e as React.FormEvent);
                      }
                    }}
                    placeholder="Enter your email address"
                    className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      error
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {/* Error Message - Positioned absolutely to prevent layout shift */}
                  <div
                    className={`absolute left-0 right-0 transition-all duration-200 ${
                      error
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {error && (
                      <p className="text-sm text-red-600 py-2">{error}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleEmailSubmit}
                disabled={!email.trim() || isLoading}
                className="w-full h-11 cursor-pointer bg-[#09090B] hover:bg-gray-800 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-3"
              >
                {isLoading ? "Sending code..." : "Continue"}
              </Button>

              {/* Link to Signup */}
              <div className="text-center">
                <Link href="/signup">
                  <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                    Don&apos;t have an account?{" "}
                    <span className="text-gray-900 font-medium">
                      Create Account
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image (Hidden on small/medium, visible on large) */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-50 relative overflow-hidden">
        <Image
          src={Container}
          alt="Login Graphic"
          fill
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
