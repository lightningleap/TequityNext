"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { ChatProvider } from "@/app/Dashboard/context/ChatContext";
import { FilesProvider } from "@/app/Dashboard/context/FilesContext";

interface TenantLayoutProps {
  children: React.ReactNode;
}

export default function TenantLayout({ children }: TenantLayoutProps) {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth from storage
    const { token } = authApi.initFromStorage();

    if (!token) {
      // Not authenticated, redirect to login
      router.push("/login");
      return;
    }

    // Check if user has access to this tenant
    const storedSlug = localStorage.getItem("tenantSlug");

    if (!storedSlug) {
      // No tenant slug stored, redirect to login
      router.push("/login");
      return;
    }

    if (storedSlug !== slug) {
      // User is trying to access a different tenant, redirect to their tenant
      router.push(`/${storedSlug}/dashboard`);
      return;
    }

    // User is authorized
    setIsAuthorized(true);
    setIsLoading(false);
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  // Wrap with the same providers as the original Dashboard
  return (
    <ChatProvider>
      <FilesProvider>{children}</FilesProvider>
    </ChatProvider>
  );
}
