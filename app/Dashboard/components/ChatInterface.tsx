/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { X, FileText, Plus, AtSign, ArrowUp, File, Folder, Image as ImageIcon,  Copy, ThumbsUp, ThumbsDown, Search } from "lucide-react";
import { useChatContext } from "../context/ChatContext";
import Image from "next/image";
import Logomark from "@/public/Logomark.svg";

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
}: ChatInterfaceProps) {
  const { activeChat, activeChatId, createNewChat, addMessageToChat, chats } = useChatContext();
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [messageReactions, setMessageReactions] = useState<Record<number, 'like' | 'dislike' | null>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [contextSearchValue, setContextSearchValue] = useState("");

  // Auto-resize textarea function
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Handle input change with auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustTextareaHeight();
  };

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (!inputValue && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [inputValue]);
  const [selectedContextItems, setSelectedContextItems] = useState<Array<{id: string, name: string, type: 'file' | 'chat', fileType?: string, size?: number}>>([]);
  const hasInitialized = useRef(false);

  // TODO: Replace with actual file data from your backend/context
  // You can fetch this from an API or file management context
  const [userFiles] = useState<FileItem[]>([
    { id: "1", name: "Project Proposal.pdf", type: "application/pdf", size: 2457600 },
    { id: "2", name: "Financial Report Q1.xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 1048576 },
    { id: "3", name: "Meeting Notes.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 524288 },
    { id: "4", name: "Design Mockups.png", type: "image/png", size: 3145728 },
    { id: "5", name: "Contract Agreement.pdf", type: "application/pdf", size: 1572864 },
  ]);

  // Create a new chat only if there are no chats at all (initial app load)
  useEffect(() => {
    if (!hasInitialized.current && !activeChatId && chats.length === 0) {
      hasInitialized.current = true;
      createNewChat();
    }
  }, [activeChatId, chats.length, createNewChat]);

  const messages = useMemo(() => activeChat?.messages || [], [activeChat?.messages]);

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

    if (inputValue.trim() || attachedFiles.length > 0 || selectedContextItems.length > 0) {
      // Build message text with context items
      let messageText = inputValue || "";
      if (selectedContextItems.length > 0) {
        const contextText = selectedContextItems.map(item =>
          `@${item.name}`
        ).join(' ');
        messageText = messageText ? `${contextText} ${messageText}` : contextText;
      }

      // Add user message with files
      const userMessage = {
        text: messageText || "Uploaded files",
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
      setSelectedContextItems([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Toggle the upload menu
    setShowUploadMenu(!showUploadMenu);
  };
  
  // Handle click outside to close the menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
        setContextSearchValue("");
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

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLike = (index: number) => {
    setMessageReactions(prev => ({
      ...prev,
      [index]: prev[index] === 'like' ? null : 'like'
    }));
  };

  const handleDislike = (index: number) => {
    setMessageReactions(prev => ({
      ...prev,
      [index]: prev[index] === 'dislike' ? null : 'dislike'
    }));
  };

  const handleFileSelect = (file: FileItem) => {
    // Check if file is already selected
    if (!selectedContextItems.some(item => item.id === file.id && item.type === 'file')) {
      setSelectedContextItems(prev => [...prev, {
        id: file.id,
        name: file.name,
        type: 'file',
        fileType: file.type,
        size: file.size
      }]);
    }
    setShowContextMenu(false);
    setContextSearchValue("");
  };

  const handleChatSelect = (chatText: string, chatId: string) => {
    // Check if chat is already selected
    if (!selectedContextItems.some(item => item.id === chatId && item.type === 'chat')) {
      setSelectedContextItems(prev => [...prev, { id: chatId, name: chatText, type: 'chat' }]);
    }
    setShowContextMenu(false);
    setContextSearchValue("");
  };

  const removeContextItem = (id: string, type: 'file' | 'chat') => {
    setSelectedContextItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
  };

  const getFileIcon = (type: string) => {
    let iconPath = '/Files/TXT-icon.svg'; // default icon

    if (type.includes('image') || type.includes('jpeg') || type.includes('jpg') || type.includes('png') || type.includes('gif')) {
      iconPath = '/Files/JPG-icon.svg';

    } else if (type.includes('svg')) {
      iconPath = '/Files/SVG-icon.svg';
    } else if (type.includes('pdf')) {
      iconPath = '/Files/PDF-icon.svg';
    } else if (type.includes('spreadsheet') || type.includes('excel') || type.includes('sheet')) {
      iconPath = '/Files/XLS-icon.svg';
    } else if (type.includes('word') || type.includes('document') || type.includes('msword')) {
      iconPath = '/Files/Docs-icon.svg';
    } else if (type.includes('zip') || type.includes('compressed') || type.includes('archive')) {
      iconPath = '/Files/ZIP-icon.svg';
    } else if (type.includes('audio') || type.includes('mp3') || type.includes('wav')) {
      iconPath = '/Files/MP3-icon.svg';
    } else if (type.includes('text') || type.includes('txt')) {
      iconPath = '/Files/TXT-icon.svg';
    }


    return <Image src={iconPath} alt="file icon" width={32} height={32} className="flex-shrink-0" />;
  };

  const filteredFiles = userFiles.filter(file =>
    contextSearchValue === "" ||
    file.name.toLowerCase().includes(contextSearchValue.toLowerCase())
  );

  return (
    <div className="h-full bg-white dark:bg-[#09090B] flex flex-col items-center">
      <div className="flex-1 max-w-[792px] w-full p-4 overflow-y-auto scrollbar-hide bg-white dark:bg-[#09090B]">
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
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              <div className="flex items-center justify-center mx-auto mb-3">
                <Image
                  src={Logomark}
                  alt="Tequity AI"
                  width={48}
                  height={48}
                  className="flex-shrink-0"
                />
              </div>
               <h3 
                className="text-gray-900 dark:text-white"
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 500,
                  fontStyle: 'medium',
                  fontSize: '28px',
                  lineHeight: '40px',
                  letterSpacing: '0px',
                  verticalAlign: 'middle'
                }}
              >
                Hello Marcus
              </h3>
              <p className="text-gray-500 text-sm leading-5 text-center dark:text-[#F4F4F5]" style={{ fontFamily: 'Inter', fontSize: '14px' }}>
                How can I help you today?
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
                {/* Message Content */}
                <div className="flex flex-col gap-1 max-w-[80%]">
                  {/* Message Bubble */}
                  <div
                    className={`rounded-lg px-2 py-2 ${
                      message.isUser
                        ? 'bg-[#F4F4F5] dark:bg-[#3F3F46] text-black dark:text-white'
                        : 'text-black dark:text-white'
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

                  {/* Action Buttons - Only for AI messages */}
                  {!message.isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(message.text, index)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors ${
                          copiedIndex === index
                            ? 'text-black dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                        title="Copy"
                      >
                        <Copy className={`h-3 w-3 ${copiedIndex === index ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleLike(index)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors ${
                          messageReactions[index] === 'like'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                        title="Like"
                      >
                        <ThumbsUp className={`h-3 w-3 ${messageReactions[index] === 'like' ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDislike(index)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors ${
                          messageReactions[index] === 'dislike'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                        title="Dislike"
                      >
                        <ThumbsDown className={`h-3 w-3 ${messageReactions[index] === 'dislike' ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input at bottom */}
      <div className="p-4 bg-white dark:bg-[#09090B] w-full flex justify-center">
        <form onSubmit={handleSendMessage} className="max-w-[792px] w-full">
          <div className="rounded-lg border border-gray-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] p-3">
            <div className="flex flex-col">
              {/* Selected Context Items (Files & Chats) - At Top Inside Input */}
              {selectedContextItems.length > 0 && (
                <div className="pb-2 mb-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedContextItems.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className={`flex items-center gap-2 bg-[#E4E4E7] dark:bg-[#27272A] px-2 py-1.5 text-xs ${
                          item.type === 'file' ? 'rounded-md h-[58px]' : 'rounded-full h-[24px]'
                        }`}
                      >
                        {item.type === 'file' ? (
                          // File display with icon, name and size
                          <>
                            <div className="flex-shrink-0">
                              {getFileIcon(item.fileType || '')}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="truncate max-w-[150px] text-gray-700 dark:text-white font-medium">
                                {item.name}
                              </span>
                              {item.size && (
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                  {formatFileSize(item.size)}
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          // Chat display - just name, no icon
                          <span className="truncate max-w-[200px] text-gray-700 dark:text-white">
                            {item.name}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeContextItem(item.id, item.type)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                          aria-label="Remove"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attached Files Preview - Inside Input */}
              {attachedFiles.length > 0 && (
                <div className="pb-2 mb-2 border-b border-gray-200 dark:border-[#27272A]">
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-[#E4E4E7] dark:bg-[#27272A] rounded-md px-2 py-1.5 text-xs"
                      >
                        <div className="flex-shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate max-w-[150px] text-gray-700 dark:text-white font-medium">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachedFile(index)}
                          className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                          aria-label="Remove file"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Need quick insights..."
                className="flex-1 outline-none text-sm resize-none overflow-hidden"
                rows={1}
                style={{ minHeight: '24px', maxHeight: '120px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() && attachedFiles.length === 0 && selectedContextItems.length === 0}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D91D69] text-white hover:bg-[#D91D69] dark:bg-[#D91D69] dark:text-black dark:border-[#3F3F46] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
                  className="flex items-center bg-[#FFFFFF] dark:bg-[#09090B] border-gray-200 dark:border-[#3F3F46] border justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Upload files"
                  title="Upload files"
                >
                  <Plus className={`h-4 w-4 dark:text-white transition-transform duration-200 ${showUploadMenu ? 'rotate-45' : ''}`} />
                </button>

                {/* Upload Dropdown Menu */}
                {showUploadMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#09090B] dark:border-[#27272A] border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => handleFileUpload("files")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#27272A] dark:text-white transition-colors"
                      >
                        <File className="h-4 w-4 text-blue-600" />
                        <span>Upload Files</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFileUpload("folder")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#27272A] dark:text-white transition-colors"
                      >
                        <Folder className="h-4 w-4 text-orange-600" />
                        <span>Upload Folder</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFileUpload("image")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-[#27272A] dark:text-white transition-colors"
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
                  onClick={() => {
                    if (showContextMenu) {
                      setContextSearchValue("");
                    }
                    setShowContextMenu(!showContextMenu);
                  }}
                  className="flex bg-[#FFFFFF] dark:text-white dark:bg-[#09090B] border-gray-200 dark:border-[#3F3F46] border items-center gap-1 px-2 h-8 rounded-md text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  aria-label="Add context"
                >
                  <AtSign className="h-3.5 w-3.5" />
                  <span>Add context</span>
                </button>

                {/* Context Dropdown Menu */}
                {showContextMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#27272A] rounded-lg shadow-lg z-50">
                    <div className="">
                      {/* Search Bar */}
                      <div className="">
                        <div className="flex items-center gap-2 px-2 py-2 dark:bg-[#18181B] rounded-t-md">
                          <Search className="h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={contextSearchValue}
                            onChange={(e) => setContextSearchValue(e.target.value)}
                            placeholder="Search..."
                            className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-400"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* Show Files Section */}
                      <div className="border-t border-gray-200 dark:border-[#27272A] pt-2">
                        <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                          Files
                        </div>
                        <div className="max-h-25 overflow-y-auto scrollbar-hide">
                          {filteredFiles.length > 0 ? (
                            filteredFiles.map((file) => (
                              <button
                                key={file.id}
                                type="button"
                                onClick={() => handleFileSelect(file)}
                                className="w-full flex items-center gap-2 px-4 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                              >
                                {getFileIcon(file.type)}
                                <div className="flex-1 text-left min-w-0">
                                  <div className="truncate font-medium">{file.name}</div>
                                  {/* <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatFileSize(file.size)}
                                  </div> */}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {contextSearchValue ? "No files found" : "No files available"}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Previous Chats Section */}
                      <div className="border-t border-gray-200 dark:border-[#27272A] pt-2 mt-2">
                        <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                          Chats
                        </div>
                        <div className="max-h-40 overflow-y-auto scrollbar-hide">
                        {messages.length > 0 ? (
                          messages
                            .filter(msg => msg.isUser)
                            .filter(msg =>
                              contextSearchValue === "" ||
                              msg.text.toLowerCase().includes(contextSearchValue.toLowerCase())
                            )
                            .slice(0, 3)
                            .map((msg, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleChatSelect(msg.text, `chat-${idx}-${msg.timestamp.getTime()}`)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                                title={msg.text}
                              >
                                <div className="truncate">
                                  {msg.text.length > 35 ? `${msg.text.substring(0, 35)}...` : msg.text}
                                </div>
                              </button>
                            ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No previous chats</div>
                        )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
