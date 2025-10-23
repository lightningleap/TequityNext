"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CompanyLogo from "@/public/CompanyLogo.svg";
import Image from "next/image";

export default function WorkspaceSetupPage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    // Navigate to step 2
    router.push("/workspace-setup/step2");
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
            Welcome to Tequity
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Create a secure room for your deal, project, or confidential files.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          {/* Workspace Name Input */}
          <div className="space-y-2">
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Dataroom Name"
              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-colors"
              required
            />
            {/* Caption */}
            <p className="text-xs text-gray-500">
              You can rename this later — no commitments yet.
            </p>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleSubmit}
            disabled={!workspaceName.trim() || isLoading}
            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Continue"}
          </Button>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center space-x-2">
            {/* Step 1 - Active */}
            <div className="w-10 h-1 bg-gray-900 rounded-full"></div>
            {/* Step 2 - Inactive */}
            <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
            {/* Step 3 - Inactive */}
            <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
            {/* Step 4 - Inactive */}
            <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
          </div>

          {/* Additional Navigation */}
          <div className="text-center">
            <Link href="/login">
              <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                Back to login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
