"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CompanyLogo from "@/public/CompanyLogo.svg";
import Image from "next/image";

export default function WorkspaceSetupStep3Page() {
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [email3, setEmail3] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    // Navigate to pricing page
    router.push("/pricing");
  };

  const handleSkip = () => {
    // Navigate to pricing page when skipping
    router.push("/pricing");
  };

  const handleBack = () => {
    console.log("Back to step 2");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="flex flex-col gap-8">
        {/* Company Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
            {/* Logo background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-pink-600/20" />
            <Image
              src={CompanyLogo}
              alt="Company Logo"
              width={20}
              height={20}
              className="relative z-10 brightness-0 invert"
            />
          </div>
        </div>

        {/* Heading Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-normal text-gray-900">
            Invite Your Team
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Add team members to collaborate in your dataroom.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          {/* Email Input Fields */}
          <div className="space-y-4">
            {/* Email Input 1 */}
            <div className="space-y-2">
              <input
                type="email"
                value={email1}
                onChange={(e) => setEmail1(e.target.value)}
                placeholder="Enter email address"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-colors"
              />
            </div>

            {/* Email Input 2 */}
            <div className="space-y-2">
              <input
                type="email"
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
                placeholder="Enter email address"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-colors"
              />
            </div>

            {/* Email Input 3 */}
            <div className="space-y-2">
              <input
                type="email"
                value={email3}
                onChange={(e) => setEmail3(e.target.value)}
                placeholder="Enter email address"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Primary Continue Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending invitations..." : "Send Invitations"}
          </Button>

          {/* Secondary Buttons */}
          <div className="space-y-3">
            {/* Skip Button */}
            <Button
              onClick={handleSkip}
              variant="link"
              className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
            >
              Skip for now, I’ll invite later
            </Button >

            {/* Back Button */}
          </div>

          {/* Progress Indicators - Step 3 of 4 */}
          <div className="flex items-center justify-center space-x-2">
            {/* Step 1 - Completed */}
            <div className="w-10 h-1 bg-gray-900 rounded-full"></div>
            {/* Step 2 - Completed */}
            <div className="w-10 h-1 bg-gray-900 rounded-full"></div>
            {/* Step 3 - Active */}
            <div className="w-10 h-1 bg-gray-900 rounded-full"></div>
            {/* Step 4 - Inactive */}
            <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
          </div>

          {/* Loader/Progress Bar */}

          {/* Additional Navigation */}
          <div className="text-center">
            <Link href="/workspace-setup/step2">
              <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                Back to use case selection
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
