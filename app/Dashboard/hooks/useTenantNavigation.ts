"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Hook for tenant-aware navigation
 * Detects if we're in a tenant route (/{slug}/...) and builds URLs accordingly
 */
export function useTenantNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract tenant slug from current path if in tenant route
  const tenantSlug = useMemo(() => {
    // Check if path starts with a slug (not a known route like /Dashboard, /login, etc.)
    const knownRoutes = [
      "/Dashboard",
      "/login",
      "/signup",
      "/pricing",
      "/workspace-setup",
      "/checkout",
    ];

    const isKnownRoute = knownRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isKnownRoute) {
      // We're in old-style routes, get slug from localStorage
      if (typeof window !== "undefined") {
        return localStorage.getItem("tenantSlug");
      }
      return null;
    }

    // Extract slug from path like /lla/dashboard/...
    const match = pathname.match(/^\/([^\/]+)\//);
    return match ? match[1] : null;
  }, [pathname]);

  // Check if we're currently in a tenant-prefixed route
  const isInTenantRoute = useMemo(() => {
    return (
      tenantSlug !== null &&
      pathname.startsWith(`/${tenantSlug}/`)
    );
  }, [pathname, tenantSlug]);

  // Build a URL with the tenant prefix if applicable
  const buildUrl = useCallback(
    (path: string): string => {
      // If path already starts with tenant slug, return as-is
      if (tenantSlug && path.startsWith(`/${tenantSlug}/`)) {
        return path;
      }

      // Map old Dashboard routes to new tenant routes
      const routeMap: Record<string, string> = {
        "/Dashboard": "/dashboard",
        "/Dashboard/Home": "/dashboard",
        "/Dashboard/Library": "/dashboard/library",
        "/Dashboard/chat": "/dashboard/chat",
      };

      // If we're in a tenant route and have a mapping, use tenant-prefixed URL
      if (isInTenantRoute && tenantSlug) {
        const mappedPath = routeMap[path];
        if (mappedPath) {
          return `/${tenantSlug}${mappedPath}`;
        }
        // For unknown paths within tenant route, just return original
        return path;
      }

      // Not in tenant route, use original path
      return path;
    },
    [tenantSlug, isInTenantRoute]
  );

  // Navigate with tenant awareness
  const navigate = useCallback(
    (path: string) => {
      router.push(buildUrl(path));
    },
    [router, buildUrl]
  );

  return {
    tenantSlug,
    isInTenantRoute,
    buildUrl,
    navigate,
    router,
  };
}
