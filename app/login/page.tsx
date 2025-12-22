"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignupLogo from "../../public/SignupLogo.svg";
import GoogleIcon from "../../public/GoogleIcon.svg";
import Container from "../../public/Container.png";
import Image from "next/image";
import { toast } from "sonner";
import { authApi } from "@/lib/api";

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

      // Call signin API to send OTP
      const response = await authApi.signin(email);

      if (response.success) {
        // Switch to verification step
        setStep("verification");
        toast.success("Verification code sent to your email");
      } else {
        throw new Error(response.error || "Failed to send verification code");
      }
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

      // Call verify OTP API
      const response = await authApi.verifyOtp({
        email,
        code: verificationCode,
        purpose: 'login_otp',
      });

      if (response.success) {
        toast.success("Verification successful");

        // Use redirectUrl from backend - it now includes slug-based routes
        if (response.data?.redirectUrl) {
          router.push(response.data.redirectUrl);
        } else {
          // Fallback: try to use tenantSlug from user object
          const tenantSlug = response.data?.user?.tenantSlug;
          if (tenantSlug) {
            router.push(`/${tenantSlug}/dashboard/library`);
          } else {
            // Last resort fallback to old route
            router.push("/Dashboard/Library");
          }
        }
      } else {
        throw new Error(response.error || "Invalid verification code");
      }
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
                  Welcome Back
                </h1>

                <p className="text-[14px] leading-[20px] text-[#71717a] tracking-[0.15px]">
                  We sent a temporary login code to {email}
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

              {/* Link to Signup */}
              <div className="flex items-center justify-center h-11">
                <Link href="/signup">
                  <span className="text-sm text-[#71717a] hover:text-[#09090B] transition-colors cursor-pointer">
                    Don&apos;t have an account?{" "}
                    <span className="text-[#09090B] font-medium">
                      Create Account
                    </span>
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
                style={{ objectFit: "cover", objectPosition: "center" }}
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Email Form */}
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
                Welcome Back
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
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleEmailSubmit(e as React.FormEvent);
                    }
                  }}
                  placeholder="Enter email address"
                  className={`w-full h-10 px-3 py-2 border ${
                    error ? "border-red-500" : "border-[#e4e4e7]"
                  } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-[#71717a] placeholder:text-[#71717a] transition-colors`}
                  required
                  disabled={isLoading}
                />
                {/* Error Message */}
                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleEmailSubmit}
                disabled={!email.trim() || isLoading}
                className="w-full h-11 cursor-pointer bg-[#09090B] hover:bg-[#09090B]/90 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending code..." : "Continue"}
              </Button>
            </div>

            {/* Link to Signup */}
            <div className="flex items-center justify-center h-11">
              <Link href="/signup">
                <span className="text-sm text-[#71717a] hover:text-[#09090B] transition-colors cursor-pointer">
                  Don&apos;t have an account?{" "}
                  <span className="text-[#09090B] font-medium">
                    Create Account
                  </span>
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
              alt="Login Graphic"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
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
