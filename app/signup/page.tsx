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
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-16 bg-white overflow-y-auto scrollbar-hide">
          <div className="w-full max-w-md flex items-center justify-center">
            {/* Form Card */}
            <div className="w-full max-w-[412px] rounded-[24px] p-6 flex flex-col gap-8">
              {/* Logo and Heading */}
              <div className="flex flex-col gap-[10px]">
                {/* Company Logo */}
                <div className="mb-[22px]">
                  <Image src={SignupLogo} alt="Signup Logo" />
                </div>

                <h1 className="text-[32px] leading-[40px] font-normal text-[#09090B]">
                  Get Started Now
                </h1>

                <p className="text-[14px] leading-[20px] text-[#71717a] tracking-[0.15px]">
                  We sent a temporary login code to {email} <br />
                  Not you?
                </p>
              </div>

              {/* Form Fields */}
              <form
                onSubmit={handleVerificationSubmit}
                className="flex flex-col gap-5"
              >
                {/* Verification Code Input */}
                <div className="flex flex-col gap-1.5">
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
                    className={`w-full h-10 px-3 py-2 border ${
                      error ? "border-red-500" : "border-[#e4e4e7]"
                    } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-[#71717a] placeholder:text-[#71717a] transition-colors`}
                    disabled={isLoading}
                  />
                  {/* Error Message */}
                  {error && (
                    <p className="text-xs text-red-600">{error}</p>
                  )}
                </div>

                {/* Continue Button */}
                <Button
                  type="submit"
                  disabled={!verificationCode.trim() || isLoading}
                  className="w-full h-11 cursor-pointer bg-[#09090B] hover:bg-[#09090B]/90 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Continue"}
                </Button>
              </form>

              {/* Link to Login */}
              <div className="flex items-center justify-center h-11">
                <Link href="/login">
                  <span className="text-sm text-[#71717a] hover:text-[#09090B] transition-colors cursor-pointer">
                    Already have an account?{" "}
                    <span className="text-[#09090B] font-medium">Log in</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Background Graphics (Hidden on small/medium, visible on large) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-3">
          <div className="relative w-full h-full flex flex-col items-start justify-start rounded-2xl overflow-hidden">
            {/* Background gradient and image */}
            <div className="absolute inset-0">
              <Image
                src={Container}
                alt="Verification Graphic"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>

            {/* Header text overlay */}
            {/* <div className="relative z-10 pt-16 px-6 flex gap-1.5 items-center">
              <h2 className="text-[28px] leading-[40px] font-medium text-[#09090B]">
                Deal-Ready, Effort-Free
              </h2>
              <span className="text-2xl">✨</span>
              <h2 className="text-[28px] leading-[40px] font-medium text-[#09090B]">
                AI-Powered.
              </h2>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  // Email Step UI
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-16 bg-white overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-md flex items-center justify-center">
          {/* Form Card */}
          <div className="w-full max-w-[412px] rounded-[24px] p-6 flex flex-col gap-8">
            {/* Logo and Heading */}
            <div className="flex flex-col gap-[10px]">
              {/* Company Logo */}
              <div className="mb-[22px]">
                <Image src={SignupLogo} alt="Signup Logo" />
              </div>

              <h1 className="text-[32px] leading-[40px] font-normal text-[#09090B]">
                Get Started Now
              </h1>

              <p className="text-[14px] leading-[20px] text-[#71717a] tracking-[0.15px]">
                Secure your workspace, streamline due diligence, and join a
                trusted network of dealmakers.
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-5">
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full h-11 border border-[#e4e4e7] rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-4 h-4 relative">
                  <Image src={GoogleIcon} alt="Google Logo" />
                </div>
                <span className="text-sm font-medium text-[#09090B]">
                  Continue with Google
                </span>
              </button>

              {/* Divider */}
              <div className="flex gap-4 items-center">
                <div className="flex-1 h-0 border-t border-[#e4e4e7]" />
                <p className="text-xs text-[#71717a]">or</p>
                <div className="flex-1 h-0 border-t border-[#e4e4e7]" />
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
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
                  placeholder="Enter email address"
                  className={`w-full h-10 px-3 py-2 border ${
                    emailError ? "border-red-500" : "border-[#e4e4e7]"
                  } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-[#71717a] placeholder:text-[#71717a] transition-colors`}
                  required
                  disabled={isLoading}
                />
                {/* Error Message */}
                {(error || emailError) && (
                  <p className="text-xs text-red-600">
                    {error || emailError}
                  </p>
                )}
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleSubmit}
                disabled={!email.trim() || isLoading}
                className="w-full h-11 cursor-pointer bg-[#09090B] hover:bg-[#09090B]/90 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending code..." : "Continue"}
              </Button>
            </div>

            {/* Navigation Options */}
            <div className="flex items-center justify-center h-11">
              <Link href="/login">
                <span className="text-sm text-[#71717a] hover:text-[#09090B] transition-colors cursor-pointer">
                  Already have an account?{" "}
                  <span className="text-[#09090B] font-medium">Log in</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image (Hidden on small/medium, visible on large) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-3">
        <div className="relative w-full h-full flex flex-col items-start justify-start rounded-2xl overflow-hidden">
          {/* Background gradient and image */}
          <div className="absolute inset-0">
            <Image
              src={Container}
              alt="Signup Graphic"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
          </div>

          {/* Header text overlay */}
          {/* <div className="relative z-10 pt-16 px-6 flex gap-1.5 items-center">
            <h2 className="text-[28px] leading-[40px] font-medium text-[#09090B]">
              Deal-Ready, Effort-Free
            </h2>
            <span className="text-2xl">✨</span>
            <h2 className="text-[28px] leading-[40px] font-medium text-[#09090B]">
              AI-Powered.
            </h2>
          </div> */}
        </div>
      </div>
    </div>
  );
}
