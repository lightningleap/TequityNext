// Datarooms API

import { apiClient, ApiResponse } from './client';

export interface Dataroom {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ownerId: string;
  status: 'active' | 'archived' | 'deleted';
  settings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DataroomMember {
  id: string;
  userId: string;
  dataroomId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  joinedAt: string;
}

export interface CreateDataroomRequest {
  name: string;
  description?: string;
}

export interface UpdateDataroomRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'archived';
}

export interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export const dataroomsApi = {
  /**
   * List user's datarooms
   */
  async list(): Promise<ApiResponse<Dataroom[]>> {
    return apiClient.get<Dataroom[]>('/datarooms');
  },

  /**
   * Create a new dataroom
   */
  async create(data: CreateDataroomRequest): Promise<ApiResponse<Dataroom>> {
    return apiClient.post<Dataroom>('/datarooms', data);
  },

  /**
   * Get dataroom by ID
   */
  async get(id: string): Promise<ApiResponse<Dataroom>> {
    return apiClient.get<Dataroom>(`/datarooms/${id}`);
  },

  /**
   * Update dataroom
   */
  async update(id: string, data: UpdateDataroomRequest): Promise<ApiResponse<Dataroom>> {
    return apiClient.patch<Dataroom>(`/datarooms/${id}`, data);
  },

  /**
   * Delete dataroom
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/datarooms/${id}`);
  },

  /**
   * List dataroom members
   */
  async listMembers(dataroomId: string): Promise<ApiResponse<DataroomMember[]>> {
    return apiClient.get<DataroomMember[]>(`/datarooms/${dataroomId}/members`);
  },

  /**
   * Invite member to dataroom
   */
  async inviteMember(dataroomId: string, data: InviteMemberRequest): Promise<ApiResponse<DataroomMember>> {
    return apiClient.post<DataroomMember>(`/datarooms/${dataroomId}/invite`, data);
  },

  /**
   * Remove member from dataroom
   */
  async removeMember(dataroomId: string, memberId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/datarooms/${dataroomId}/members/${memberId}`);
  },
};

export default dataroomsApi;
