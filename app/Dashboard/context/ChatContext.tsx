"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { chatApi, type ChatSession, type ChatMessage as ApiChatMessage, type ChatSource } from "@/lib/api";

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  files?: File[];
  sources?: ChatSource[];
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  dataroomId?: string;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  activeChatId: string | null;
  currentDataroomId: string | null;
  isLoading: boolean;
  isAsking: boolean;
  error: string | null;
  setCurrentDataroomId: (id: string | null) => void;
  createNewChat: (dataroomId?: string) => Promise<string>;
  addMessageToChat: (chatId: string, message: ChatMessage) => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => void;
  askQuestion: (question: string, dataroomId: string) => Promise<string | null>;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}

// Optional version that doesn't throw error
export function useChatContextOptional() {
  return useContext(ChatContext);
}

// Convert API session to local chat format
function mapApiSessionToChat(session: ChatSession): Chat {
  return {
    id: session.id,
    title: session.title || 'New Chat',
    messages: [],
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt),
    dataroomId: session.dataroomId,
  };
}

// Convert API message to local message format
function mapApiMessageToLocal(msg: ApiChatMessage): ChatMessage {
  return {
    text: msg.content,
    isUser: msg.role === 'user',
    timestamp: new Date(msg.createdAt),
    sources: msg.sources,
  };
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentDataroomId, setCurrentDataroomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chat sessions from API
  const refreshChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await chatApi.listSessions(currentDataroomId || undefined);
      if (response.success && response.data) {
        setChats(response.data.map(mapApiSessionToChat));
      } else {
        // If API fails, load from localStorage as fallback
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("tequity_chats");
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setChats(parsed.map((chat: Chat & { createdAt: string; updatedAt: string }) => ({
                ...chat,
                createdAt: new Date(chat.createdAt),
                updatedAt: new Date(chat.updatedAt),
              })));
            } catch (e) {
              console.error("Error loading chats from localStorage:", e);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chats');
    } finally {
      setIsLoading(false);
    }
  }, [currentDataroomId]);

  // Load chats on mount and when dataroom changes
  useEffect(() => {
    refreshChats();
  }, [currentDataroomId]);

  // Save to localStorage as backup
  useEffect(() => {
    if (typeof window !== "undefined" && chats.length > 0) {
      localStorage.setItem("tequity_chats", JSON.stringify(chats));
    }
  }, [chats]);

  // Save active chat ID to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (activeChatId) {
        localStorage.setItem("tequity_activeChatId", activeChatId);
      } else {
        localStorage.removeItem("tequity_activeChatId");
      }
    }
  }, [activeChatId]);

  const generateChatTitle = (firstMessage: string): string => {
    // Generate title from first message (first 50 chars)
    const cleaned = firstMessage.trim();
    if (cleaned.length <= 50) return cleaned;
    return cleaned.substring(0, 47) + "...";
  };

  const createNewChat = async (dataroomId?: string): Promise<string> => {
    const targetDataroomId = dataroomId || currentDataroomId;

    if (targetDataroomId) {
      // Try to create via API
      try {
        const response = await chatApi.createSession({ dataroomId: targetDataroomId });
        if (response.success && response.data) {
          const newChat = mapApiSessionToChat(response.data);
          setChats((prev) => [newChat, ...prev]);
          setActiveChatId(newChat.id);
          return newChat.id;
        }
      } catch (err) {
        console.error('Failed to create chat session:', err);
      }
    }

    // Fallback to local chat
    const newChatId = `chat-${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      dataroomId: targetDataroomId || undefined,
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChatId);
    return newChatId;
  };

  // Ask a question and get AI response
  const askQuestion = async (question: string, dataroomId: string): Promise<string | null> => {
    setIsAsking(true);
    setError(null);

    try {
      // Add user message immediately
      const userMessage: ChatMessage = {
        text: question,
        isUser: true,
        timestamp: new Date(),
      };

      let chatId = activeChatId;

      // Create new chat if needed
      if (!chatId) {
        chatId = await createNewChat(dataroomId);
      }

      addMessageToChat(chatId, userMessage);

      // Call API
      const response = await chatApi.askQuestion({
        sessionId: chatId.startsWith('chat-') ? undefined : chatId, // Don't send local IDs
        dataroomId,
        question,
      });

      if (response.success && response.data) {
        // Update session ID if we got a new one
        if (response.data.sessionId && response.data.sessionId !== chatId) {
          setChats((prev) => prev.map((c) =>
            c.id === chatId ? { ...c, id: response.data!.sessionId } : c
          ));
          setActiveChatId(response.data.sessionId);
          chatId = response.data.sessionId;
        }

        // Add AI response
        const aiMessage: ChatMessage = {
          text: response.data.answer,
          isUser: false,
          timestamp: new Date(),
          sources: response.data.sources,
        };
        addMessageToChat(chatId, aiMessage);

        return response.data.answer;
      } else {
        setError(response.error || 'Failed to get response');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ask question');
      return null;
    } finally {
      setIsAsking(false);
    }
  };

  const addMessageToChat = (chatId: string, message: ChatMessage) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = [...chat.messages, message];

          // Auto-generate title from first user message
          let newTitle = chat.title;
          if (chat.title === "New Chat" && message.isUser && updatedMessages.length > 0) {
            newTitle = generateChatTitle(message.text);
          }

          return {
            ...chat,
            messages: updatedMessages,
            title: newTitle,
            updatedAt: new Date(),
          };
        }
        return chat;
      })
    );
  };

  const selectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const deleteChat = async (chatId: string): Promise<void> => {
    // Try to delete via API if it's a real session ID
    if (!chatId.startsWith('chat-')) {
      try {
        await chatApi.deleteSession(chatId);
      } catch (err) {
        console.error('Failed to delete chat session:', err);
      }
    }

    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const updateChatTitle = (chatId: string, title: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title, updatedAt: new Date() } : chat
      )
    );
  };

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        activeChatId,
        currentDataroomId,
        isLoading,
        isAsking,
        error,
        setCurrentDataroomId,
        createNewChat,
        addMessageToChat,
        selectChat,
        deleteChat,
        updateChatTitle,
        askQuestion,
        refreshChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
