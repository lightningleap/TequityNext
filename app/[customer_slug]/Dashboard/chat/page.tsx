"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { ChatInterface } from "../components/ChatInterface";
import { DashboardLayout } from "../components/DashboardLayout";
import { useChatContext } from "../context/ChatContext";

export default function ChatPage() {
  const { activeChat, activeChatId, createNewChat } = useChatContext();
  const [chatTitle, setChatTitle] = useState<string>("New Chat");

  // Update title when active chat changes
  useEffect(() => {
    if (activeChat) {
      setChatTitle(activeChat.title);
    } else {
      setChatTitle("New Chat");
    }
  }, [activeChat]);

  const handleNewChat = () => {
    console.log('New chat requested');
    createNewChat();
  };

  const handleChatSelect = () => {
    // Title will update automatically via useEffect
  };

  return (
    <DashboardLayout
      title={chatTitle}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-200 dark:hover:bg-[#27272A] dark:hover:text-white text-gray-700 hover:text-gray-900 transition-colors px-3 py-3 rounded-md dark:border-gray-700 "
            title="New Chat  "
          >
            <MessageCircle className="h-4 w-4 dark:text-white" />
            <span className="text-sm font-medium dark:text-white md:block hidden cursor-pointer">New Chat </span>
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
