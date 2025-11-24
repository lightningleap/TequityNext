"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GoogleIcon from "../../public/GoogleIcon.svg";
import SignupLogo from "../../public/SignupLogo.svg";
import Container from "../../public/Container.png";
import { toast } from "sonner";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"email" | "verification">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);

    // Basic validation
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to send verification code
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   body: JSON.stringify({ email }),
      // });
      // if (!response.ok) throw new Error('Failed to send verification code');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
    setError(null);
    setIsLoading(true);

    try {
      // Validate verification code format
      if (verificationCode.length < 4) {
        throw new Error("Please enter a valid verification code");
      }

      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/verify-signup', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, code: verificationCode }),
      // });
      // if (!response.ok) throw new Error('Invalid verification code');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Signup verified");
      router.push("/workspace-setup");
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

  const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
  };

  // Verification Step UI
  if (step === "verification") {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Left Side - Verification Form */}
        <div className="w-full lg:flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-16 bg-white overflow-y-auto scrollbar-hide">
          <div className="w-full max-w-sm sm:max-w-md flex items-center justify-center">
            {/* Form Card */}
            <div className="w-full max-w-[412px] bg-[rgba(0,0,0,0.001)] rounded-[24px] p-6 flex flex-col gap-8">
              {/* Logo and Heading */}
              <div className="flex flex-col gap-2.5">
                {/* Company Logo */}
                <div>
                  <Image src={SignupLogo} alt="Signup Logo" />
                </div>

                <h1 className="text-3xl font-normal text-[#09090B]">
                  Get Started Now
                </h1>

                <p className="text-sm text-gray-500">
                  We sent a temporary login code to {email} <br />
                  Not you?
                </p>
              </div>

              {/* Form Fields */}
              <form
                onSubmit={handleVerificationSubmit}
                className="flex flex-col gap-5 w-[364px]"
              >
                {/* Error Message */}
                {error && (
                  <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Verification Code Input */}
                <div className="space-y-1.5 w-[364px]">
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
                    className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${error
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                      }`}
                    disabled={isLoading}
                  />
                </div>

                {/* Continue Button */}
                <div className="mt-3">
                  <Button
                    type="submit"
                    disabled={!verificationCode.trim() || isLoading}
                    className="w-full h-11 cursor-pointer bg-[#09090B] hover:bg-gray-800 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Verifying..." : "Continue"}
                  </Button>
                </div>

                {/* Link to Login */}
                <div className="text-center">
                  <Link href="/login">
                    <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                      Already have an account?{" "}
                      <span className="text-gray-900 font-medium">Log in</span>
                    </span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - Background Graphics - 40% width */}
        <div className="hidden lg:flex w-2/5 relative p-1.5">
          <div className="relative w-full h-full">
            <Image
              src={Container}
              alt="Login Graphic"
              fill
              className=""
              priority
              sizes="50vw"
              style={{
                objectPosition: 'center center',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Email Step UI
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Form - Takes remaining width */}
      <div className="w-full lg:flex-1 flex items-center justify-center p-6 sm:p-16 bg-white overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-md flex items-center justify-center">
          {/* Form Card */}
          <div className="w-full max-w-[412px] bg-[rgba(0,0,0,0.001)] rounded-[24px] flex flex-col gap-8">
            {/* Logo and Heading */}
            <div className="flex flex-col gap-2.5">
              {/* Company Logo */}
              <div>
                <Image src={SignupLogo} alt="Signup Logo" />
              </div>

              <h1 className="text-3xl font-normal text-[#09090B]">
                Get Started Now
              </h1>

              <p className="text-sm text-gray-500 leading-relaxed">
                Secure your workspace, streamline due diligence, and join a
                trusted network of dealmakers.
              </p>
            </div>

            {/* Google Sign In Button */}
            <div className="mt-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full h-11 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
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
              {/* Email Input */}
              <div className="space-y-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(e as React.FormEvent);
                    }
                  }}
                  placeholder="Enter your email address"
                  className={`w-full h-10 px-3 py-2 border ${emailError ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors`}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Error Message */}
              {(error || emailError) && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error || emailError}
                </div>
              )}

              {/* Continue Button */}
              <div className="mt-3">
                <Button
                  onClick={handleSubmit}
                  disabled={!email.trim() || isLoading}
                  className="w-full h-11 cursor-pointer bg-[#09090B] hover:bg-gray-800 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending code..." : "Continue"}
                </Button>
              </div>

              {/* Navigation Options */}
              <div className="text-center">
                <Link href="/login">
                  <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                    Already have an account?{" "}
                    <span className="text-gray-900 font-medium">Log in</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image - 40% width */}
      <div className="hidden lg:flex w-2/5 relative p-1.5">
        <div className="relative w-full h-full">
          <Image
            src={Container}
            alt="Signup Graphic"
            fill
            className="object-contain"
            priority
            sizes="40vw"
          />
        </div>
      </div>
    </div>
  );
}
