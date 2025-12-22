"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import CompanyLogo from "@/public/SignupLogo.svg";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type MigrationStatus = "verifying" | "provisioning" | "migrating" | "completed" | "error";

interface MigrationStep {
  id: MigrationStatus;
  label: string;
  description: string;
}

const migrationSteps: MigrationStep[] = [
  {
    id: "verifying",
    label: "Verifying Payment",
    description: "Confirming your subscription details...",
  },
  {
    id: "provisioning",
    label: "Setting Up Your Workspace",
    description: "Creating your secure dataroom environment...",
  },
  {
    id: "migrating",
    label: "Preparing Your Account",
    description: "Finalizing your account configuration...",
  },
  {
    id: "completed",
    label: "All Done!",
    description: "Redirecting you to your dashboard...",
  },
];

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<MigrationStatus>("verifying");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const verifyAndMigrate = useCallback(async () => {
    if (!sessionId) {
      setError("Invalid checkout session. Please try again.");
      setStatus("error");
      return;
    }

    try {
      // Step 1: Verify payment
      setStatus("verifying");
      setProgress(10);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const verifyResponse = await fetch(`${apiUrl}/checkout/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!verifyResponse.ok) {
        throw new Error("Payment verification failed");
      }

      const verifyData = await verifyResponse.json();
      setProgress(25);

      if (!verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      // Store tenant info for later use
      if (verifyData.data?.tenantId) {
        localStorage.setItem("tenantId", verifyData.data.tenantId);
      }

      // Step 2: Provisioning
      setStatus("provisioning");
      setProgress(40);

      // Poll for provisioning status
      const tenantId = verifyData.data?.tenantId;
      if (tenantId) {
        let provisioningComplete = false;
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds max

        while (!provisioningComplete && attempts < maxAttempts) {
          const statusResponse = await fetch(
            `${apiUrl}/tenants/${tenantId}/status`
          );

          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            const provisioningStatus = statusData.data?.provisioningStatus;

            if (provisioningStatus === "completed") {
              provisioningComplete = true;
            } else if (provisioningStatus === "failed") {
              throw new Error("Workspace provisioning failed");
            }
          }

          if (!provisioningComplete) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempts++;
            // Gradually increase progress during polling
            setProgress(40 + Math.min(attempts * 1.5, 30));
          }
        }

        if (!provisioningComplete && attempts >= maxAttempts) {
          // Provisioning is taking longer than expected, but continue
          console.warn("Provisioning is taking longer than expected");
        }
      }

      setProgress(75);

      // Step 3: Migration/finalization
      setStatus("migrating");
      setProgress(85);

      // Brief pause for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProgress(100);

      // Step 4: Completed
      setStatus("completed");

      // Redirect after a short delay - use tenant slug if available
      setTimeout(() => {
        const tenantSlug = localStorage.getItem("tenantSlug");
        if (tenantSlug) {
          router.push(`/${tenantSlug}/dashboard/home`);
        } else {
          router.push("/Dashboard/Home");
        }
      }, 1500);
    } catch (err) {
      console.error("Migration error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("error");
    }
  }, [sessionId, router]);

  useEffect(() => {
    verifyAndMigrate();
  }, [verifyAndMigrate]);

  const getCurrentStepIndex = () => {
    return migrationSteps.findIndex((step) => step.id === status);
  };

  const currentStepIndex = getCurrentStepIndex();

  if (status === "error") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center max-w-md text-center">
          <Image
            src={CompanyLogo}
            alt="Company Logo"
            width={60}
            height={40}
            className="mb-8"
          />

          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-500 mb-6">{error}</p>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/pricing")}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Pricing
            </button>
            <button
              onClick={() => {
                setError(null);
                setStatus("verifying");
                verifyAndMigrate();
              }}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="flex flex-col items-center max-w-lg w-full">
        <Image
          src={CompanyLogo}
          alt="Company Logo"
          width={60}
          height={40}
          className="mb-8"
        />

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Setting up your workspace
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Please wait while we prepare everything for you. This usually takes
          less than a minute.
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-sm mb-8">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D91D69] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            {progress}% complete
          </p>
        </div>

        {/* Steps */}
        <div className="w-full max-w-sm space-y-4">
          {migrationSteps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-50 border border-gray-200"
                    : isCompleted
                    ? "bg-green-50 border border-green-100"
                    : "bg-gray-50/50"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  ) : isActive ? (
                    <div className="w-6 h-6 rounded-full bg-[#D91D69] flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-medium">
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${
                      isCompleted
                        ? "text-green-700"
                        : isActive
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {(isActive || isCompleted) && (
                    <p
                      className={`text-sm mt-0.5 ${
                        isCompleted ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isCompleted ? "Completed" : step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-8 text-center">
          Do not close this window while setup is in progress.
        </p>
      </div>
    </div>
  );
}
