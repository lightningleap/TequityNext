"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CompanyLogo from "@/public/SignupLogo.svg";
import Image from "next/image";

export default function WorkspaceSetupPage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate workspace name
      if (workspaceName.trim().length < 3) {
        throw new Error("Dataroom name must be at least 3 characters long");
      }

      if (workspaceName.trim().length > 50) {
        throw new Error("Dataroom name must not exceed 50 characters");
      }

      // Check for invalid characters
      const invalidChars = /[<>:"/\\|?*]/;
      if (invalidChars.test(workspaceName)) {
        throw new Error("Dataroom name contains invalid characters");
      }

      // TODO: Replace with actual API call
      // const response = await fetch('/api/workspace/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: workspaceName }),
      // });
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || 'Failed to create dataroom');
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to step 2
      router.push("/workspace-setup/step2");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create dataroom. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="flex flex-col gap-8">
        {/* Company Logo */}
        <div>
          <Image src={CompanyLogo} alt="Company Logo" width={60} height={40} />
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
          {/* Error Message */}
          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Workspace Name Input */}
          <div className="space-y-2">
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Dataroom Name"
              className={`w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors ${
                error
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'
              }`}
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
            className="w-full h-11 cursor-pointer bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Setting up..." : "Set up dataroom"}
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
