"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { ArrowUp, Plus, AtSign, File, Folder, Image as ImageIcon, Search, X } from "lucide-react";
import Image from "next/image";
import Logomark from "@/public/Logomark.svg";
import { useRouter } from "next/navigation";
import { UploadDialog } from "../components/UploadDialog";
import { useFiles } from "../context/FilesContext";
import { LuClock } from "react-icons/lu";
import { useChatContext } from "../context/ChatContext";

// Category chips data
const categories = [
  { id: "finance", label: "Finance" },
  { id: "legal", label: "Legal" },
  { id: "team-hr", label: "Team & HR" },
  { id: "technical", label: "Technical" },
  { id: "identify-risks", label: "Identify Risks" },
  { id: "compare-docs", label: "Compare Docs" },
];

export default function HomePage() {
  const { files, folders, setFiles, setFolders } = useFiles();
  const { createNewChat, addMessageToChat, activeChatId, selectChat, activeChat } = useChatContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextSearchValue, setContextSearchValue] = useState("");
  const [selectedContextItems, setSelectedContextItems] = useState<
    Array<{
      id: string;
      name: string;
      type: "file" | "chat";
      fileType?: string;
      size?: number;
    }>
  >([]);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [recentlyVisited, setRecentlyVisited] = useState<
    Array<{
      hasText: any;
      id: string;
      name: string;
      type: string;
      isFolder: boolean;
      visitedAt: Date;
    }>
  >([]);

  // Load recently visited from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentlyVisited");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRecentlyVisited(
            parsed.map((item: any) => ({
              ...item,
              visitedAt: new Date(item.visitedAt),
            }))
          );
        } catch (error) {
          console.error("Error parsing recently visited:", error);
        }
      }
    }
  }, []);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchQuery(e.target.value);
    adjustTextareaHeight();
  };

  // Reset textarea height when cleared
  useEffect(() => {
    if (!searchQuery && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [searchQuery]);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        uploadMenuRef.current &&
        !uploadMenuRef.current.contains(event.target as Node)
      ) {
        setShowUploadMenu(false);
      }
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle upload click
  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUploadMenu(!showUploadMenu);
  };

  // Handle file upload
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

  // Handle search submit - redirect to chat
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Create new chat with the search query
      const newChatId = createNewChat();
      if (newChatId) {
        addMessageToChat(newChatId, {
          text: searchQuery,
          isUser: true,
          timestamp: new Date(),
        });
        // Redirect to chat page
        router.push("/Dashboard/chat");
      }
    }
  };

  // Handle upload
  const handleUpload = (newFiles: any[], newFolders: any[]) => {
    setFiles([...files, ...newFiles]);
    setFolders([...folders, ...newFolders]);
  };

  // Handle chat selection from sidebar
  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
    // Redirect to chat page when a chat is selected
    router.push("/Dashboard/chat");
  };

  // Handle file selection for context
  const handleFileContextSelect = (file: any) => {
    if (
      !selectedContextItems.some(
        (item) => item.id === file.id && item.type === "file"
      )
    ) {
      setSelectedContextItems((prev) => [
        ...prev,
        {
          id: file.id || "",
          name: file.name,
          type: "file",
          fileType: file.type,
          size: file.size,
        },
      ]);
    }
    setShowContextMenu(false);
    setContextSearchValue("");
  };

  // Handle chat selection for context
  const handleChatContextSelect = (chatText: string, chatId: string) => {
    if (
      !selectedContextItems.some(
        (item) => item.id === chatId && item.type === "chat"
      )
    ) {
      setSelectedContextItems((prev) => [
        ...prev,
        { id: chatId, name: chatText, type: "chat" },
      ]);
    }
    setShowContextMenu(false);
    setContextSearchValue("");
  };

  // Remove context item
  const removeContextItem = (id: string, type: "file" | "chat") => {
    setSelectedContextItems((prev) =>
      prev.filter((item) => !(item.id === id && item.type === type))
    );
  };

  // Get file icon for context menu
  const getContextFileIcon = (type: string) => {
    let iconPath = "/Files/TXT-icon.svg";

    if (type?.includes("pdf")) {
      iconPath = "/Files/PDF-icon.svg";
    } else if (type?.includes("doc")) {
      iconPath = "/Files/Docs-icon.svg";
    } else if (type?.includes("xls") || type?.includes("sheet")) {
      iconPath = "/Files/XLS-icon.svg";
    } else if (type?.includes("ppt")) {
      iconPath = "/Files/PPT-icon.svg";
    } else if (type?.includes("image") || type?.includes("png") || type?.includes("jpg")) {
      iconPath = "/Files/JPG-icon.svg";
    }

    return (
      <Image
        src={iconPath}
        alt="file icon"
        width={32}
        height={32}
        className="shrink-0"
      />
    );
  };

  // Filter files based on search
  const filteredFiles = files.filter(
    (file) =>
      contextSearchValue === "" ||
      file.name.toLowerCase().includes(contextSearchValue.toLowerCase())
  );

  // Get messages from active chat
  const messages = activeChat?.messages || [];

  // Get file icon based on type
  const getFileIcon = (type: string, hasText?: boolean) => {
    const lowerType = type?.toLowerCase();

    if (lowerType === "pdf") {
      return hasText ? "/txtPDF.svg" : "/RecentFiles/rPDF.svg";
    } else if (lowerType === "txt") {
      return "/RecentFiles/rTXT.svg";
    } else if (lowerType === "doc" || lowerType === "docx") {
      return "/RecentFiles/rDOC.svg";
    } else if (lowerType === "xls" || lowerType === "xlsx") {
      return "/RecentFiles/rXLS.svg";
    } else if (lowerType === "ppt" || lowerType === "pptx") {
      return "/RecentFiles/rPPT.svg";
    } else if (lowerType === "jpg" || lowerType === "jpeg" || lowerType === "png") {
      return "/RecentFiles/rIMG.svg";
    }
    return "/RecentFiles/rSVG.svg";
  };

  return (
    <DashboardLayout
      title=""
      headerActions={<UploadDialog onUpload={handleUpload} />}
      activeChatId={activeChatId || undefined}
      onChatSelect={handleChatSelect}
    >
      <div className="flex flex-col items-center justify-start min-h-full p-8 pt-16">
        {/* Logo and Header Section */}
        <div className="flex flex-col items-center text-center mb-8 max-w-2xl">
          {/* Tequity Logo */}
          <div className="mb-6">
            <Image src={Logomark} alt="Tequity" width={52} height={52} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Work smarter with Tequity
          </h1>

          {/* Subtitle */}
          <p className="text-base text-gray-600 dark:text-gray-400">
            Your AI assistant for documents and insights.
          </p>
        </div>

        {/* Chat-style Search Input */}
        <div className="w-full max-w-[792px] mb-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="rounded-lg border border-gray-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] p-3">
              <div className="flex flex-col">
                {/* Selected Context Items */}
                {selectedContextItems.length > 0 && (
                  <div className="pb-2 mb-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedContextItems.map((item) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className={`flex items-center gap-2 bg-[#E4E4E7] dark:bg-[#27272A] px-2 py-1.5 text-xs ${
                            item.type === "file"
                              ? "rounded-md h-[58px]"
                              : "rounded-full h-[24px]"
                          }`}
                        >
                          {item.type === "file" ? (
                            <>
                              <div className="flex-shrink-0">
                                {getContextFileIcon(item.fileType || "")}
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-medium text-gray-900 dark:text-white truncate">
                                  {item.name}
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="font-medium text-gray-900 dark:text-white truncate">
                              {item.name.length > 20
                                ? `${item.name.substring(0, 20)}...`
                                : item.name}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeContextItem(item.id, item.type)}
                            className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                            aria-label="Remove item"
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
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Need quick insights..."
                    className="flex-1 outline-none text-sm resize-none overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent bg-transparent dark:text-white"
                    rows={1}
                    style={{ minHeight: "24px", maxHeight: "120px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSearchSubmit(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D91D69] text-white hover:bg-[#D91D69] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-2 relative">
                  {/* Plus Button with Upload Menu */}
                  <div ref={uploadMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="flex items-center bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#3F3F46] justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer dark:hover:bg-[#27272A]"
                      style={{
                        width: "30px",
                        height: "30px",
                        paddingTop: "6px",
                        paddingRight: "6px",
                        paddingBottom: "6px",
                        paddingLeft: "6px",
                        gap: "8px",
                        borderWidth: "0.83px",
                        borderRadius: "6.67px",
                        opacity: 1,
                      }}
                      aria-label="Upload files"
                      title="Upload files"
                    >
                      <Plus
                        className={`h-4 w-4 dark:text-white transition-transform duration-200 ${
                          showUploadMenu ? "rotate-45" : ""
                        }`}
                      />
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

                  {/* Add Context Button */}
                  <div ref={contextMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (showContextMenu) {
                          setContextSearchValue("");
                        }
                        setShowContextMenu(!showContextMenu);
                      }}
                      className="flex bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#3F3F46] items-center gap-2 px-4 h-8 rounded-md text-gray-600 hover:bg-gray-100 transition-colors text-sm cursor-pointer dark:text-white dark:hover:bg-[#27272A]"
                      style={{
                        width: "137.33px",
                        height: "30px",
                        paddingTop: "0px",
                        paddingRight: "16px",
                        paddingBottom: "0px",
                        paddingLeft: "16px",
                        gap: "8px",
                        borderWidth: "0.83px",
                        borderRadius: "6.67px",
                        opacity: 1,
                      }}
                      aria-label="Add context"
                    >
                      <AtSign className="h-3.5 w-3.5" />
                      <span>Add context</span>
                    </button>

                    {/* Context Dropdown Menu */}
                    {showContextMenu && (
                      <div className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-[#09090B] border border-gray-200 dark:border-[#27272A] rounded-lg shadow-lg z-50">
                        <div>
                          {/* Search Bar */}
                          <div className="flex items-center gap-2 px-2 py-2 dark:bg-[#09090B] rounded-t-md">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              value={contextSearchValue}
                              onChange={(e) =>
                                setContextSearchValue(e.target.value)
                              }
                              placeholder="Search..."
                              className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-400"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          {/* Files Section */}
                          <div className="border-t border-gray-200 dark:border-[#27272A] pt-2">
                            <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Files
                            </div>
                            <div className="max-h-40 overflow-y-auto scrollbar-hide">
                              {filteredFiles.length > 0 ? (
                                filteredFiles.slice(0, 5).map((file) => (
                                  <button
                                    key={file.id}
                                    type="button"
                                    onClick={() => handleFileContextSelect(file)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                                  >
                                    {getContextFileIcon(file.type)}
                                    <div className="flex-1 text-left min-w-0">
                                      <div className="truncate font-medium">
                                        {file.name}
                                      </div>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                  {contextSearchValue
                                    ? "No files found"
                                    : "No files available"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Chats Section */}
                          <div className="border-t border-gray-200 dark:border-[#27272A] pt-2 mt-2">
                            <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Chats
                            </div>
                            <div className="max-h-40 overflow-y-auto scrollbar-hide">
                              {messages.length > 0 ? (
                                messages
                                  .filter((msg) => msg.isUser)
                                  .filter(
                                    (msg) =>
                                      contextSearchValue === "" ||
                                      msg.text
                                        .toLowerCase()
                                        .includes(
                                          contextSearchValue.toLowerCase()
                                        )
                                  )
                                  .slice(0, 3)
                                  .map((msg, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() =>
                                        handleChatContextSelect(
                                          msg.text,
                                          `chat-${idx}-${msg.timestamp.getTime()}`
                                        )
                                      }
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                                      title={msg.text}
                                    >
                                      <div className="truncate">
                                        {msg.text.length > 35
                                          ? `${msg.text.substring(0, 35)}...`
                                          : msg.text}
                                      </div>
                                    </button>
                                  ))
                              ) : (
                                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                  No previous chats
                                </div>
                              )}
                            </div>
                          </div>
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
                className="hidden"
                accept="*/*"
                onChange={(e) => {
                  if (e.target.files) {
                    console.log("Files selected:", e.target.files);
                    // Handle file selection if needed
                  }
                }}
              />
              <input
                ref={folderInputRef}
                type="file"
                multiple
                className="hidden"
                // @ts-ignore
                webkitdirectory="true"
                onChange={(e) => {
                  if (e.target.files) {
                    console.log("Folder selected:", e.target.files);
                    // Handle folder selection if needed
                  }
                }}
              />
              <input
                ref={imageInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    console.log("Images selected:", e.target.files);
                    // Handle image selection if needed
                  }
                }}
              />
            </div>
          </form>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-2xl">
          {categories.map((category) => (
            <button
              key={category.id}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Recently Visited Section */}
        {recentlyVisited.length > 0 && (
          <div className="w-full max-w-[792px]">
            <h2 className="mb-4 sm:mb-6 flex gap-2 text-sm font-medium text-muted-foreground">
              <LuClock className="size-4 text-muted-foreground" />
              Recently visited
            </h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-x-visible">
              {recentlyVisited.slice(0, 4).map((item, index) => {
                const imageSrc = item.isFolder
                  ? "/BigFolder.svg"
                  : getFileIcon(item.type, item.hasText);

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="min-w-[160px] sm:min-w-0 flex-shrink-0 cursor-pointer group mb-5"
                    onClick={() => {
                      if (item.isFolder) {
                        router.push(`/Dashboard/Library?folder=${item.id}`);
                      } else {
                        // Open file viewer
                        const event = new CustomEvent("openPDFViewer", {
                          detail: {
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            url: `/files/${item.id}`,
                          },
                        });
                        window.dispatchEvent(event);
                      }
                    }}
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 border border-gray-200 dark:border-gray-700 group-hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        width={100}
                        height={167}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
