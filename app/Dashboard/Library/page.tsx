/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ChevronDown,
  ChevronsRight,
  Maximize2,
  Star,
  Download,
<<<<<<< HEAD
  ArrowLeft,
  ChevronRight,
=======
  Edit,
  ArrowLeft,
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FileItem } from "../components/filegrid";
import { SearchBar } from "../components/searchbar";
import {
  UploadDialog,
  FolderItem as UploadedFolder,
} from "../components/UploadDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LuClock } from "react-icons/lu";
import { IoGridOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
<<<<<<< HEAD
import { MoreHorizontal } from "lucide-react";
=======
import { ChevronUp, MoreHorizontal } from "lucide-react";
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
import { FiTrash } from "react-icons/fi";
import { ChatInterface } from "../components/ChatInterface";
import { useFiles } from "../context/FilesContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { DeleteModal } from "../components/DeleteModal";
import { useChatContext } from "../context/ChatContext";
// import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Logomark from "@/public/Logomark.svg";

// Dynamically import PDFViewer to prevent SSR issues with react-pdf
const PDFViewer = dynamic(
  () =>
    import("../components/PDFViewer").then((mod) => ({
      default: mod.PDFViewer,
    })),
  {
    ssr: false,
  }
);
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchDropdown } from "../components/SearchDropdown";

interface LibraryContentProps {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  folders: Array<{ id: string; name: string; fileCount: number }>;
  setFolders: React.Dispatch<
    React.SetStateAction<Array<{ id: string; name: string; fileCount: number }>>
  >;
}

function LibraryContent({ files, setFiles, folders }: LibraryContentProps) {
  const router = useRouter();
  const { createNewChat, activeChat, activeChatId, chats, selectChat } =
    useChatContext();
  // const { state: sidebarState } = useSidebar();
  const [folderView, setFolderView] = useState<"grid" | "list">("grid");
  const [fileView, setFileView] = useState<"grid" | "list">("grid");
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [filesExpanded, setFilesExpanded] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [dragPosition, setDragPosition] = useState(85); // Initial height in vh
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset drag position and fullscreen when AI chat is closed
  const closeAIChat = () => {
    setIsAIChatOpen(false);
    setDragPosition(85); // Reset to default position
    setIsFullscreen(false); // Reset fullscreen state
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  // const [isPDFMaximized, setIsPDFMaximized] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [activeFileType, setActiveFileType] = useState<string | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(
    new Set()
  );
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [starredFileIds, setStarredFileIds] = useState<Set<string>>(new Set());
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [isViewingFolder, setIsViewingFolder] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<{
    id: string;
    name: string;
    fileCount: number;
    files: FileItem[];
  } | null>(null);
<<<<<<< HEAD
  const [recentlyVisited, setRecentlyVisited] = useState<
    Array<{
      id: string;
      name: string;
      type: string;
      isFolder: boolean;
      visitedAt: Date;
    }>
  >(() => {
    // Load from localStorage on initial render
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentlyVisited");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.map((item: any) => ({
            ...item,
            visitedAt: new Date(item.visitedAt),
          }));
        } catch (error) {
          console.error(
            "Error parsing recently visited from localStorage:",
            error
          );
          return [];
        }
      }
    }
    return [];
  });
