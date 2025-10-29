"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import SignupGraphic from "../../public/SignupGraphic.svg";
import GoogleIcon from "../../public/GoogleIcon.svg";
import SignupLogo from "../../public/SignupLogo.svg";
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
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
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random API failure (20% chance)
          if (Math.random() < 0.2) {
            reject(new Error('Network error. Please try again.'));
          } else {
            resolve(true);
          }
        }, 1500);
      });

      // On success
      setIsSuccess(true);
      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        router.push("/workspace-setup");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Side - Image (Hidden on small/medium devices, 50% on large) */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-50 relative overflow-hidden">
        <Image
          src={SignupGraphic}
          alt="Signup Graphic"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Right Side - Form (Full width on small/medium, 50% on large) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Simple Header */}
          <Image src={SignupLogo} alt="Signup Logo" />
          <div className="space-y-2">
            <h1 className="text-3xl font-normal text-gray-900">
              Get Started Now
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Secure your workspace, streamline due diligence, and join a
              trusted network of dealmakers.
            </p>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer"
          >
            <div className="w-5 h-5 relative rounded-sm overflow-hidden">
              <Image src={GoogleIcon} alt="Google Logo" />{" "}
            </div>
            <span className="text-base font-medium text-gray-700 cursor-pointer">
              Continue with Google
            </span>
          </button>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative bg-white px-4">
              <span className="text-base text-gray-500 font-medium">or</span>
            </div>
          </div>
          {/* Simple Form Fields */}
          <div className="space-y-6">
            {/* Simple Email Input */}
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full h-12 px-4 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors`}
                required
                disabled={isLoading || isSuccess}
              />
            </div>

            {/* Error Message */}
            {(error || emailError) && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error || emailError}
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!email.trim() || isLoading || isSuccess}
              className="w-full h-12 cursor-pointer bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : isSuccess ? 'Continuing...' : 'Continue'}
            </Button>

            {/* Simple Divider */}

            {/* Simple Navigation Options */}
            <div className="text-center">
              <Link href="/login">
                <span className="text-base text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                  Already have an account? <span className="text-gray-900 font-medium">Log in</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
