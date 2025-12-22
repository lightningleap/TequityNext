// User Authentication API

import { apiClient, ApiResponse } from './client';

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface SigninRequest {
  email: string;
  password?: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
  purpose: 'email_verification' | 'login_otp';
}

export interface ResendOtpRequest {
  email: string;
  purpose: 'email_verification' | 'login_otp';
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    fullName?: string | null;
    role?: string;
    tenantSlug?: string;
  };
  tenantId?: string;
  email?: string;
  redirectUrl?: string;
}

export const authApi = {
  /**
   * Sign up a new user
   */
  async signup(data: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/signup', data);
  },

  /**
   * Sign in - sends OTP to email
   */
  async signin(email: string): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/signin', { email });
  },

  /**
   * Verify OTP code
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<AuthResponse>> {
    // Backend expects 'otp' field, not 'code'
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', {
      email: data.email,
      otp: data.code,
      purpose: data.purpose,
    });

    if (response.success && response.data) {
      // Store token for future requests
      if (response.data.token) {
        apiClient.setToken(response.data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.token);
        }
      }
      if (typeof window !== 'undefined') {
        // Store user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          // Store tenantSlug separately for easy access
          if (response.data.user.tenantSlug) {
            localStorage.setItem('tenantSlug', response.data.user.tenantSlug);
          }
        }
        // Store tenantId and email for pricing/checkout flow
        if (response.data.tenantId) {
          localStorage.setItem('tenantId', response.data.tenantId);
        }
        if (response.data.email) {
          localStorage.setItem('userEmail', response.data.email);
        }
      }
    }

    return response;
  },

  /**
   * Resend OTP code
   */
  async resendOtp(data: ResendOtpRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/resend-otp', data);
  },

  /**
   * Logout - clear token
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout');
    apiClient.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
    return response;
  },

  /**
   * Initialize token from storage
   */
  initFromStorage(): { token: string | null; user: unknown } {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');
      if (token) {
        apiClient.setToken(token);
      }
      return {
        token,
        user: userStr ? JSON.parse(userStr) : null,
      };
    }
    return { token: null, user: null };
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  },
};

export default authApi;
