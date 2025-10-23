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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    // Navigate to login page after successful signup
    router.push("/login");
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign-in clicked");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Takes exactly half screen */}
      <div className="w-1/2 p-2 bg-gray-50 flex items-center justify-center ">
        <Image src={SignupGraphic} alt="Signup Graphic" className="w-full h-[800px] object-cover rounded-lg" />
      </div>

      {/* Right Side - Takes exactly half screen with simple form */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-white">
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
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors"
                required
              />
            </div>

            {/* Simple Continue Button */}
            <Button
              onClick={handleSubmit}
              disabled={!email.trim() || isLoading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Creating account..." : "Continue"}
            </Button>

            {/* Simple Divider */}

            {/* Simple Navigation Options */}
            <div className="text-center">
              <Link href="/login">
                <span className="text-base text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                  Already have an account? Log in
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
