import { NextRequest } from 'next/server'
import prisma, { isValidTenantSlug } from '@/lib/db'
import { verifyAuthWithTenant } from '@/lib/auth'
import { successResponse, ApiErrors } from '@/lib/api-response'

/**
 * GET /api/[customer_slug]/auth/me
 * Get current authenticated user info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customer_slug: string }> }
) {
  try {
    const { customer_slug: tenantSlug } = await params

    // Validate tenant slug format
    if (!isValidTenantSlug(tenantSlug)) {
      return ApiErrors.invalidTenant()
    }

    // Verify authentication
    const payload = await verifyAuthWithTenant(request, tenantSlug)

    if (!payload) {
      return ApiErrors.unauthorized()
    }

    // Get user with related data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        settings: true,
        subscription: true,
        memberships: {
          include: {
            dataroom: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: {
            status: 'active',
          },
        },
      },
    })

    if (!user) {
      return ApiErrors.notFound('User')
    }

    if (!user.isActive) {
      return ApiErrors.forbidden()
    }

    return successResponse({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      tenantSlug: user.tenantSlug,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      settings: user.settings,
      subscription: user.subscription
        ? {
            plan: user.subscription.plan,
            billing: user.subscription.billing,
            status: user.subscription.status,
            expiresAt: user.subscription.expiresAt,
          }
        : null,
      datarooms: user.memberships.map((m) => ({
        id: m.dataroom.id,
        name: m.dataroom.name,
        role: m.role,
      })),
    })
  } catch (error) {
    console.error('Get me error:', error)
    return ApiErrors.internalError()
  }
}
