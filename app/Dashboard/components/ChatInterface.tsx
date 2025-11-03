/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { X, FileText, Plus, AtSign, ArrowUp, File, Folder, Image as ImageIcon, ChevronDown, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatContext } from "../context/ChatContext";
import Image from "next/image";

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt?: Date;
  url?: string;
}

interface ChatInterfaceProps {
  selectedFile: FileItem | null;
  onClose?: () => void;
  onNewChat?: () => void;
  key?: string | number; // Add key to the interface
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function ChatInterface({
  selectedFile,
  onClose,
  onNewChat,
}: ChatInterfaceProps) {
  const { activeChat, activeChatId, createNewChat, addMessageToChat } = useChatContext();
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState<"files" | "folder">("files");
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Create a new chat if none exists
  useEffect(() => {
    if (!activeChatId) {
      createNewChat();
    }
  }, []);

  const messages = activeChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId) return;

    if (inputValue.trim() || attachedFiles.length > 0) {
      // Add user message with files
      const userMessage = {
        text: inputValue || "Uploaded files",
        isUser: true,
        timestamp: new Date(),
        files: attachedFiles.length > 0 ? [...attachedFiles] : undefined
      };
      addMessageToChat(activeChatId, userMessage);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = generateAIResponse();
        const aiMessage = {
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        };
        addMessageToChat(activeChatId, aiMessage);
      }, 1000);

      setInputValue("");
      setAttachedFiles([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    console.log('+ button clicked');
    e.preventDefault();
    e.stopPropagation();

    // If modifier key is pressed, show the upload menu
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      console.log('Modifier key detected, showing upload menu');
      setShowUploadMenu(!showUploadMenu);
    } else {
      // Otherwise, create a new chat
      console.log('Creating new chat');
      setInputValue('');
      setAttachedFiles([]);
      setShowUploadMenu(false);

      // Call the parent's onNewChat handler if provided
      if (onNewChat) {
        console.log('Calling onNewChat handler');
        onNewChat();
      }
    }
  };
  
  // Handle click outside to close the menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileUpload = (type: "files" | "folder" | "image") => {
    setShowUploadMenu(false);
    if (type === "files") {
      fileInputRef.current?.click();
    } else if (type === "folder") {
      folderInputRef.current?.click();
    } else if (type === "image") {
      imageInputRef.current?.click();
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateAIResponse = (): string => {
    const responses = [
      "I understand your question. Let me help you with that.",
      "That's an interesting point. Here's what I think...",
      "I can help you find information about that in your documents.",
      "Let me analyze that for you. Based on what I see...",
      "Good question! Here's my analysis...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="h-full bg-white flex flex-col items-center">
      <div className="flex-1 max-w-[792px] w-full p-4 overflow-y-auto scrollbar-hide bg-white">
        {selectedFile ? (
          <div className="mb-4 p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-100 p-2 rounded">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{selectedFile.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedFile.type} • {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            {selectedFile.url ? (
              <div className="mt-4 border rounded-md overflow-hidden">
                <iframe
                  src={selectedFile.url}
                  className="w-full h-[500px]"
                  title={selectedFile.name}
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No preview available for this file type.
              </div>
            )}
          </div>
        ) : messages.length === 0 ? (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How can I help you today?
              </h3>
              <p className="text-gray-500 text-sm">
                Ask me anything about your files or documents.
              </p>
            </div>
          </div>
        ) : null}

        {/* Messages Display Area */}
        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {message.isUser ? (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#D91D69] flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-1 max-w-[80%]">
                  {/* Name Label */}
                  {/* <span className={`text-xs font-medium ${message.isUser ? 'text-right' : 'text-left'} text-gray-600`}>
                    {message.isUser ? 'You' : 'Tequity AI'}
                  </span> */}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {message.files && message.files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.files.map((file, fileIndex) => (
                          <div
                            key={fileIndex}
                            className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
                              message.isUser
                                ? 'bg-blue-500'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            <FileText className="h-3 w-3" />
                            <span className="truncate">{file.name}</span>
                            <span>({formatFileSize(file.size)})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input at bottom */}
      <div className="border-t border-gray-200 p-4 bg-white w-full flex justify-center">
        <form onSubmit={handleSendMessage} className="max-w-[792px] w-full">
          <div className="rounded-lg border border-gray-300 p-3">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1 text-xs"
                  >
                    <FileText className="h-3 w-3 text-gray-600" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachedFile(index)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Remove file"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Need quick insights..."
                className="flex-1 outline-none text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() && attachedFiles.length === 0}
                className="flex items-center justify-center w-8 h-8 rounded-md bg-black text-white hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2 relative">
              <div ref={uploadMenuRef} className="relative">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="flex items-center bg-[#FFFFFF] border-gray-200 border justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="New chat"
                  title="New chat"
                >
                  <Plus className="h-4 w-4" />
                </button>

                {/* Upload Dropdown Menu */}
                {showUploadMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => handleFileUpload("files")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <File className="h-4 w-4 text-blue-600" />
                        <span>Upload Files</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFileUpload("folder")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Folder className="h-4 w-4 text-orange-600" />
                        <span>Upload Folder</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFileUpload("image")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <ImageIcon className="h-4 w-4 text-purple-600" />
                        <span>Upload Images</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div ref={contextMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowContextMenu(!showContextMenu)}
                  className="flex bg-[#FFFFFF] border-gray-200 border items-center gap-1 px-2 h-8 rounded-md text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  aria-label="Add context"
                >
                  <AtSign className="h-3.5 w-3.5" />
                  <span>Add context</span>
                </button>

                {/* Context Dropdown Menu */}
                {showContextMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                        Previous Chats
                      </div>
                      {messages.length > 0 ? (
                        messages
                          .filter(msg => msg.isUser)
                          .slice(0, 3)
                          .map((msg, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setInputValue(prev => prev ? `${prev} ${msg.text}` : msg.text);
                                setShowContextMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors truncate"
                              title={msg.text}
                            >
                              {msg.text.length > 30 ? `${msg.text.substring(0, 30)}...` : msg.text}
                            </button>
                          ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No previous chats</div>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                        Upload Options
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleFileUpload("files");
                          setShowContextMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <File className="h-4 w-4 text-blue-600" />
                        <span>Upload Files</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleFileUpload("folder");
                          setShowContextMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Folder className="h-4 w-4 text-orange-600" />
                        <span>Upload Folder</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleFileUpload("image");
                          setShowContextMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <ImageIcon className="h-4 w-4 text-purple-600" />
                        <span>Upload Images</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx"
          />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            {...({ webkitdirectory: "", directory: "" } as any)}
          />
          <input
            ref={imageInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </form>
      </div>
    </div>
  );
}
