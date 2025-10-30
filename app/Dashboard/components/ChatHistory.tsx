"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Trash2, Edit2, Check, X } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useChatContext } from "../context/ChatContext";

interface ChatHistoryProps {
  onChatSelect?: (chatId: string) => void;
  activeChatId?: string;
}

export function ChatHistory({ onChatSelect, activeChatId }: ChatHistoryProps) {
  const { state } = useSidebar();
  const { chats, deleteChat, selectChat, updateChatTitle } = useChatContext();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingChatId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  const handleDelete = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Deleting chat:", chatId);
    deleteChat(chatId);
  };

  const handleEdit = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditValue(currentTitle);
  };

  const handleSaveEdit = (chatId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (editValue.trim() !== "") {
      updateChatTitle(chatId, editValue.trim());
    }
    setEditingChatId(null);
    setEditValue("");
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
    setEditValue("");
  };

  const handleKeyDown = (chatId: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit(chatId);
    } else if (e.key === "Escape") {
      setEditingChatId(null);
      setEditValue("");
    }
  };

  const handleChatClick = (chatId: string) => {
    if (editingChatId !== chatId) {
      selectChat(chatId);
      onChatSelect?.(chatId);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  // Don't render if sidebar is collapsed
  if (state === "collapsed") return null;

  // Get preview from last user message
  const getPreview = (chat: any) => {
    const lastUserMessage = [...chat.messages].reverse().find((m: any) => m.isUser);
    if (!lastUserMessage) return "No messages yet";
    const preview = lastUserMessage.text.trim();
    return preview.length > 40 ? preview.substring(0, 37) + "..." : preview;
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-medium text-gray-500 tracking-wide">
          Chat 
        </h3>
      </div>
      {chats.length === 0 ? (
        <div className="text-center py-4 px-2">
          {/* <p className="text-xs text-gray-400">No chats yet</p> */}
          <p className="text-xs text-gray-400">Start a conversation!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className={`group relative flex flex-col gap-1 rounded-md px-3 py-2 cursor-pointer transition-colors ${
                activeChatId === chat.id
                  ? "bg-[#F4F4F5]"
                  : "hover:bg-gray-100"
              }`}
            >
              {editingChatId === chat.id ? (
                /* Edit Mode - Full width */
                <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                  <MessageSquare className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(chat.id, e)}
                    className="flex-1 min-w-0 text-sm text-gray-900 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-200"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => handleSaveEdit(chat.id, e)}
                    className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                    aria-label="Save"
                  >
                    <Check className="h-3 w-3 text-green-600" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                    aria-label="Cancel"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </button>
                </div>
              ) : (
                /* Normal Mode */
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageSquare className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-900 truncate">
                      {chat.title}
                    </span>
                  </div>

                  {/* Edit and Delete buttons - only show when not editing */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={(e) => handleEdit(chat.id, chat.title, e)}
                      className="p-1 hover:bg-gray-200 rounded"
                      aria-label="Edit chat title"
                    >
                      <Edit2 className="h-3 w-3 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(chat.id, e)}
                      className="p-1 hover:bg-gray-200 rounded"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}

              {/* Preview - hide when editing */}
              {editingChatId !== chat.id && (
                <div className="flex items-center justify-between gap-2 pl-6">
                  <span className="text-xs text-gray-400 truncate">
                    {getPreview(chat)}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(chat.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
