"use client";

import { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { ChatInterface } from "../components/ChatInterface";
import { DashboardLayout } from "../components/DashboardLayout";
import { useChatContext } from "../context/ChatContext";

export default function ChatPage() {
  const { activeChat, activeChatId, createNewChat, chats } = useChatContext();
  const [chatTitle, setChatTitle] = useState<string>("Tequity AI");

  // Update title when active chat changes
  useEffect(() => {
    if (activeChat && activeChat.title !== "New Chat") {
      // Only change title if it's not "New Chat"
      setChatTitle(activeChat.title);
    } else {
      // Keep "Tequity AI" as default
      setChatTitle("Tequity AI");
    }
  }, [activeChat]);

  const handleNewChat = () => {
    console.log('New chat requested');
    createNewChat();
  };

  const handleChatSelect = (chatId: string) => {
    // Title will update automatically via useEffect
  };

  return (
    <DashboardLayout
      title={chatTitle}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 bg-[#F4F4F5] hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors px-3 py-3 rounded-md"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      }
      activeChatId={activeChatId || undefined}
      onChatSelect={handleChatSelect}
    >
      <main className="flex-1 overflow-hidden">
        <ChatInterface
          key={activeChatId || 'new'} // This forces a remount when chat changes
          selectedFile={null}
          onNewChat={handleNewChat}
        />
      </main>
    </DashboardLayout>
  );
}
