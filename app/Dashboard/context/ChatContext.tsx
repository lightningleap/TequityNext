"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  files?: File[];
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  activeChatId: string | null;
  createNewChat: () => string;
  addMessageToChat: (chatId: string, message: ChatMessage) => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
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

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(() => {
    // Load chats from localStorage on mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tequity_chats");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Convert date strings back to Date objects
          return parsed.map((chat: any) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
            messages: chat.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));
        } catch (error) {
          console.error("Error loading chats from localStorage:", error);
        }
      }
    }
    return [];
  });
  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    // Load active chat ID from localStorage on mount
    if (typeof window !== "undefined") {
      return localStorage.getItem("tequity_activeChatId");
    }
    return null;
  });

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tequity_chats", JSON.stringify(chats));
    }
  }, [chats]);

  // Save active chat ID to localStorage whenever it changes
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

  const createNewChat = (): string => {
    const newChatId = `chat-${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      title: "New Chat" ,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChatId);
    return newChatId;
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

  const deleteChat = (chatId: string) => {
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
        createNewChat,
        addMessageToChat,
        selectChat,
        deleteChat,
        updateChatTitle,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
