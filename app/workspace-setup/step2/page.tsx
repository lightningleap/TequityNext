"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CompanyLogo from "@/public/CompanyLogo.svg";
import Image from "next/image";

export default function WorkspaceSetupStep2Page() {
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    // Navigate to step 3
    router.push("/workspace-setup/step3");
  };

  const options = [
    "M&A Deal",
    "Fundraising",
    "Investor Reporting",
    "Board Pack",
    "Due Diligence",
    "Other"
  ];

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
            What brings you to Tequity?
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Help us tailor your experience with the right tools.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          {/* Dropdown Selection */}
          <div className="space-y-2">
            <div className="relative">
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-colors appearance-none bg-white"
                required
              >
                <option value="">Select an option</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption || isLoading}
            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Setting up..." : "Continue"}
          </Button>

          {/* Progress Indicators - Step 2 of 4 */}
          <div className="flex items-center justify-center space-x-2">
            {/* Step 1 - Completed */}
            <div className="w-10 h-1 bg-gray-900 rounded-full"></div>
            {/* Step 2 - Active */}
            <div className="w-10 h-1 bg-gray-900 rounded-full"></div>
            {/* Step 3 - Inactive */}
            <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
            {/* Step 4 - Inactive */}
            <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
          </div>

          {/* Additional Navigation */}
          <div className="text-center">
            <Link href="/workspace-setup">
              <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                Back to workspace name
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
