// Chat API (RAG Service)

import { apiClient, ApiResponse } from './client';

export interface ChatSession {
  id: string;
  title?: string;
  dataroomId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  createdAt: string;
}

export interface ChatSource {
  fileId: string;
  fileName: string;
  chunk: string;
  score: number;
}

export interface CreateSessionRequest {
  dataroomId: string;
  title?: string;
}

export interface AskQuestionRequest {
  sessionId?: string;
  dataroomId: string;
  question: string;
}

export interface AskQuestionResponse {
  sessionId: string;
  answer: string;
  sources: ChatSource[];
}

export const chatApi = {
  /**
   * List chat sessions
   */
  async listSessions(dataroomId?: string): Promise<ApiResponse<ChatSession[]>> {
    const params = dataroomId ? { dataroomId } : undefined;
    return apiClient.get<ChatSession[]>('/chat', params);
  },

  /**
   * Create a new chat session
   */
  async createSession(data: CreateSessionRequest): Promise<ApiResponse<ChatSession>> {
    return apiClient.post<ChatSession>('/chat', data);
  },

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<ApiResponse<ChatSession>> {
    return apiClient.get<ChatSession>(`/chat/${sessionId}`);
  },

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/chat/${sessionId}`);
  },

  /**
   * Get messages for a session
   */
  async getMessages(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    return apiClient.get<ChatMessage[]>(`/chat/${sessionId}/messages`);
  },

  /**
   * Ask a question
   */
  async askQuestion(data: AskQuestionRequest): Promise<ApiResponse<AskQuestionResponse>> {
    return apiClient.post<AskQuestionResponse>('/chat/question', data);
  },

  /**
   * Delete all chat sessions for user
   */
  async deleteAllSessions(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/chat');
  },
};

export default chatApi;
