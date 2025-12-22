// Onboarding API - API calls for onboarding flow

import { apiClient, ApiResponse } from './client';

export interface OnboardingStatus {
  id: string;
  tenantId: string;
  currentStage: string;
  dataroomName?: string;
  slug?: string;
  teamMembers?: string[];
  selectedPlan?: string;
  selectedBilling?: string;
}

export interface DataroomInput {
  dataroomName: string;
}

export interface UseCaseInput {
  useCase: string;
}

export interface TeamInviteInput {
  teamMembers: string[];
}

/**
 * Get tenantId from localStorage
 */
function getTenantId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tenantId');
  }
  return null;
}

export const onboardingApi = {
  /**
   * Get current onboarding status
   */
  async getStatus(): Promise<ApiResponse<OnboardingStatus>> {
    const tenantId = getTenantId();
    return apiClient.post<OnboardingStatus>('/platform/onboarding', { tenantId });
  },

  /**
   * Set dataroom name (step 1)
   */
  async setDataroom(data: DataroomInput): Promise<ApiResponse<OnboardingStatus>> {
    const tenantId = getTenantId();
    return apiClient.post<OnboardingStatus>('/platform/onboarding/dataroom', {
      ...data,
      tenantId,
    });
  },

  /**
   * Set use case (step 2)
   */
  async setUseCase(data: UseCaseInput): Promise<ApiResponse<OnboardingStatus>> {
    const tenantId = getTenantId();
    return apiClient.post<OnboardingStatus>('/platform/onboarding/use-case', {
      ...data,
      tenantId,
    });
  },

  /**
   * Invite team members (step 3)
   */
  async inviteTeam(data: TeamInviteInput): Promise<ApiResponse<OnboardingStatus>> {
    const tenantId = getTenantId();
    return apiClient.post<OnboardingStatus>('/platform/onboarding/team', {
      ...data,
      tenantId,
    });
  },

  /**
   * Complete onboarding
   */
  async complete(): Promise<ApiResponse<OnboardingStatus>> {
    const tenantId = getTenantId();
    return apiClient.post<OnboardingStatus>('/platform/onboarding/complete', { tenantId });
  },
};

export default onboardingApi;
