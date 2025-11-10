"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plus-jakarta",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});

export default function PricingPage() {
  const [billingType, setBillingType] = useState("yearly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectPlan = async (planName: string) => {
    setSelectedPlan(planName);
    setLoadingPlan(planName);

    try {
      // TODO: Replace with actual API call to save selected plan
      // const response = await fetch('/api/subscription/select', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ plan: planName, billing: billingType }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to Dashboard
      router.push("/Dashboard/Library");
    } catch (error) {
      console.error("Error selecting plan:", error);
      setLoadingPlan(null);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
      {/* Main Container - Responsive width */}
      <div className="max-w-[1280px] min-h-[947.6px] mx-auto flex items-left justify-center py-8">
        {/* Form Container */}
        <div className="w-full max-w-[1000px] min-h-[755.6px] flex flex-col items-center gap-7">
          {/* Header Section - Left Aligned */}
          <div className="w-full max-w-[1000px] flex flex-col items-start gap-6">
            {/* Main Heading and Subheading */}
            <div className="text-left">
              <h1 className={plusJakartaSans.className} style={{
                fontWeight: 400,
                fontSize: '32px',
                lineHeight: '50px',
                letterSpacing: '0px',
                verticalAlign: 'middle',
                color: '#111827',
                margin: 0
              }}>
                Try Tequity{" "}
                <span style={{
                  fontWeight: 600,
                  fontSize: '32px',
                  lineHeight: '40px',
                  letterSpacing: '0px',
                  verticalAlign: 'middle',
                  color: '#EC4899'
                }}>FREE</span> for 30-Days
              </h1>
              <h2 className={instrumentSerif.className} style={{
                fontWeight: 400,
                fontSize: '32px',
                lineHeight: '1',
                letterSpacing: '1.5px',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                transform: 'scale(1, 1.5)',
                transformOrigin: 'center',
                height: '60px',
                width: '100%',
              }}>
                No credit card required.
              </h2>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center gap-4">
              <div className="relative inline-flex items-center bg-white p-1 rounded-full border border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setBillingType("monthly")}
                    className={`relative px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                      billingType === "monthly"
                        ? "bg-black text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingType("yearly")}
                    className={`relative px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                      billingType === "yearly"
                        ? "bg-black text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              {billingType === "yearly" && (
                <span className="px-2 py-2 text-[#71717A] text-xs font-semibold rounded-full whitespace-nowrap">
                  <span className="text-blue-500">Save 33%</span> on a yearly subscription
                </span>
              )}
            </div>
          </div>

          {/* Pricing Cards Section */}
          <div className="w-full min-h-[566px] flex gap-5 justify-start xl:justify-center overflow-x-auto overflow-y-visible xl:overflow-x-visible scrollbar-hide snap-x snap-mandatory px-4 xl:px-0 xl:flex-row items-center pb-4 pt-5">
            {/* Starter Plan Card */}
            <div className={`w-[320px] min-w-[300px] flex-shrink-0 h-[600px] border-2 rounded-2xl snap-center transition-all duration-300 cursor-pointer ${
              selectedPlan === "Starter"
                ? "bg-[#F4F4F5] border-gray-300 hover:shadow-lg hover:shadow-gray-100/50"
                : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-100/50 hover:scale-102 hover:-translate-y-1"
            }`}
            onClick={() => !loadingPlan && setSelectedPlan(selectedPlan === "Starter" ? null : "Starter")}
            >
              <div className="w-[320px] h-[600px] flex flex-col items-start p-6 gap-4">
                {/* Card Header */}
                <div className="w-[211px] h-[116px] flex flex-col items-start gap-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className={instrumentSerif.className} style={{
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '32px',
                        letterSpacing: '0px',
                        color: '#111827'
                      }}>
                        Starter
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Best for early-stage startups.
                    </p>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-medium text-gray-900">
                      ${billingType === "yearly" ? "12" : "15"}
                    </span>
                    <div className="flex flex-col pb-1">
                      <span className="text-xs text-gray-500">per month</span>
                      <span className="text-xs text-gray-500">billed yearly</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan("Starter");
                  }}
                  disabled={loadingPlan !== null && loadingPlan !== "Starter"}
                  className={`w-full h-11 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl ${
                    loadingPlan === "Starter" || selectedPlan === "Starter"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-800 border-gray-300 hover:border-gray-900 hover:scale-105"
                  }`}
                >
                  {loadingPlan === "Starter" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting trial...
                    </span>
                  ) : (
                    "Start 30 days free trial"
                  )}
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
            <div className={`w-[320px] min-w-[300px] flex-shrink-0 h-[620px] border-2 rounded-2xl snap-center relative transition-all duration-300 cursor-pointer ${
              selectedPlan === "Professional"
                ? "bg-[#F4F4F5] border-gray-300 hover:shadow-lg hover:shadow-gray-100/50"
                : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-100/50 hover:scale-102 hover:-translate-y-1"
            }`}
            onClick={() => !loadingPlan && setSelectedPlan(selectedPlan === "Professional" ? null : "Professional")}
            >
              <div className="w-[320px] h-[620px] flex flex-col items-start p-6 gap-4">
                {/* Card Header */}
                <div className="w-[223px] h-[116px] flex flex-col items-start gap-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className={instrumentSerif.className} style={{
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '32px',
                        letterSpacing: '0px',
                        color: '#111827'
                      }}>
                        Professional
                      </h3>
                      <div className="px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-sm shadow">
                        Popular
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      For large teams & corporations.
                    </p>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-medium text-gray-900">
                      ${billingType === "yearly" ? "25" : "30"}
                    </span>
                    <div className="flex flex-col pb-1">
                      <span className="text-xs text-gray-500">per month</span>
                      <span className="text-xs text-gray-500">billed yearly</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan("Professional");
                  }}
                  disabled={loadingPlan !== null && loadingPlan !== "Professional"}
                  className={`w-full h-11 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl ${
                    loadingPlan === "Professional" || selectedPlan === "Professional"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-800 border-gray-300 hover:border-gray-900 hover:scale-105"
                  }`}
                >
                  {loadingPlan === "Professional" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting trial...
                    </span>
                  ) : (
                    "Start 30 days free trial"
                  )}
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
            <div className={`w-[320px] min-w-[300px] flex-shrink-0 h-[600px] border-2 rounded-2xl snap-center transition-all duration-300 cursor-pointer ${
              selectedPlan === "Enterprise"
                ? "bg-[#F4F4F5] border-gray-300 hover:shadow-lg hover:shadow-gray-100/50"
                : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-100/50 hover:scale-102 hover:-translate-y-1"
            }`}
            onClick={() => !loadingPlan && setSelectedPlan(selectedPlan === "Enterprise" ? null : "Enterprise")}
            >
              <div className="w-[320px] h-[600px] flex flex-col items-start p-6 gap-4">
                {/* Card Header */}
                <div className="w-[187px] h-[116px] flex flex-col items-start gap-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className={instrumentSerif.className} style={{
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '32px',
                        letterSpacing: '0px',
                        color: '#111827'
                      }}>
                        Enterprise
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      For large organizations.
                    </p>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-medium text-gray-900">
                      ${billingType === "yearly" ? "50" : "60"}
                    </span>
                    <div className="flex flex-col pb-1">
                      <span className="text-xs text-gray-500">per month</span>
                      <span className="text-xs text-gray-500">billed yearly</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan("Enterprise");
                  }}
                  disabled={loadingPlan !== null && loadingPlan !== "Enterprise"}
                  className={`w-full h-11 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl ${
                    loadingPlan === "Enterprise" || selectedPlan === "Enterprise"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-800 border-gray-300 hover:border-gray-900 hover:scale-105"
                  }`}
                >
                  {loadingPlan === "Enterprise" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting trial...
                    </span>
                  ) : (
                    "Start 30 days free trial"
                  )}
                </Button>

                {/* Features List */}
                <div className="flex flex-col gap-3 flex-1">
                  {/* Feature items */}
                  {[
                    "Unlimited Paid Users",
                    "Unlimited Total Users",
                    "Unlimited Cloud Storage",
                    "Unlimited active deal rooms",
                    "White-label customization",
                    "Dedicated account manager",
                    "Custom integrations & API access",
                    "SSO & advanced security",
                    "Priority phone & email support",
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
