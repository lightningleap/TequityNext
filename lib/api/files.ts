// Files API

import { apiClient, ApiResponse } from './client';

export interface FileItem {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  dataroomId: string;
  folderId?: string;
  uploadedBy: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  isStarred: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UploadFileRequest {
  file: File;
  dataroomId: string;
  folderId?: string;
}

export interface ListFilesParams {
  dataroomId?: string;
  folderId?: string;
  limit?: number;
  offset?: number;
}

export const filesApi = {
  /**
   * List files
   */
  async list(params?: ListFilesParams): Promise<ApiResponse<FileItem[]>> {
    return apiClient.get<FileItem[]>('/files', params);
  },

  /**
   * Get starred files
   */
  async getStarred(): Promise<ApiResponse<FileItem[]>> {
    return apiClient.get<FileItem[]>('/files/starred');
  },

  /**
   * Get recent files
   */
  async getRecent(limit?: number): Promise<ApiResponse<FileItem[]>> {
    return apiClient.get<FileItem[]>('/files/recent', { limit: limit || 10 });
  },

  /**
   * Upload file
   */
  async upload(data: UploadFileRequest): Promise<ApiResponse<FileItem>> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('dataroomId', data.dataroomId);
    if (data.folderId) {
      formData.append('folderId', data.folderId);
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const token = apiClient.getToken();

    try {
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || result.message || 'Upload failed',
          code: result.code,
        };
      }

      return {
        success: true,
        data: result.data !== undefined ? result.data : result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        code: 'UPLOAD_ERROR',
      };
    }
  },

  /**
   * Get file by ID
   */
  async get(id: string): Promise<ApiResponse<FileItem>> {
    return apiClient.get<FileItem>(`/files/${id}`);
  },

  /**
   * Download file
   */
  async download(id: string): Promise<Blob | null> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const token = apiClient.getToken();

    try {
      const response = await fetch(`${API_BASE_URL}/files/${id}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        return null;
      }

      return await response.blob();
    } catch {
      return null;
    }
  },

  /**
   * Star/unstar file
   */
  async toggleStar(id: string): Promise<ApiResponse<FileItem>> {
    return apiClient.post<FileItem>(`/files/${id}/star`);
  },

  /**
   * Delete file
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/files/${id}`);
  },
};

export default filesApi;
