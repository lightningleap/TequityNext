"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const [billingType, setBillingType] = useState("yearly");
  const router = useRouter();

  const handleBack = () => {
    router.push("/workspace-setup/step3");
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
      {/* Main Container - Responsive width */}
      <div className="max-w-[1280px] min-h-[947.6px] mx-auto flex items-left justify-center py-8">
        {/* Form Container */}
        <div className="w-full max-w-[1000px] min-h-[755.6px] flex flex-col items-center gap-7">
          {/* Header Section */}
          <div className="w-full max-w-[1000px] min-h-[82px] flex flex-col items-center gap-2 text-center">
            {/* Main Heading */}
            <div className="text-center">
              <h1 className="text-3xl font-normal text-gray-900">
                Try Tequity{" "}
                <span className="font-bold underline-pink-600">FREE</span> for
                30-Days
              </h1>
            </div>

            {/* Subheading */}
            <div className="text-center">
              <h2 className="text-3xl font-normal text-gray-900">
                No credit card required.
              </h2>
            </div>

            {/* Scribble decoration */}
          </div>

          {/* Toggle Section */}
          <div className="flex items-center justify-center gap-2">
            {/* Monthly Button */}
            <button
              onClick={() => setBillingType("monthly")}
              className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                billingType === "monthly"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-500 border border-gray-300"
              }`}
            >
              Monthly
            </button>

            {/* Yearly Button */}
            <button
              onClick={() => setBillingType("yearly")}
              className={`px-3 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                billingType === "yearly"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-500 border border-gray-300"
              }`}
            >
              Yearly
            </button>

            {/* Save 33% badge */}
            <div className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
              Save 33%
            </div>
          </div>

          {/* Pricing Cards Section */}
          <div className="w-full min-h-[566px] flex gap-5 justify-center xl:flex-row flex-col items-center">
            {/* Starter Plan Card */}
            <div className="w-[320px] min-w-[300px] h-[600px] bg-white border border-gray-300 rounded-2xl xl:flex-shrink-0 mx-auto">
              <div className="w-[320px] h-[600px] flex flex-col items-start p-6 gap-4">
                {/* Card Header */}
                <div className="w-[211px] h-[116px] flex flex-col items-start gap-8">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-normal text-gray-900">
                      Starter
                    </h3>
                    <p className="text-sm text-gray-500">
                      Best for early-stage startups.
                    </p>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-medium text-gray-900">
                      ${billingType === "yearly" ? "12" : "15"}
                    </span>
                    <span className="text-xs text-gray-500 pb-1">
                      per month billed yearly
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="outline"
                  className="w-full h-11 bg-gray-100 hover:bg-gray-50 text-gray-800 border-gray-300 rounded-lg font-medium"
                >
                  Start 30 days free trial
                </Button>

                {/* Features List */}
                <div className="flex flex-col gap-3 flex-1">
                  {/* Feature items */}
                  {[
                    "3 Paid Users",
                    "200 Total Users",
                    "1 TB Cloud Storage",
                    "AI data room setup from file dump",
                    "Auto-organization of up to 50 documents",
                    "Basic investor access (view-only)",
                    "Limited activity tracking (500 views)",
                    "Email support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5">
                        <svg
                          className="w-4 h-4 text-gray-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {feature}
                      </span>
                    </div>
                  ))}

                  {/* Navigation inside card */}
                </div>
              </div>
            </div>

            {/* Professional Plan Card - Highlighted */}
            <div className="w-[320px] min-w-[300px] h-[620px] bg-gray-100 border-2 border-gray-300 rounded-2xl xl:flex-shrink-0 relative mx-auto">
              {/* Badge */}

              <div className="w-[320px] h-[620px] flex flex-col items-start p-6 gap-4">
                {/* Card Header */}
                <div className="w-[223px] h-[116px] flex flex-col items-start gap-8">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-normal text-gray-900">
                      Professional
                    </h3>
                    <p className="text-sm text-gray-500">
                      For large teams & corporations.
                    </p>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-medium text-gray-900">
                      ${billingType === "yearly" ? "25" : "30"}
                    </span>
                    <span className="text-xs text-gray-500 pb-1">
                      per month billed yearly
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium">
                  Start 30 days free trial
                </Button>

                {/* Features List */}
                <div className="flex flex-col gap-3 flex-1">
                  {/* Feature items */}
                  {[
                    "10 Paid Users",
                    "1,000 Total Users",
                    "Unlimited Cloud Storage",
                    "Up to 3 active deal rooms",
                    "Full AI-powered Q&A + search",
                    "Custom document requests & fulfillment",
                    "Advanced activity tracking",
                    "Slack/CRM integrations",
                    "Email support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5">
                        <svg
                          className="w-4 h-4 text-gray-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {feature}
                      </span>
                    </div>
                  ))}

                  {/* Navigation inside card */}
                </div>
              </div>
            </div>

            {/* Enterprise Plan Card */}
            <div className="w-[320px] min-w-[300px] h-[600px] bg-white border border-gray-300 rounded-2xl xl:flex-shrink-0 mx-auto">
              <div className="w-[320px] h-[600px] flex flex-col items-start p-6 gap-4">
                {/* Card Header */}
                <div className="w-[187px] h-[116px] flex flex-col items-start gap-8">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-normal text-gray-900">
                      Enterprise
                    </h3>
                    <p className="text-sm text-gray-500">
                      Best for early-stage startups.
                    </p>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-medium text-gray-900">
                      ${billingType === "yearly" ? "12" : "15"}
                    </span>
                    <span className="text-xs text-gray-500 pb-1">
                      per month billed yearly
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="outline"
                  className="w-full h-11 bg-gray-100 hover:bg-gray-50 text-gray-800 border-gray-300 rounded-lg font-medium"
                >
                  Start 30 days free trial
                </Button>

                {/* Features List */}
                <div className="flex flex-col gap-3 flex-1">
                  {/* Feature items */}
                  {[
                    "3 Paid Users",
                    "200 Total Users",
                    "1 TB Cloud Storage",
                    "AI data room setup from file dump",
                    "Auto-organization of up to 50 documents",
                    "Basic investor access (view-only)",
                    "Limited activity tracking (500 views)",
                    "Email support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5">
                        <svg
                          className="w-4 h-4 text-gray-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {feature}
                      </span>
                    </div>
                  ))}

                  {/* Navigation inside card */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
