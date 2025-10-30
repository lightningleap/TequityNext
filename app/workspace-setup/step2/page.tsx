"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import CompanyLogo from "@/public/SignupLogo.svg";
import Image from "next/image";

export default function WorkspaceSetupStep2Page() {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
    { value: "m&a", label: "M&A Deal" },
    { value: "fundraising", label: "Fundraising" },
    { value: "investor", label: "Investor Reporting" },
    { value: "board", label: "Board Pack" },
    { value: "diligence", label: "Due Diligence" },
    { value: "other", label: "Other" }
  ];

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
            What brings you to Tequity?
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Help us tailor your experience with the right tools.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          {/* Custom Dropdown */}
          <div className="space-y-2">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-10 px-3 border border-gray-300 rounded-lg hover:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm transition-colors"
                >
                  {selectedOption ? 
                    options.find(opt => opt.value === selectedOption)?.label : 
                    'Select an option'}
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-1">
                {options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100"
                    onSelect={() => {
                      setSelectedOption(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <span>{option.label}</span>
                    {selectedOption === option.value && (
                      <Check className="h-4 w-4 text-pink-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption || isLoading}
            className="w-full h-11 cursor-pointer bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
