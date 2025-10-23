"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignupLogo from "../../public/SignupLogo.svg";
import SignupGraphic from "../../public/SignupGraphic.svg";
import GoogleIcon from "../../public/GoogleIcon.svg";
import Container from "../../public/Container.svg";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Switch to verification step
    setStep('verification');
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate directly to dashboard after verification
    router.push("/Dashboard");
  };

  const handleBackToSignup = () => {
    window.location.href = "/signup";
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
  };

  if (step === 'verification') {
    return (
      <div className="flex h-screen">
        {/* Left Side - Background Graphics */}
        <div className="w-1/2 flex items-center justify-center bg-gray-50">
          <Image src={Container} alt="Signup Graphic" className="w-full h-full object-contain" />
        </div>

        {/* Right Side - Verification Form */}
        <div className="w-1/2 flex items-center justify-center p-16 bg-white">
          <div className="w-[640px] h-[800px] flex items-center justify-center">
            {/* Form Card */}
            <div className="w-[412px] h-[430px] bg-[rgba(0,0,0,0.001)] rounded-[24px] p-6 flex flex-col gap-8">
              {/* Logo and Heading */}
              <div className="flex flex-col gap-2.5">
                {/* Company Logo */}
                <div>
                  <Image src={SignupLogo} alt="Signup Logo" />
                </div>

                <h1 className="text-3xl font-normal text-[#09090B] w-[364px] h-10">
                  Welcome Back
                </h1>

                <p className="text-sm text-gray-500 w-[364px] h-10">
                  We sent a temporary login code to {email}. Not you?
                </p>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-5 w-[364px] h-[104px]">
                {/* Verification Code Input */}
                <div className="flex flex-col gap-1.5 w-[364px] h-10">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleVerificationSubmit}
                  disabled={!verificationCode.trim()}
                  className="w-full h-11 bg-[#09090B] hover:bg-gray-800 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>

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
                      Don&apos;t have an account? Create One
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={SignupGraphic}
            alt="Login Graphic"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Right Side - Email Form */}
      <div className="w-1/2 flex items-center justify-center p-16 bg-white">
        <div className="w-[640px] h-[800px] flex items-center justify-center">
          {/* Form Card */}
          <div className="w-[412px] h-[484px] bg-[rgba(0,0,0,0.001)] rounded-[24px] p-6 flex flex-col gap-8">
            {/* Logo and Heading */}
            <div className="flex flex-col gap-2.5">
              {/* Company Logo */}
              <div>
                <Image src={SignupLogo} alt="Signup Logo" />
              </div>

              <h1 className="text-3xl font-normal text-[#09090B] w-[364px] h-10">
                Welcome Back
              </h1>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
            >
              <div className="w-5 h-5 relative rounded-sm overflow-hidden">
                <Image src={GoogleIcon} alt="Google Logo" />
              </div>
              <span className="text-base font-medium text-gray-700 cursor-pointer">
                Continue with Google
              </span>
            </button>

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
            <div className="flex flex-col gap-5 w-[364px] h-[208px]">
              {/* Email Input */}
              <div className="flex flex-col gap-1.5 w-[364px] h-10">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleEmailSubmit}
                disabled={!email.trim()}
                className="w-full h-11 bg-[#09090B] hover:bg-gray-800 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </Button>

              {/* Link to Signup */}
              <div className="text-center">
                <Link href="/signup">
                  <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                    Don&apos;t have an account? Create One
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
