// Users API

import { apiClient, ApiResponse } from './client';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending' | 'suspended';
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  avatarUrl?: string;
}

export interface InviteUserRequest {
  email: string;
  role?: 'admin' | 'member';
  dataroomIds?: string[];
}

export const usersApi = {
  /**
   * Get current user profile
   */
  async getMe(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/users/me');
  },

  /**
   * List all users in tenant
   */
  async list(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>('/users');
  },

  /**
   * Get user by ID
   */
  async get(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${id}`);
  },

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.patch<User>(`/users/${id}`, data);
  },

  /**
   * Invite new user
   */
  async invite(data: InviteUserRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/users/invite', data);
  },

  /**
   * Suspend user
   */
  async suspend(id: string): Promise<ApiResponse<User>> {
    return apiClient.post<User>(`/users/${id}/suspend`);
  },

  /**
   * Delete user
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/users/${id}`);
  },

  /**
   * Update current user profile
   */
  async updateMe(data: UpdateUserRequest): Promise<ApiResponse<User>> {
    const me = await this.getMe();
    if (me.success && me.data) {
      return this.update(me.data.id, data);
    }
    return { success: false, error: 'Failed to get current user' };
  },
};

export default usersApi;
