"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdOutlineDelete } from "react-icons/md";
import { LuPencil } from "react-icons/lu";
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
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (editValue.trim() !== "" && editValue.trim() !== chats.find(c => c.id === chatId)?.title) {
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
    if (editingChatId !== chatId && menuOpenId !== chatId) {
      selectChat(chatId);
      onChatSelect?.(chatId);
    }
  };

  const toggleMenu = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === chatId ? null : chatId);
  };

  // Don't render if sidebar is collapsed
  if (state === "collapsed") return null;

  return (
    <div className="flex flex-col gap-1 px-4 py-2">
      <div className="px-2 mb-1">
        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-400 tracking-wide">
          Chat History
        </h3>
      </div>
      <div className="flex flex-col gap-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className={`group relative flex items-center justify-between dark:text-white text-black rounded-md px-3 py-2 cursor-pointer transition-colors ${
              activeChatId === chat.id ? "bg-[#F4F4F5] dark:bg-[#27272A] dark:text-white" : "hover:bg-gray-100 dark:hover:bg-[#27272A] dark:text-white"
            }`}
          >
            {editingChatId === chat.id ? (
              <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                <input
                  ref={editInputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(chat.id, e)}
                  className="flex-1 min-w-0 text-sm  bg-white text-black dark:bg-[#27272A] dark:text-white px-2 py-1 border border-gray-10 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  onClick={(e) => handleSaveEdit(chat.id, e)}
                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                  aria-label="Save"
                >
                  <Check className="h-3 w-3 text-green-600" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit(e);
                  }}
                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                  aria-label="Cancel"
                >
                  <X className="h-3 w-3 text-red-600" />
                </button>
              </div>
            ) : (
              <>
                <span className="text-xs font-medium text-gray-900 dark:text-[#F4F4F5] truncate flex-1">
                  {chat.title}
                </span>
                <div className="relative">
                  <button
                    onClick={(e) => toggleMenu(chat.id, e)}
                    className="hover:bg-gray-200 dark:hover:bg-[#27272A] dark:hover:text-white cursor-pointer rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    aria-label="Chat actions"
                  >
                    <HiOutlineDotsHorizontal className="h-5 w-5 text-gray-500 dark:text-white" />
                  </button>
                  {menuOpenId === chat.id && (
                    <div 
                      ref={menuRef}
                      className="absolute left-0 top-6 mt-1 w-28 rounded-md bg-white shadow-sm z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className=" dark:bg-[#09090B] dark:text-white rounded-md dark:border-[#27272A]">
                        <button
                          onClick={(e) => {
                            setMenuOpenId(null);
                            handleEdit(chat.id, chat.title, e);
                          }}
                          className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#27272A] rounded-md"
                        >
                          <span>Rename</span>
                          <LuPencil className="h-4 w-4 text-black ml-2" />
                        </button>
                        <button
                          onClick={(e) => {
                            setMenuOpenId(null);
                            handleDelete(chat.id, e);
                          }}
                          className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#27272A] rounded-md"
                        >
                          <span>Delete</span>
                          <MdOutlineDelete className="h-4 w-4 text-red-500 ml-2" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