=======
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
  const [folderContentView, setFolderContentView] = useState<"grid" | "list">(
    "grid"
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [filesCurrentPage, setFilesCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Save recently visited to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (recentlyVisited.length > 0) {
        localStorage.setItem(
          "recentlyVisited",
          JSON.stringify(recentlyVisited)
        );
      } else {
        localStorage.removeItem("recentlyVisited");
      }
    }
  }, [recentlyVisited]);

  // Load starred files from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("starredFiles");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Extract IDs from the stored data
          const ids = parsed.map((item: { id: string }) => item.id);
          setStarredFileIds(new Set(ids));
        } catch (e) {
          console.error("Error parsing starred files:", e);
        }
      }
    }
  }, []);

  // Drag handlers for mobile AI chat
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const windowHeight = window.innerHeight;
    const newHeight = ((windowHeight - clientY) / windowHeight) * 100;

    // Check if dragged to top (less than 10vh from top)
    if (newHeight > 90) {
      setIsFullscreen(true);
      return;
    }

    // Check if dragged to bottom (less than 20vh from bottom) - close the chat
    if (newHeight < 20 && !isFullscreen) {
      closeAIChat();
      setIsDragging(false);
      return;
    }

    // Exit fullscreen if dragging down from fullscreen
    if (isFullscreen && newHeight < 85) {
      setIsFullscreen(false);
    }

    // Limit height between 30vh and 95vh when not in fullscreen
    if (!isFullscreen) {
      const clampedHeight = Math.max(30, Math.min(95, newHeight));
      setDragPosition(clampedHeight);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMove = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;

      const clientY =
        "touches" in e
          ? (e as TouchEvent).touches[0].clientY
          : (e as MouseEvent).clientY;
      const windowHeight = window.innerHeight;
      const newHeight = ((windowHeight - clientY) / windowHeight) * 100;

      // Check if dragged to top (less than 10vh from top)
      if (newHeight > 90) {
        setIsFullscreen(true);
        return;
      }

      // Check if dragged to bottom (less than 20vh from bottom) - close the chat
      if (newHeight < 20 && !isFullscreen) {
        closeAIChat();
        setIsDragging(false);
        return;
      }

      // Exit fullscreen if dragging down from fullscreen
      if (isFullscreen && newHeight < 85) {
        setIsFullscreen(false);
      }

      // Limit height between 30vh and 95vh when not in fullscreen
      if (!isFullscreen) {
        const clampedHeight = Math.max(30, Math.min(95, newHeight));
        setDragPosition(clampedHeight);
      }
    };

    const handleGlobalEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("touchmove", handleGlobalMove);
      document.addEventListener("mousemove", handleGlobalMove);
      document.addEventListener("touchend", handleGlobalEnd);
      document.addEventListener("mouseup", handleGlobalEnd);
    }

    return () => {
      document.removeEventListener("touchmove", handleGlobalMove);
      document.removeEventListener("mousemove", handleGlobalMove);
      document.removeEventListener("touchend", handleGlobalEnd);
      document.removeEventListener("mouseup", handleGlobalEnd);
    };
  }, [isDragging, isFullscreen]);

  // File type mapping for filtering
  const fileTypeMap: Record<string, string[]> = {
    Documents: ["PDF", "DOCX", "TXT", "PPTX"],
    Photos: ["JPG", "JPEG", "PNG", "GIF", "SVG"],
    Videos: ["MP4", "MOV", "AVI", "WMV"],
    "Compressed ZIPs": ["ZIP", "RAR", "7Z", "TAR", "GZ"],
    Audio: ["MP3", "WAV", "AAC", "OGG", "WMA"],
    Excel: ["XLSX", "XLS", "CSV"],
  };

  // Get paginated files
  const paginatedFiles = (fileList: FileItem[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return fileList.slice(startIndex, startIndex + itemsPerPage);
  };

  // Filter files based on active tab and search query
  const filteredFiles = files.filter((file) => {
    // Filter by file type
    const fileExt = file.name.split(".").pop()?.toUpperCase();
    const typeMatch = activeFileType
      ? fileTypeMap[activeFileType]?.includes(fileExt || "")
      : true;

    // Filter by search query
    const searchMatch = searchQuery
      ? file.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return typeMatch && searchMatch;
  });

  // Calculate total pages for files
  const totalFilesPages = Math.ceil(filteredFiles.length / itemsPerPage);

  // Filter folders based on search query
  const filteredFolders = folders.filter((folder) =>
    searchQuery
      ? folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // Checkbox handlers
  const toggleFolderSelection = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const toggleFileSelection = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  // Toggle star status for a file
  const toggleFileStar = (fileId: string, fileName: string) => {
    setStarredFileIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }

      // Save to localStorage with file details
      const starredFilesData = Array.from(newSet).map((id) => {
        const file = files.find((f) => f.id === id);
        return {
          id,
          name: file?.name || fileName,
          type: file?.type || "FILE",
        };
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("starredFiles", JSON.stringify(starredFilesData));
        // Dispatch custom event to notify sidebar
        window.dispatchEvent(new Event("starredFilesUpdated"));
      }

      return newSet;
    });
  };

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  // Format file size helper
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "-";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const handleFileSelect = (file: FileItem) => {
    console.log("File selected:", file);
    setSelectedFile(file);
    setIsPDFViewerOpen(true);

    // Add to recently visited
    setRecentlyVisited((prev) => {
      const newItem = {
        id: file.id || file.name || "unknown",
        name: file.name,
        type: (file.type || "pdf").toString(),
        isFolder: false,
        visitedAt: new Date(),
      };

      // Remove if already exists and add to beginning
      const filtered = prev.filter((item) => item.id !== newItem.id);
      return [newItem, ...filtered].slice(0, 8); // Keep only 8 most recent
    });
  };

  const handleFolderSelect = (folder: {
    id: string;
    name: string;
    fileCount: number;
  }) => {
    console.log("Folder selected:", folder);

    // Add to recently visited
    setRecentlyVisited((prev) => {
      const newItem = {
        id: folder.id,
        name: folder.name,
        type: "folder",
        isFolder: true,
        visitedAt: new Date(),
      };

      // Remove if already exists and add to beginning
      const filtered = prev.filter((item) => item.id !== folder.id);
      return [newItem, ...filtered].slice(0, 8); // Keep only 8 most recent
    });

    // Create sample files for the folder
    const sampleFiles: FileItem[] = [
      {
        id: `${folder.id}-1`,
        name: "Q4 Financial Summary.pdf",
        type: "PDF",
        size: 1024000,
      },
      {
        id: `${folder.id}-2`,
        name: "Revenue Analysis.xlsx",
        type: "XLSX",
        size: 512000,
      },
      {
        id: `${folder.id}-3`,
        name: "Marketing Strategy.pptx",
        type: "PPTX",
        size: 2048000,
      },
      {
        id: `${folder.id}-4`,
        name: "Customer Data.csv",
        type: "CSV",
        size: 256000,
      },
      {
        id: `${folder.id}-5`,
        name: "Project Timeline.docx",
        type: "DOCX",
        size: 768000,
      },
    ];

    // Set the folder view state
    setCurrentFolder({
      ...folder,
      files: sampleFiles,
    });
    setIsViewingFolder(true);
  };

  // Listen for custom event to open PDF viewer from sidebar
  useEffect(() => {
    const handleOpenPDFViewer = (event: CustomEvent) => {
      const fileData = event.detail;
      console.log("Opening PDF viewer from sidebar:", fileData);

      // Find the file in the files array
      const file = files.find((f) => f.id === fileData.id);
      if (file) {
        handleFileSelect(file);
      } else {
        // If file not found in current files array, create a file object from the event data
        const fileItem: FileItem = {
          id: fileData.id || fileData.name,
          name: fileData.name,
          type: fileData.type || "pdf",
          size: fileData.size || 0,
        };
        handleFileSelect(fileItem);
      }
    };

    window.addEventListener(
      "openPDFViewer",
      handleOpenPDFViewer as EventListener
    );
    return () => {
      window.removeEventListener(
        "openPDFViewer",
        handleOpenPDFViewer as EventListener
      );
    };
  }, [files, handleFileSelect]);

  // Listen for custom event to select file from SearchDialog
  useEffect(() => {
    const handleSelectFile = (event: CustomEvent) => {
      const fileData = event.detail;
      console.log("Selecting file from SearchDialog:", fileData);

      // Find the file in the files array
      const file = files.find(
        (f) => f.id === fileData.id || f.name === fileData.name
      );
      if (file) {
        handleFileSelect(file);
      } else {
        // If file not found, create a file object from the event data
        const fileItem: FileItem = {
          id: fileData.id || fileData.name,
          name: fileData.name,
          type: fileData.type || "pdf",
          size: fileData.size || 0,
        };
        handleFileSelect(fileItem);
      }
    };

    window.addEventListener("selectFile", handleSelectFile as EventListener);
    return () => {
      window.removeEventListener(
        "selectFile",
        handleSelectFile as EventListener
      );
    };
  }, [files, handleFileSelect]);

  // Listen for custom event to select folder from SearchDialog
  useEffect(() => {
    const handleSelectFolder = (event: CustomEvent) => {
      const folderData = event.detail;
      console.log("Selecting folder from SearchDialog:", folderData);

      // Find the folder in the folders array
      const folder = folders.find(
        (f) => f.id === folderData.id || f.name === folderData.name
      );
      if (folder) {
        handleFolderSelect(folder);
      } else {
        // If folder not found, create a folder object from the event data
        const folderItem = {
          id: folderData.id || folderData.name,
          name: folderData.name,
          fileCount: folderData.fileCount || 0,
        };
        handleFolderSelect(folderItem);
      }
    };

    window.addEventListener(
      "selectFolder",
      handleSelectFolder as EventListener
    );
    return () => {
      window.removeEventListener(
        "selectFolder",
        handleSelectFolder as EventListener
      );
    };
  }, [folders, handleFolderSelect]);

  // Calculate sidebar width for PDF maximized state
  // const sidebarWidth = sidebarState === "collapsed" ? "3rem" : "16rem";

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (
      isAIChatOpen &&
      typeof window !== "undefined" &&
      window.innerWidth < 640
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAIChatOpen]);

  const handleBackToLibrary = () => {
    setIsViewingFolder(false);
    setCurrentFolder(null);
    setCurrentPage(1); // Reset to first page when going back
  };

  return (
    <>
      <div className="flex-1 flex overflow-hidden relative">
        <main
<<<<<<< HEAD
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-3 sm:p-4 md:p-6 flex justify-center transition-all duration-300 scroll-smooth"
          style={{
            scrollbarGutter: "stable",
=======
          className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-3 sm:p-4 md:p-6 flex justify-center transition-all duration-300 scroll-smooth
            ${isAIChatOpen ? "sm:mr-[400px]" : ""}
            ${isPDFViewerOpen && !isPDFMaximized ? "sm:mr-[400px]" : ""}
          `}
          style={{
            scrollbarGutter: "stable",
            marginRight:
              isPDFViewerOpen && isPDFMaximized
                ? `calc(100% - ${sidebarWidth})`
                : undefined,
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
          }}
        >
          <div className="w-full max-w-[792px] px-2 sm:px-0">
            {/* Folder Contents View */}
            {isViewingFolder && currentFolder ? (
              <>
                {/* Back Button and Folder Header */}
                <div className="mb-6 sm:mb-8">
                  <button
                    onClick={handleBackToLibrary}
                    className="flex items-center cursor-pointer gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Go Back</span>
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/Folder.svg" alt="Folder" className="h-8 w-8" />
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {currentFolder.name}
                    </h1>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentFolder.files.length} items
                  </p>
                </div>

                {/* Folder Files Section */}
                <section
                  aria-labelledby="folder-files"
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-sm font-medium text-muted-foreground">
                      Files in this folder
                    </h2>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#27272A] p-1 rounded-md">
                      <button
                        onClick={() => setFolderContentView("grid")}
                        className={`p-1.5 rounded transition-colors ${
                          folderContentView === "grid"
                            ? "text-foreground bg-white shadow-sm dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                            : "text-muted-foreground hover:text-foreground hover:bg-gray-200 dark:bg-[#27272A] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                        }`}
                        aria-label="Grid view"
                      >
                        <IoGridOutline className="size-4" />
                      </button>
                      <button
                        onClick={() => setFolderContentView("list")}
                        className={`p-1.5 rounded transition-colors ${
                          folderContentView === "list"
                            ? "text-foreground bg-white shadow-sm dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                            : "text-muted-foreground hover:text-foreground hover:bg-gray-200 dark:bg-[#27272A] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                        }`}
                        aria-label="List view"
                      >
                        <FaListUl className="size-4" />
                      </button>
                    </div>
                  </div>

                  {folderContentView === "grid" ? (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {currentFolder.files.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => handleFileSelect(file)}
                          className="flex items-center rounded-lg bg-[#F4F4F5] dark:bg-[#27272A] border border-gray-200 dark:border-[#27272A] px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#27272A]/80 cursor-pointer transition-colors"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleFileSelect(file)
                          }
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            {file.type === "PDF" ? (
                              <img
                                src="/Files/PDF-icon.svg"
                                alt="PDF"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            ) : file.type === "DOCX" || file.type === "DOC" ? (
                              <img
                                src="/Files/Docs-icon.svg"
                                alt="Document"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            ) : file.type === "XLSX" ||
                              file.type === "XLS" ||
                              file.type === "CSV" ? (
                              <img
                                src="/Files/XLS-icon.svg"
                                alt="Spreadsheet"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            ) : file.type === "PPTX" || file.type === "PPT" ? (
                              <img
                                src="/Files/PDF-icon.svg"
                                alt="Presentation"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            ) : (
                              <img
                                src="/Files/file.svg"
                                alt="File"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 ml-2">
                            <p className="truncate text-sm font-medium">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30px] sm:w-[40px] px-2 sm:px-4">
                              <input
                                type="checkbox"
                                checked={
                                  currentFolder.files.length > 0 &&
                                  selectedFiles.size ===
                                    currentFolder.files.length
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    // Select all files in current folder
                                    const allFileIds = currentFolder.files.map(
                                      (file) => file.id || file.name
                                    );
                                    setSelectedFiles(new Set(allFileIds));
                                  } else {
                                    // Deselect all
                                    setSelectedFiles(new Set());
                                  }
                                }}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                              />
                            </TableHead>
                            <TableHead className="px-2 sm:px-4">Name</TableHead>
                            <TableHead className="w-[70px] sm:w-[100px] text-xs whitespace-nowrap px-2 sm:px-4">
                              Size
                            </TableHead>
                            <TableHead className="w-[100px] sm:w-[120px] text-xs whitespace-nowrap px-2 sm:px-4">
                              Date Created
                            </TableHead>
                            <TableHead className="w-[40px] sm:w-[50px] px-2 sm:px-4"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentFolder.files
                            .slice(
                              (currentPage - 1) * itemsPerPage,
                              currentPage * itemsPerPage
                            )
                            .map((file) => {
                              const getFileIcon = () => {
                                if (file.type === "PDF")
                                  return "/Files/PDF-icon.svg";
                                if (file.type === "DOCX" || file.type === "DOC")
                                  return "/Files/Docs-icon.svg";
                                if (
                                  file.type === "XLSX" ||
                                  file.type === "XLS" ||
                                  file.type === "CSV"
                                )
                                  return "/Files/XLS-icon.svg";
                                if (file.type === "PPTX" || file.type === "PPT")
                                  return "/Files/PDF-icon.svg";
                                return "/Files/file.svg";
                              };

                              const fileId = file.id || file.name;

                              return (
                                <TableRow
                                  key={fileId}
                                  onClick={() => handleFileSelect(file)}
<<<<<<< HEAD
                                  className="cursor-pointer"
=======
                                  className="cursor-pointer dark:border-[#3F3F46]"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                >
                                  <TableCell className="px-2 sm:px-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedFiles.has(fileId)}
                                      onChange={(e) =>
                                        toggleFileSelection(fileId, e as any)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                    />
                                  </TableCell>
                                  <TableCell className="px-2 sm:px-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      <img
                                        src={getFileIcon()}
                                        alt={file.type}
<<<<<<< HEAD
                                        className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px] shrink-0 object-contain"
=======
                                        className="w-12 h-12 shrink-0 object-contain"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                      />
                                      <span className="truncate font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                        {file.name}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-gray-500 dark:text-white text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-4">
                                    {formatFileSize(file.size || 0)}
                                  </TableCell>
                                  <TableCell className="text-gray-500 dark:text-white text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-4">
                                    {formatDate(file.uploadedAt || new Date())}
                                  </TableCell>
                                  <TableCell className="px-2 sm:px-4">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log(
                                          "Open menu for file:",
                                          file.name
                                        );
                                      }}
                                      className="p-1 sm:p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-[#27272A] dark:text-white rounded transition-colors"
                                      title="More actions"
                                    >
                                      <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                      {/* Pagination */}
                      {currentFolder.files.length > itemsPerPage && (
                        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#09090B]">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedFiles.size} of {currentFolder.files.length}{" "}
                            row(s) selected
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              disabled={currentPage === 1}
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                currentPage === 1
<<<<<<< HEAD
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600"
                                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:hover:bg-[#18181B]"
=======
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600 dark:border-[#3F3F46]"
                                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:border-[#3F3F46] dark:hover:bg-[#18181B]"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                              }`}
                            >
                              Previous
                            </button>
                            <div className="text-sm text-gray-700 dark:text-gray-300 px-2">
                              {/* {currentPage} of {Math.ceil(currentFolder.files.length / itemsPerPage)} */}
                            </div>
                            <button
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(
                                    Math.ceil(
                                      currentFolder.files.length / itemsPerPage
                                    ),
                                    p + 1
                                  )
                                )
                              }
                              disabled={
                                currentPage >=
                                Math.ceil(
                                  currentFolder.files.length / itemsPerPage
                                )
                              }
<<<<<<< HEAD
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
=======
                              className={`px-3 py-1 border rounded-md text-sm font-medium ${
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                currentPage >=
                                Math.ceil(
                                  currentFolder.files.length / itemsPerPage
                                )
<<<<<<< HEAD
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600"
                                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:hover:bg-[#18181B]"
=======
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600 dark:border-[#3F3F46]"
                                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:border-[#3F3F46] dark:hover:bg-[#18181B]"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                              }`}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>

                {/* Bottom spacer */}
                <div className="h-8 sm:h-8" aria-hidden="true"></div>
              </>
            ) : (
              <>
                {/* Main Library View */}
                <header className="mb-6 sm:mb-8 flex flex-col items-start justify-start gap-6 sm:gap-12">
                  <div className="relative w-full" ref={searchRef}>
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      onFocus={() => setIsSearchFocused(true)}
                      onClick={() => setIsSearchFocused(true)}
                      placeholder="Search files and folders..."
                    />
                    <SearchDropdown
                      isOpen={isSearchFocused}
                      searchQuery={searchQuery}
                      onSelect={(file) => {
                        console.log("Selected file:", file);
                        // Handle file selection (e.g., open file, navigate, etc.)
                        setIsSearchFocused(false);
                      }}
                    />
                  </div>
                </header>

<<<<<<< HEAD
                {recentlyVisited.length > 0 && (
                  <section
                    aria-labelledby="recently-visited"
                    className="mb-6 sm:mb-10"
                  >
                    <h2
                      id="recently-visited"
                      className="mb-4 sm:mb-6 flex gap-2 text-sm font-medium text-muted-foreground"
                    >
                      <LuClock className="size-4 text-muted-foreground" />
                      Recently visited
                    </h2>
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-x-visible">
                      {recentlyVisited.slice(0, 4).map((item, index) => {
                        // Determine image source based on type and folder status
                        let imageSrc = "/noPdfImg.svg"; // default
                        if (item.isFolder) {
                          imageSrc = "/BigFolder.svg";
                        } else if (
                          item.type?.toLowerCase() === "pdf" ||
                          item.type?.toLowerCase() === "txt" ||
                          item.type?.toLowerCase() === "doc" ||
                          item.type?.toLowerCase() === "docx"
                        ) {
                          imageSrc = "/txtPDF.svg";
                        } else if (
                          item.type?.toLowerCase() === "mp3" ||
                          item.type?.toLowerCase() === "mp4" ||
                          item.type?.toLowerCase() === "jpg" ||
                          item.type?.toLowerCase() === "png" ||
                          item.type?.toLowerCase() === "gif"
                        ) {
                          imageSrc = "/noPdfImg.svg"; // music and images
                        }

                        // Calculate time ago
                        const now = new Date();
                        const diffInHours = Math.floor(
                          (now.getTime() - item.visitedAt.getTime()) /
                            (1000 * 60 * 60)
                        );
                        let timeAgo = "Just now";
                        if (diffInHours === 1) timeAgo = "1 hour ago";
                        else if (diffInHours < 24)
                          timeAgo = `${diffInHours} hours ago`;
                        else if (diffInHours < 48) timeAgo = "1 day ago";
                        else
                          timeAgo = `${Math.floor(diffInHours / 24)} days ago`;

                        const actionText = item.isFolder
                          ? "Opened"
                          : index === 3
                          ? "Last updated"
                          : "Opened";

                        return (
                          <div
                            key={item.id}
                            className="flex flex-col items-center w-[180px] h-[170px] rounded-lg border border-gray-200 dark:border-gray-800 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors text-center p-[12px] gap-[20px] shrink-0"
                            onClick={() => {
                              if (item.isFolder) {
                                // Find the folder and select it
                                const folder = folders.find(
                                  (f) => f.id === item.id
                                );
                                if (folder) handleFolderSelect(folder);
                              } else {
                                // Find the file and select it
                                const file = files.find(
                                  (f) => f.id === item.id
                                );
                                if (file) handleFileSelect(file);
                              }
                            }}
                          >
                            <div className="flex items-center justify-center w-[156px] h-[90px] shrink-0">
                              <img
                                src={imageSrc}
                                alt={item.isFolder ? "Folder" : "File"}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <div className="w-[156px] h-[36px] flex flex-col items-center justify-center">
                              <p
                                className="text-xs sm:text-sm font-medium text-gray-900 truncate dark:text-white lines-clamp-1"
                                title={item.name}
                              >
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {actionText} {timeAgo}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
=======
                <section
                  aria-labelledby="recently-visited"
                  className="mb-6 sm:mb-10"
                >
                  <h2
                    id="recently-visited"
                    className="mb-4 sm:mb-6 flex gap-2 text-sm font-medium text-muted-foreground"
                  >
                    <LuClock className="size-4 text-muted-foreground" />
                    Recently visited
                  </h2>
                  <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-x-visible">
                    <div className="flex flex-col items-center min-w-[160px] w-[160px] md:w-full md:min-w-0 h-auto sm:h-[161.59px] rounded-lg border border-gray-200 dark:border-gray-800 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors text-center pt-4 sm:pt-5 px-2 sm:px-3 pb-3 flex-shrink-0">
                      <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <img
                          src="/blueFolder.svg"
                          alt="Recent Files"
                          className="h-[55px] w-[55px] sm:h-[75.59px] sm:w-[75.48px]"
                        />
                      </div>
                      <div className="w-full">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate px-1 dark:text-white">
                          Opened 3 hours ago
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          5 items
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center min-w-[160px] w-[160px] md:w-full md:min-w-0 h-auto sm:h-[161.59px] rounded-lg border border-gray-200 dark:border-gray-800 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors text-center pt-4 sm:pt-5 px-2 sm:px-3 pb-3 flex-shrink-0">
                      <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <img
                          src="/blackFolder.svg"
                          alt="Created Files"
                          className="h-[55px] w-[55px] sm:h-[75.59px] sm:w-[75.48px]"
                        />
                      </div>
                      <div className="w-full">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate px-1 dark:text-white">
                          Created
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          12 documents
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center min-w-[160px] w-[160px] md:w-full md:min-w-0 h-auto sm:h-[161.59px] rounded-lg border border-gray-200 dark:border-gray-800 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors text-center pt-4 sm:pt-5 px-2 sm:px-3 pb-3 flex-shrink-0">
                      <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <img
                          src="/yellowFolder.svg"
                          alt="Received Files"
                          className="h-[55px] w-[55px] sm:h-[75.59px] sm:w-[75.48px]"
                        />
                      </div>
                      <div className="w-full">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate px-1 dark:text-white">
                          Received
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          8 folders
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center min-w-[160px] w-[160px] md:w-full md:min-w-0 h-auto sm:h-[161.59px] rounded-lg border border-gray-200 dark:border-gray-800 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors text-center pt-4 sm:pt-5 px-2 sm:px-3 pb-3 flex-shrink-0">
                      <div className="flex items-center justify-center mb-3 sm:mb-4">
                        <img
                          src="/redFolder.svg"
                          alt="Updated Files"
                          className="h-[55px] w-[55px] sm:h-[75.59px] sm:w-[75.48px]"
                        />
                      </div>
                      <div className="w-full">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate px-1 dark:text-white">
                          Updated
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          15 files
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d

                <section
                  aria-labelledby="all-folders"
                  className="space-y-3 sm:space-y-4 mb-6 sm:mb-10"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                      <button
                        onClick={() => setFoldersExpanded(!foldersExpanded)}
                        className="flex items-center gap-2 p-2 rounded-md text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors hover:bg-[#F4F4F5]"
=======
                      <h2 className="text-sm font-medium text-muted-foreground">
                        All Categories
                      </h2>
                      <button
                        onClick={() => setFoldersExpanded(!foldersExpanded)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                        aria-label={
                          foldersExpanded
                            ? "Collapse folders"
                            : "Expand folders"
                        }
                      >
<<<<<<< HEAD
                        All Categories
                        {foldersExpanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
=======
                        {foldersExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md dark:bg-[#27272A]">
                      <button
                        onClick={() => setFolderView("grid")}
                        className={`p-1.5 rounded transition-colors ${
                          folderView === "grid"
                            ? "text-foreground bg-white shadow-sm dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                            : "text-muted-foreground hover:text-foreground hover:bg-gray-200 dark:bg-[#27272A] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                        }`}
                        aria-label="Grid view"
                      >
                        <IoGridOutline className="size-4" />
                      </button>
                      <button
                        onClick={() => setFolderView("list")}
                        className={`p-1.5 rounded transition-colors ${
                          folderView === "list"
                            ? "text-foreground bg-white shadow-sm dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                            : "text-muted-foreground hover:text-foreground hover:bg-gray-200 dark:bg-[#27272A] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                        }`}
                        aria-label="List view"
                      >
                        <FaListUl className="size-4" />
                      </button>
                    </div>
                  </div>

                  {foldersExpanded && (
                    <>
                      {folderView === "grid" ? (
<<<<<<< HEAD
                        <div className="grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
=======
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                          {filteredFolders.length > 0 ? (
                            filteredFolders.map((folder) => (
                              <div
                                key={folder.id}
                                onClick={() => handleFolderSelect(folder)}
                                className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3 hover:bg-muted/80 cursor-pointer transition-colors dark:bg-[#27272A]"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  handleFolderSelect(folder)
                                }
                              >
                                <img
                                  src="/Folder.svg"
                                  alt="Folder"
                                  className="h-[20px] w-[20px]"
                                />
                                <div className="flex-1 min-w-0 ">
                                  <p className="truncate text-sm font-medium">
                                    {folder.name}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                              No folders found
                            </div>
                          )}
                        </div>
                      ) : (
<<<<<<< HEAD
                        <div className="rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[30px] sm:w-[40px] px-2 sm:px-4">
                                  <input
                                    type="checkbox"
                                    checked={
                                      filteredFolders.length > 0 &&
                                      selectedFolders.size ===
                                        filteredFolders.length
                                    }
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        // Select all folders
                                        const allFolderIds =
                                          filteredFolders.map(
                                            (folder) => folder.id
                                          );
                                        setSelectedFolders(
                                          new Set(allFolderIds)
                                        );
                                      } else {
                                        // Deselect all
                                        setSelectedFolders(new Set());
                                      }
                                    }}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                  />
                                </TableHead>
=======
                        <div className="rounded-md border dark:border-[#3F3F46]">
                          <Table>
                            <TableHeader>
                              <TableRow className="dark:border-[#3F3F46]">
                                <TableHead className="w-[30px] sm:w-[40px] px-2 sm:px-4"></TableHead>
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                <TableHead className="px-2 sm:px-4">
                                  Name
                                </TableHead>
                                <TableHead className="w-[70px] sm:w-[100px] text-xs whitespace-nowrap px-2 sm:px-4">
                                  Size
                                </TableHead>
                                <TableHead className="w-[100px] sm:w-[120px] text-xs whitespace-nowrap px-2 sm:px-4">
                                  Date Created
                                </TableHead>
                                <TableHead className="w-[40px] sm:w-[50px] px-2 sm:px-4"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredFolders.length > 0 ? (
                                filteredFolders.map((folder) => (
                                  <TableRow
                                    key={folder.id}
                                    onClick={() => handleFolderSelect(folder)}
                                    className="cursor-pointer dark:border-[#3F3F46]"
                                  >
                                    <TableCell className="px-2 sm:px-4">
                                      <input
                                        type="checkbox"
                                        checked={selectedFolders.has(folder.id)}
                                        onChange={(e) =>
                                          toggleFolderSelection(
                                            folder.id,
                                            e as any
                                          )
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                      />
                                    </TableCell>
                                    <TableCell className="px-2 sm:px-4">
                                      <div className="flex items-center gap-2 sm:gap-3">
                                        <img
                                          src="/Folder.svg"
                                          alt="Folder"
<<<<<<< HEAD
                                          className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px] shrink-0"
=======
                                          className="w-12 h-12 shrink-0"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                        />
                                        <span className="truncate font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                          {folder.name}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-white text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-4">
                                      {folder.fileCount} items
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-white text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-4">
                                      {formatDate(new Date())}
                                    </TableCell>
                                    <TableCell className="px-2 sm:px-4">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(
                                            "Open menu for folder:",
                                            folder.name
                                          );
                                        }}
                                        className="p-1 sm:p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-[#27272A] dark:text-white rounded transition-colors"
                                        title="More actions"
                                      >
                                        <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                                      </button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={5}
                                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                                  >
                                    No folders found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </>
                  )}
                </section>

                <section
                  aria-labelledby="all-files"
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                      <button
                        onClick={() => setFilesExpanded(!filesExpanded)}
                        className="flex items-center gap-2 p-2 rounded-md text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors hover:bg-[#F4F4F5]"
=======
                      <button className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors hover:bg-gray-100 bg-gray-50">
                        All Files
                      </button>
                      <button
                        onClick={() => setFilesExpanded(!filesExpanded)}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                        aria-label={
                          filesExpanded ? "Collapse files" : "Expand files"
                        }
                      >
<<<<<<< HEAD
                        All Files
                        {filesExpanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
=======
                        {filesExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#27272A] p-1 rounded-md">
                      <button
                        onClick={() => setFileView("grid")}
                        className={`p-1.5 rounded transition-colors ${
                          fileView === "grid"
                            ? "text-foreground bg-white shadow-sm dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                            : "text-muted-foreground hover:text-foreground hover:bg-gray-200 dark:bg-[#27272A] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                        }`}
                        aria-label="Grid view"
                      >
                        <IoGridOutline className="size-4" />
                      </button>
                      <button
                        onClick={() => setFileView("list")}
                        className={`p-1.5 rounded transition-colors ${
                          fileView === "list"
                            ? "text-foreground bg-white shadow-sm dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                            : "text-muted-foreground hover:text-foreground hover:bg-gray-200 dark:bg-[#27272A] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                        }`}
                        aria-label="List view"
                      >
                        <FaListUl className="size-4" />
                      </button>
                    </div>
                  </div>

                  {filesExpanded && (
                    <>
                      {/* File Type Tabs */}
                      <div className="flex items-center gap-2 bg-white dark:bg-[#09090B] py-3 sm:py-4 overflow-x-auto pb-3 sm:pb-4 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
                        <button
                          onClick={() => setActiveFileType(null)}
<<<<<<< HEAD
                          className={`shrink-0 cursor-pointer rounded-md px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 dark:bg-[#09090B] ${
                            activeFileType === null
                              ? "bg-[#F4F4F5] text-primary dark:border-[#3F3F46] border border-primary/20 shadow-sm dark:bg-[#27272A]"
                              : "text-gray-600 hover:bg-gray-50 border border-gray-200 bg-white hover:border-gray-300 dark:border-[#3F3F46] dark:text-[#A1A1AA] dark:bg-[#09090B]"
=======
                          className={`shrink-0 cursor-pointer rounded-md px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                            activeFileType === null
                              ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                              : "text-gray-600 hover:bg-gray-50 border border-gray-200 bg-white hover:border-gray-300 dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                          }`}
                        >
                          <span>All Files</span>
                          {/* <span className="text-xs cursor-pointer bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                        {getFileCount('All Files')}
                      </span> */}
                        </button>

                        {[
                          "Documents",
                          "Photos",
                          "Videos",
                          "Compressed ZIPs",
                          "Audio",
                          "Excel",
                        ].map((tab) => {
                          const isActive = activeFileType === tab;

                          return (
                            <button
                              key={tab}
                              onClick={() =>
                                setActiveFileType(isActive ? null : tab)
                              }
                              className={`shrink-0 cursor-pointer rounded-md px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 dark:bg-[#09090B] ${
                                isActive
<<<<<<< HEAD
                                  ? "bg-[#F4F4F5] text-primary dark:border-[#3F3F46] border border-primary/20 shadow-sm dark:bg-[#27272A]"
=======
                                  ? "bg-primary/10 text-primary dark:border-[#3F3F46] border border-primary/20 shadow-sm dark:bg-[#27272A]"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                  : "text-gray-600 hover:bg-gray-50 border border-gray-200 bg-white hover:border-gray-300 dark:border-[#3F3F46] dark:text-[#A1A1AA] dark:bg-[#09090B]"
                              }`}
                            >
                              <span>{tab}</span>
                              {/* {count > 0 && (
                            <span className={`text-xs rounded-full px-2 py-0.5 ${
                              isActive 
                                ? 'bg-primary/20 text-primary' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {count}
                            </span>
                          )} */}
                            </button>
                          );
                        })}
                      </div>

                      {fileView === "grid" ? (
                        <div className="space-y-4">
                          <div
<<<<<<< HEAD
                            className={`transition-all duration-300 grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 ${
=======
                            className={`transition-all duration-300 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                              filteredFiles.length === 0
                                ? "min-h-[200px] flex items-center justify-center"
                                : ""
                            }`}
                          >
                            {filteredFiles.length === 0 ? (
                              <div className="col-span-full text-center py-8 text-gray-500">
                                <p className="text-sm">
                                  {activeFileType
                                    ? `No ${activeFileType.toLowerCase()} files found`
                                    : "No files found"}
                                </p>
                              </div>
                            ) : (
                              paginatedFiles(
                                filteredFiles,
                                filesCurrentPage
                              ).map((file) => (
                                <div
                                  key={file.id}
                                  onClick={() => handleFileSelect(file)}
                                  className="group relative flex items-center rounded-lg bg-[#F4F4F5] dark:bg-[#27272A] dark:border-[#27272A] border border-gray-200 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && handleFileSelect(file)
                                  }
                                >
                                  <div className="w-6 h-6 flex items-center justify-center">
                                    {file.type === "PDF" ? (
                                      <img
                                        src="/Files/PDF-icon.svg"
                                        alt="PDF"
                                        className="max-w-[34px] max-h-[34px] object-contain"
                                      />
                                    ) : file.type === "DOCX" ||
                                      file.type === "DOC" ? (
                                      <img
                                        src="/Files/Docs-icon.svg"
                                        alt="Document"
                                        className="max-w-[34px] max-h-[34px] object-contain"
                                      />
                                    ) : file.type === "XLSX" ||
                                      file.type === "XLS" ? (
                                      <img
                                        src="/Files/XLS-icon.svg"
                                        alt="Spreadsheet"
                                        className="max-w-[34px] max-h-[34px] object-contain"
                                      />
                                    ) : file.type === "PPTX" ||
                                      file.type === "PPT" ? (
                                      <img
                                        src="/Files/PDF-icon.svg"
                                        alt="Presentation"
                                        className="max-w-[34px] max-h-[34px] object-contain"
                                      />
                                    ) : file.type === "JPG" ||
                                      file.type === "JPEG" ||
                                      file.type === "PNG" ||
                                      file.type === "GIF" ? (
                                      <img
                                        src="/Files/JPG-icon.svg"
                                        alt="Image"
                                        className="max-w-[44px] max-h-[44px] object-contain"
                                      />
                                    ) : file.type === "MP3" ||
                                      file.type === "WAV" ||
                                      file.type === "AAC" ? (
                                      <img
                                        src="/Files/MP3-icon.svg"
                                        alt="Audio"
                                        className="max-w-[44px] max-h-[44px] object-contain"
                                      />
                                    ) : file.type === "ZIP" ||
                                      file.type === "RAR" ||
                                      file.type === "7Z" ? (
                                      <img
                                        src="/Files/ZIP-icon.svg"
                                        alt="Archive"
                                        className="max-w-[44px] max-h-[44px] object-contain"
                                      />
                                    ) : file.type === "TXT" ? (
                                      <img
                                        src="/Files/TXT-icon.svg"
                                        alt="Text"
                                        className="max-w-[44px] max-h-[44px] object-contain"
                                      />
                                    ) : (
                                      <img
                                        src="/Files/file.svg"
                                        alt="File"
                                        className="max-w-[34px] max-h-[34px] object-contain"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0 ml-2">
                                    <p className="truncate text-sm font-medium">
                                      {file.name}
                                    </p>
                                  </div>

                                  {/* 3-dot dropdown menu */}
                                  <div
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <DropdownMenu.Root>
                                      <DropdownMenu.Trigger asChild>
                                        <button
                                          onClick={(e) => e.stopPropagation()}
                                          className="p-1 text-gray-500 hover:text-gray-900 dark:text-white dark:hover:bg-[#27272A] hover:bg-gray-100 rounded transition-colors"
                                          title="More actions"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                      </DropdownMenu.Trigger>
                                      <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                          align="end"
                                          className="min-w-[180px] bg-white dark:bg-[#09090B] rounded-md shadow-lg border border-gray-100 dark:border-[#3F3F46] p-1 z-50"
                                          side="bottom"
                                          sideOffset={5}
                                          onCloseAutoFocus={(e) =>
                                            e.preventDefault()
                                          }
                                        >
                                          <DropdownMenu.Item
                                            className="flex items-center gap-2 text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer outline-none"
                                            onSelect={() => {
                                              toggleFileStar(
                                                file.id || "",
                                                file.name
                                              );
                                            }}
                                          >
                                            <Star
                                              className={`h-4 w-4 ${
                                                starredFileIds.has(
                                                  file.id || ""
                                                )
                                                  ? "fill-yellow-400 text-yellow-400"
                                                  : ""
                                              }`}
                                            />
                                            <span>
                                              {starredFileIds.has(file.id || "")
                                                ? "Unstar"
                                                : "Star"}
                                            </span>
                                          </DropdownMenu.Item>
                                          <DropdownMenu.Item
                                            className="flex items-center gap-2 text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer outline-none"
                                            onSelect={() => {
                                              console.log(
                                                "Download file:",
                                                file.name
                                              );
                                            }}
                                          >
                                            <Download className="h-4 w-4" />
                                            <span>Download</span>
                                          </DropdownMenu.Item>

                                          <DropdownMenu.Item
                                            className="flex items-center gap-2 text-sm p-2 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer outline-none"
                                            onSelect={() => {
                                              setFileToDelete(file);
                                            }}
                                          >
                                            <FiTrash className="h-4 w-4" />
                                            <span>Delete</span>
                                          </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                      </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ) : (
<<<<<<< HEAD
                        <div className="rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[30px] sm:w-[40px] px-2 sm:px-4">
                                  <input
                                    type="checkbox"
                                    checked={
                                      filteredFiles.length > 0 &&
                                      selectedFiles.size ===
                                        filteredFiles.length
                                    }
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        // Select all files
                                        const allFileIds = filteredFiles.map(
                                          (file) => file.id || file.name
                                        );
                                        setSelectedFiles(new Set(allFileIds));
                                      } else {
                                        // Deselect all
                                        setSelectedFiles(new Set());
                                      }
                                    }}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                  />
                                </TableHead>
=======
                        <div className="rounded-md border dark:border-[#3F3F46]">
                          <Table>
                            <TableHeader>
                              <TableRow className="dark:border-[#3F3F46]">
                                <TableHead className="w-[30px] sm:w-[40px] px-2 sm:px-4"></TableHead>
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                <TableHead className="px-2 sm:px-4">
                                  Name
                                </TableHead>
                                <TableHead className="w-[70px] sm:w-[100px] text-xs whitespace-nowrap px-2 sm:px-4">
                                  Size
                                </TableHead>
                                <TableHead className="w-[100px] sm:w-[120px] text-xs whitespace-nowrap px-2 sm:px-4">
                                  Date Created
                                </TableHead>
                                <TableHead className="w-[40px] sm:w-[50px] px-2 sm:px-4"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredFiles.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={5}
                                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                                  >
                                    {activeFileType
                                      ? `No ${activeFileType.toLowerCase()} files found`
                                      : "No files found"}
                                  </TableCell>
                                </TableRow>
                              ) : (
                                paginatedFiles(
                                  filteredFiles,
                                  filesCurrentPage
                                ).map((file) => {
                                  const getFileIcon = () => {
                                    if (file.type === "PDF")
                                      return "/Files/PDF-icon.svg";
                                    if (
                                      file.type === "DOCX" ||
                                      file.type === "DOC"
                                    )
                                      return "/Files/Docs-icon.svg";
                                    if (
                                      file.type === "XLSX" ||
                                      file.type === "XLS"
                                    )
                                      return "/Files/XLS-icon.svg";
                                    if (
                                      file.type === "PPTX" ||
                                      file.type === "PPT"
                                    )
                                      return "/Files/PDF-icon.svg";
                                    if (
                                      file.type === "JPG" ||
                                      file.type === "JPEG" ||
                                      file.type === "PNG" ||
                                      file.type === "GIF"
                                    )
                                      return "/Files/JPG-icon.svg";
                                    if (
                                      file.type === "MP3" ||
                                      file.type === "WAV" ||
                                      file.type === "AAC"
                                    )
                                      return "/Files/MP3-icon.svg";
                                    if (
                                      file.type === "ZIP" ||
                                      file.type === "RAR" ||
                                      file.type === "7Z"
                                    )
                                      return "/Files/ZIP-icon.svg";
                                    if (file.type === "TXT")
                                      return "/Files/TXT-icon.svg";
                                    return "/Files/file.svg";
                                  };

                                  const fileId = file.id || file.name;

                                  return (
                                    <TableRow
                                      key={fileId}
                                      onClick={() => handleFileSelect(file)}
<<<<<<< HEAD
                                      className="cursor-pointer"
=======
                                      className="cursor-pointer dark:border-[#3F3F46]"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                    >
                                      <TableCell className="px-2 sm:px-4">
                                        <input
                                          type="checkbox"
                                          checked={selectedFiles.has(fileId)}
                                          onChange={(e) =>
                                            toggleFileSelection(
                                              fileId,
                                              e as any
                                            )
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                        />
                                      </TableCell>
                                      <TableCell className="px-2 sm:px-4">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                          <img
                                            src={getFileIcon()}
                                            alt={file.type}
<<<<<<< HEAD
                                            className="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px] shrink-0 object-contain"
=======
                                            className="w-12 h-12 shrink-0 object-contain"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                          />
                                          <span className="truncate font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                            {file.name}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-gray-500 dark:text-white text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-4">
                                        {formatFileSize(file.size || 0)}
                                      </TableCell>
                                      <TableCell className="text-gray-500 dark:text-white text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-4">
                                        {formatDate(
                                          file.uploadedAt || new Date()
                                        )}
                                      </TableCell>
                                      <TableCell className="px-2 sm:px-4">
                                        <div
                                          className="flex items-center justify-center"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <DropdownMenu.Root>
                                            <DropdownMenu.Trigger asChild>
                                              <button
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                                className="p-1 sm:p-1.5 text-gray-500 hover:text-gray-900 dark:text-white dark:hover:bg-[#27272A] hover:bg-gray-100 rounded transition-colors"
                                                title="More actions"
                                              >
                                                <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                              </button>
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                              <DropdownMenu.Content
                                                align="end"
                                                className="min-w-[180px] bg-white dark:bg-[#09090B] rounded-md shadow-lg border border-gray-100 dark:border-[#3F3F46] p-1 z-50"
                                                side="bottom"
                                                sideOffset={5}
                                                onCloseAutoFocus={(e) =>
                                                  e.preventDefault()
                                                }
                                              >
                                                <DropdownMenu.Item
                                                  className="flex items-center gap-2 text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer outline-none"
                                                  onSelect={() => {
                                                    toggleFileStar(
                                                      file.id || "",
                                                      file.name
                                                    );
                                                  }}
                                                >
                                                  <Star
                                                    className={`h-4 w-4 ${
                                                      starredFileIds.has(
                                                        file.id || ""
                                                      )
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : ""
                                                    }`}
                                                  />
                                                  <span>
                                                    {starredFileIds.has(
                                                      file.id || ""
                                                    )
                                                      ? "Unstar"
                                                      : "Star"}
                                                  </span>
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item
                                                  className="flex items-center gap-2 text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer outline-none"
                                                  onSelect={() => {
                                                    console.log(
                                                      "Download file:",
                                                      file.name
                                                    );
                                                  }}
                                                >
                                                  <Download className="h-4 w-4" />
                                                  <span>Download</span>
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item
                                                  className="flex items-center gap-2 text-sm p-2 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer outline-none"
                                                  onSelect={() => {
                                                    setFileToDelete(file);
                                                  }}
                                                >
                                                  <FiTrash className="h-4 w-4" />
                                                  <span>Delete</span>
                                                </DropdownMenu.Item>
                                              </DropdownMenu.Content>
                                            </DropdownMenu.Portal>
                                          </DropdownMenu.Root>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              )}
                            </TableBody>
                          </Table>
                          {filteredFiles.length > itemsPerPage && (
<<<<<<< HEAD
                            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#09090B]">
=======
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-[#3F3F46] bg-white dark:bg-[#09090B]">
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing{" "}
                                {Math.min(
                                  (filesCurrentPage - 1) * itemsPerPage + 1,
                                  filteredFiles.length
                                )}{" "}
                                to{" "}
                                {Math.min(
                                  filesCurrentPage * itemsPerPage,
                                  filteredFiles.length
                                )}{" "}
                                of {filteredFiles.length} items
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    setFilesCurrentPage((p) =>
                                      Math.max(1, p - 1)
                                    )
                                  }
                                  disabled={filesCurrentPage === 1}
<<<<<<< HEAD
                                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    filesCurrentPage === 1
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600"
                                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:hover:bg-[#18181B]"
=======
                                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                                    filesCurrentPage === 1
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600 dark:border-[#3F3F46]"
                                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:border-[#3F3F46] dark:hover:bg-[#18181B]"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                  }`}
                                >
                                  Previous
                                </button>
                                <div className="text-sm text-gray-700 dark:text-gray-300 px-2">
                                  {filesCurrentPage} of {totalFilesPages}
                                </div>
                                <button
                                  onClick={() =>
                                    setFilesCurrentPage((p) =>
                                      Math.min(totalFilesPages, p + 1)
                                    )
                                  }
                                  disabled={filesCurrentPage >= totalFilesPages}
<<<<<<< HEAD
                                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    filesCurrentPage >= totalFilesPages
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600"
                                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:hover:bg-[#18181B]"
=======
                                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                                    filesCurrentPage >= totalFilesPages
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-[#18181B] dark:text-gray-600 dark:border-[#3F3F46]"
                                      : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#09090B] dark:text-white dark:border-[#3F3F46] dark:hover:bg-[#18181B]"
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
                                  }`}
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </section>

                {/* Bottom spacer */}
                <div className="h-8 sm:h-8" aria-hidden="true"></div>
              </>
            )}
          </div>
        </main>

        {/* Backdrop for mobile when AI chat is open */}
        {isAIChatOpen && (
          <div
            className="fixed inset-0 shadow-lg z-30 sm:hidden"
            onClick={closeAIChat}
          />
        )}

        {/* AI Chat Sidebar - Slides from bottom on mobile, from right on desktop */}
        <div
          className={`fixed bg-white dark:bg-[#09090B] border-gray-200 dark:border-[#3F3F46] shadow-lg transition-all duration-300 ease-in-out z-40
            ${/* Mobile - from bottom, no X translation */ ""}
<<<<<<< HEAD
            bottom-0 left-0 right-0 w-full rounded-t-2xl border-t translate-x-0
=======
            bottom-0 left-0 right-0 w-full h-[85vh] rounded-t-2xl border-t translate-x-0
>>>>>>> 18d841f1334313896abb287cd4404dc463b8bf8d
            ${/* Desktop - from right */ ""}
            sm:top-0 sm:bottom-auto sm:left-auto sm:right-0 sm:h-full sm:w-[400px] sm:rounded-none sm:border-t-0 sm:border-l
            ${/* Mobile Animation - ONLY Y axis */ ""}
            ${isAIChatOpen ? "translate-y-0" : "translate-y-full"}
            ${/* Desktop Animation - ONLY X axis, reset Y */ ""}
            sm:translate-y-0 ${
              isAIChatOpen ? "sm:translate-x-0" : "sm:translate-x-full"
            }
          `}
          style={{
            height:
              isMobile && isAIChatOpen && !isFullscreen
                ? `${dragPosition}vh`
                : isMobile && isFullscreen
                ? "100vh"
                : undefined,
          }}
        >
          {/* Draggable handle for mobile - hide in fullscreen */}
          <div
            className={`sm:hidden flex justify-center py-2 cursor-touch active:cursor-grabbing ${
              isFullscreen ? "opacity-0 pointer-events-none" : ""
            }`}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
          >
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46]">
            <button
              onClick={closeAIChat}
              className="p-1 text-gray-500 dark:text-white hover:text-gray-700 transition-colors cursor-pointer"
              aria-label="Close AI chat"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors cursor-pointer">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {activeChat?.title || "New Chat"}
                  </span>
                  <ChevronDown className="h-4 w-4 font-bold text-gray-500 dark:text-gray-400 shrink-0" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="center"
                  className="min-w-[200px] bg-white dark:bg-[#09090B] rounded-md shadow-lg border border-gray-100 dark:border-[#3F3F46] p-1 z-50"
                  side="bottom"
                  sideOffset={5}
                >
                  <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Recent Chats
                  </div>
                  {chats.slice(0, 5).map((chat) => (
                    <DropdownMenu.Item
                      key={chat.id}
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded cursor-pointer outline-none ${
                        activeChatId === chat.id
                          ? "bg-gray-100 dark:bg-[#27272A]"
                          : "hover:bg-gray-50 dark:hover:bg-[#27272A]"
                      }`}
                      onSelect={() => {
                        selectChat(chat.id);
                      }}
                    >
                      <span className="truncate text-gray-900 dark:text-white">
                        {chat.title}
                      </span>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <button
              onClick={() => {
                router.push("/Dashboard/chat");
              }}
              className="p-1 text-gray-500 dark:text-white hover:text-gray-700 transition-colors cursor-pointer"
              aria-label="Maximize chat"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[calc(100%-64px)]">
            <ChatInterface
              selectedFile={null}
              onNewChat={() => {
                console.log("New chat requested from Library");
                createNewChat();
              }}
            />
          </div>
        </div>

        {/* Floating AI Button */}
        {!isAIChatOpen && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    createNewChat();
                    setIsAIChatOpen(true);
                  }}
                  className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 transition-all duration-200 flex items-center justify-center z-30 hover:scale-110 cursor-pointer"
                  aria-label="Open AI chat"
                >
                  <Image
                    src={Logomark}
                    alt="Tequity AI"
                    width={56}
                    height={56}
                    className="shrink-0"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Ask Tequity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* PDF Viewer */}
        <PDFViewer
          isOpen={isPDFViewerOpen}
          onClose={() => setIsPDFViewerOpen(false)}
          file={selectedFile}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          isOpen={!!fileToDelete}
          itemName={fileToDelete?.name || ""}
          onCancel={() => setFileToDelete(null)}
          onConfirm={() => {
            if (!fileToDelete) return;

            // Close PDF viewer if the deleted file is currently open
            if (selectedFile?.id === fileToDelete.id) {
              setIsPDFViewerOpen(false);
              setSelectedFile(null);
            }
            // Remove the file from the files array
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.id !== fileToDelete.id)
            );
            // Also remove from selected files if it's selected
            setSelectedFiles((prev) => {
              const newSet = new Set(prev);
              newSet.delete(fileToDelete.id || "");
              return newSet;
            });
            setFileToDelete(null);
          }}
        />
      </div>
    </>
  );
}

export default function LibraryPage() {
  const { setFiles: setGlobalFiles, setFolders: setGlobalFolders } = useFiles();

  const [folders, setFolders] = useState([
    { id: "1", name: "Financial Reports", fileCount: 24 },
    { id: "2", name: "Marketing Materials", fileCount: 156 },
    { id: "3", name: "Product Documents", fileCount: 45 },
    { id: "4", name: "Meeting Notes", fileCount: 89 },
    { id: "5", name: "Design Assets", fileCount: 234 },
    { id: "6", name: "Legal Documents", fileCount: 12 },
  ]);

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Financial Report Q4 2024",
      type: "PDF",
      size: 2457600,
      uploadedAt: new Date("2024-12-15"),
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: "2",
      name: "Marketing Strategy",
      type: "PDF",
      size: 1024000,
      uploadedAt: new Date("2024-12-10"),
      url: "https://www.africau.edu/images/default/sample.pdf",
    },
    {
      id: "3",
      name: "Product Roadmap",
      type: "PDF",
      size: 512000,
      uploadedAt: new Date("2024-12-08"),
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: "4",
      name: "Company Logo",
      type: "PNG",
      size: 204800,
      uploadedAt: new Date("2024-12-05"),
      url: "https://via.placeholder.com/400x300/0066cc/ffffff?text=Company+Logo",
    },
    {
      id: "5",
      name: "Meeting Notes",
      type: "PNG",
      size: 15360,
      uploadedAt: new Date("2024-12-01"),
      url: "https://via.placeholder.com/600x400/FF6B6B/ffffff?text=Meeting+Notes",
    },
    {
      id: "6",
      name: "Presentation Deck",
      type: "PDF",
      size: 3072000,
      uploadedAt: new Date("2024-11-28"),
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: "7",
      name: "Budget Analysis",
      type: "PNG",
      size: 456000,
      uploadedAt: new Date("2024-11-25"),
      url: "https://via.placeholder.com/800x600/FFA500/ffffff?text=Budget+Analysis",
    },
    {
      id: "8",
      name: "Team Photo",
      type: "PNG",
      size: 1536000,
      uploadedAt: new Date("2024-11-20"),
      url: "https://via.placeholder.com/800x600/4CAF50/ffffff?text=Team+Photo",
    },
  ]);

  // Update global context whenever files or folders change
  useEffect(() => {
    setGlobalFiles(files);
    setGlobalFolders(folders);
  }, [files, folders, setGlobalFiles, setGlobalFolders]);

  const handleFileUpload = (
    newFiles: FileItem[],
    newFolders: UploadedFolder[]
  ) => {
    console.log("Library received - Files:", newFiles);
    console.log("Library received - Folders:", newFolders);

    if (newFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }

    if (newFolders.length > 0) {
      setFolders((prevFolders) => [...prevFolders, ...newFolders]);
    }
  };

  return (
    <DashboardLayout
      title="Library"
      headerActions={<UploadDialog onUpload={handleFileUpload} />}
    >
      <LibraryContent
        files={files}
        setFiles={setFiles}
        folders={folders}
        setFolders={setFolders}
      />
    </DashboardLayout>
  );
}
