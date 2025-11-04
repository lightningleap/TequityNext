"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown,  ChevronsRight, Maximize2, Edit } from "lucide-react";
import { FileItem } from "../components/filegrid";
import { SearchBar } from "../components/searchbar";
import { UploadDialog, FolderItem as UploadedFolder } from "../components/UploadDialog";
import { LuClock } from "react-icons/lu";
import { IoGridOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { ChevronUp, Sparkles, MoreHorizontal } from "lucide-react";
import { ChatInterface } from "../components/ChatInterface";
import { DashboardLayout } from "../components/DashboardLayout";
import { PDFViewer } from "../components/PDFViewer";
import { useChatContext } from "../context/ChatContext";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Logomark from "@/public/Logomark.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LibraryContentProps {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  folders: Array<{ id: string; name: string; fileCount: number }>;
  setFolders: React.Dispatch<React.SetStateAction<Array<{ id: string; name: string; fileCount: number }>>>;
}

function LibraryContent({ files, setFiles, folders, setFolders }: LibraryContentProps) {
  const router = useRouter();
  const { createNewChat } = useChatContext();
  const { state: sidebarState } = useSidebar();
  const [folderView, setFolderView] = useState<"grid" | "list">("grid");
  const [fileView, setFileView] = useState<"grid" | "list">("grid");
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [filesExpanded, setFilesExpanded] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isPDFMaximized, setIsPDFMaximized] = useState(false);
  const [activeFileType, setActiveFileType] = useState<string | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // File type mapping for filtering
  const fileTypeMap: Record<string, string[]> = {
    'Documents': ['PDF', 'DOCX', 'TXT', 'PPTX'],
    'Photos': ['JPG', 'JPEG', 'PNG', 'GIF', 'SVG'],
    'Videos': ['MP4', 'MOV', 'AVI', 'WMV'],
    'Compressed ZIPs': ['ZIP', 'RAR', '7Z', 'TAR', 'GZ'],
    'Audio': ['MP3', 'WAV', 'AAC', 'OGG', 'WMA'],
    'Excel': ['XLSX', 'XLS', 'CSV']
  };

  // Filter files based on active tab and search query
  const filteredFiles = files.filter(file => {
    // Filter by file type
    const fileExt = file.name.split('.').pop()?.toUpperCase();
    const typeMatch = activeFileType
      ? fileTypeMap[activeFileType]?.includes(fileExt || '')
      : true;

    // Filter by search query
    const searchMatch = searchQuery
      ? file.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return typeMatch && searchMatch;
  });

  // Filter folders based on search query
  const filteredFolders = folders.filter(folder =>
    searchQuery
      ? folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  // Get count of files for each tab
  const getFileCount = (tab: string) => {
    if (tab === 'All Files') return;
    return files.filter(file => {
      const fileExt = file.name.split('.').pop()?.toUpperCase();
      return fileTypeMap[tab]?.includes(fileExt || '');
    }).length;
  };

  // Checkbox handlers
  const toggleFolderSelection = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFolders(prev => {
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
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  // Format file size helper
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '-';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const handleFileSelect = (file: FileItem) => {
    console.log("File selected:", file);
    setSelectedFile(file);
    setIsPDFViewerOpen(true);
  };

  const handleFolderSelect = (folder: { id: string; name: string; fileCount: number }) => {
    console.log("Folder selected:", folder);

    // Create sample files for the folder
    const sampleFiles: FileItem[] = [
      {
        id: `${folder.id}-1`,
        name: "Q4 Financial Summary.pdf",
        type: "PDF",
        size: 1024000,
        uploadedAt: new Date(),
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: `${folder.id}-2`,
        name: "Revenue Analysis.xlsx",
        type: "XLSX",
        size: 512000,
        uploadedAt: new Date(),
      },
      {
        id: `${folder.id}-3`,
        name: "Budget Report.docx",
        type: "DOCX",
        size: 768000,
        uploadedAt: new Date(),
      },
      {
        id: `${folder.id}-4`,
        name: "Charts",
        type: "FOLDER",
        size: 0,
        uploadedAt: new Date(),
      },
    ];

    // Create a folder file item with contents
    const folderFile: FileItem = {
      id: folder.id,
      name: folder.name,
      type: "FOLDER",
      size: 0,
      uploadedAt: new Date(),
      files: sampleFiles,
    };
    setSelectedFile(folderFile);
    setIsPDFViewerOpen(true);
  };

  // Calculate margin based on sidebar and viewer state
  const sidebarWidth = sidebarState === "collapsed" ? "3rem" : "16rem";
  const getMainMargin = () => {
    if (isAIChatOpen) return '400px';
    if (isPDFViewerOpen) {
      if (isPDFMaximized) return `calc(100% - ${sidebarWidth})`;
      return '400px';
    }
    return '0px';
  };

  return (
    <>
      <div className="flex-1 flex overflow-hidden">
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-3 sm:p-4 md:p-6 flex justify-center transition-all duration-300 scroll-smooth"
          style={{
            scrollbarGutter: 'stable',
            marginRight: getMainMargin()
          }}
        >
          <div className="w-full max-w-[792px] px-2 sm:px-0">
            <header className="mb-6 sm:mb-8 flex flex-col items-start justify-start gap-6 sm:gap-12">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search files and folders..."
              />
            </header>

            <section aria-labelledby="recently-visited" className="mb-6 sm:mb-10">
              <h2
                id="recently-visited"
                className="mb-4 sm:mb-6 flex gap-2 text-sm font-medium text-muted-foreground"
              >
                <LuClock className="size-4 text-muted-foreground" />
                Recently visited
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex flex-col items-center w-full min-w-0 h-auto sm:h-[161.59px] rounded-lg border border-gray-200 dark:border-gray-800 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors text-center pt-4 sm:pt-5 px-2 sm:px-3 pb-3">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <img src="/blueFolder.svg" alt="Recent Files" className="h-[55px] w-[55px] sm:h-[75.59px] sm:w-[75.48px]" />
                  </div>
                  <div className="w-full">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate px-1 dark:text-white">Opened 3 hours ago</p>
                    <p className="text-xs text-muted-foreground mt-1">5 items</p>
                  </div>
                </div>

                <div className="flex flex-col items-center w-full min-w-0 h-auto sm:h-[161.59px] rounded-lg border border-gray-200 dark:border-gray-800 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors text-center pt-4 sm:pt-5 px-2 sm:px-3 pb-3">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <img src="/blackFolder.svg" alt="Created Files" className="h-[55px] w-[55px] sm:h-[75.59px] sm:w-[75.48px]" />
                  </div>
                  <div className="w-full">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate px-1 dark:text-white">Created</p>
                    <p className="text-xs text-muted-foreground mt-1">12 documents</p>
                  </div>
                </div>

                <div className="flex flex-col items-center w-full min-w-0 h-auto sm:h-[161.59px] rounded-lg border border-gray-200 dark:border-gray-800 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors text-center pt-4 sm:pt-5 px-2 sm:px-3 pb-3">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <img src="/yellowFolder.svg" alt="Received Files" className="h-[55px] w-[55px] sm:h-[75.59px] sm:w-[75.48px]" />
                  </div>
                  <div className="w-full">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate px-1 dark:text-white">Received</p>
                    <p className="text-xs text-muted-foreground mt-1">8 folders</p>
                  </div>
                </div>

                <div className="flex flex-col items-center w-full min-w-0 h-auto sm:h-[161.59px] rounded-lg border border-gray-200 dark:border-gray-800 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors text-center pt-4 sm:pt-5 px-2 sm:px-3 pb-3">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <img src="/redFolder.svg" alt="Updated Files" className="h-[55px] w-[55px] sm:h-[75.59px] sm:w-[75.48px]" />
                  </div>
                  <div className="w-full">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate px-1 dark:text-white">Updated</p>
                    <p className="text-xs text-muted-foreground mt-1">15 files</p>
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="all-folders" className="space-y-3 sm:space-y-4 mb-6 sm:mb-10">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    All Folders
                  </h2>
                  <button
                    onClick={() => setFoldersExpanded(!foldersExpanded)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={foldersExpanded ? "Collapse folders" : "Expand folders"}
                  >
                    {foldersExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md dark:bg-[#27272A]">
                  <button
                    onClick={() => setFolderView("grid")}
                    className={`p-1.5 rounded transition-colors ${folderView === "grid"
                        ? "text-foreground bg-white shadow-sm dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                        : "text-muted-foreground hover:text-foreground hover:bg-gray-200 dark:bg-[#27272A] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                      }`}
                    aria-label="Grid view"
                  >
                    <IoGridOutline className="size-4" />
                  </button>
                  <button
                    onClick={() => setFolderView("list")}
                    className={`p-1.5 rounded transition-colors ${folderView === "list"
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
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {filteredFolders.length > 0 ? filteredFolders.map((folder) => (
                        <div
                          key={folder.id}
                          onClick={() => handleFolderSelect(folder)}
                          className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3 hover:bg-muted/80 cursor-pointer transition-colors dark:bg-[#27272A]"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleFolderSelect(folder)}
                        >
                          <img src="/Folder.svg" alt="Folder" className="h-[20px] w-[20px]" />
                          <div className="flex-1 min-w-0 ">
                            <p className="truncate text-sm font-medium">{folder.name}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                          No folders found
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-hidden bg-white dark:bg-[#09090B]">
                      {/* Table Header */}
                      <div className="grid grid-cols-[32px_1fr_40px] sm:grid-cols-[40px_1fr_50px] md:grid-cols-[40px_1fr_120px_120px_50px] gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 py-3 bg-gray-50 border-b dark:border-[#3F3F46] border-gray-200 text-xs font-medium text-gray-500 dark:text-[#A1A1AA] tracking-wider dark:bg-[#09090B]">
                        <div></div>
                        <div>Name</div>
                        <div className="hidden md:block">Size</div>
                        <div className="hidden md:block">Date Created</div>
                        <div></div>
                      </div>

                      {/* Table Rows */}
                      <div className="divide-y divide-gray-100 dark:divide-[#3F3F46]">
                        {filteredFolders.length > 0 ? filteredFolders.map((folder) => (
                          <div
                            key={folder.id}
                            onClick={() => handleFolderSelect(folder)}
                            className="grid grid-cols-[32px_1fr_40px] sm:grid-cols-[40px_1fr_50px] md:grid-cols-[40px_1fr_120px_120px_50px] gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors items-center"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && handleFolderSelect(folder)}
                          >
                            {/* Checkbox */}
                            <div className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={selectedFolders.has(folder.id)}
                                onChange={(e) => toggleFolderSelection(folder.id, e as any)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                              />
                            </div>

                            {/* Icon and Name */}
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                              <img src="/Folder.svg" alt="Folder" className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] md:h-[20px] md:w-[20px] flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{folder.name}</p>
                                <p className="text-[10px] sm:text-xs text-gray-500 md:hidden">{folder.fileCount} items</p>
                              </div>
                            </div>

                            {/* Size - Hidden on mobile */}
                            <div className="hidden md:block text-sm text-gray-500 dark:text-white">
                              {folder.fileCount} items
                            </div>

                            {/* Date Created - Hidden on mobile */}
                            <div className="hidden md:block text-sm text-gray-500 dark:text-white">
                              {formatDate(new Date())}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Open menu for folder:", folder.name);
                                }}
                                className="p-1 sm:p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-[#27272B] dark:text-white rounded transition-colors"
                                title="More actions"
                              >
                                <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No folders found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>

            <section aria-labelledby="all-files" className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    All Files
                  </h2>
                  <button
                    onClick={() => setFilesExpanded(!filesExpanded)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={filesExpanded ? "Collapse files" : "Expand files"}
                  >
                    {filesExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#27272A] p-1 rounded-md">
                  <button
                    onClick={() => setFileView("grid")}
                    className={`p-1.5 rounded transition-colors ${fileView === "grid"
                        ? "text-foreground bg-white shadow-sm dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                        : "text-muted-foreground hover:text-foreground hover:bg-gray-200 dark:bg-[#27272A] dark:border-[#3F3F46] dark:text-[#A1A1AA]"
                      }`}
                    aria-label="Grid view"
                  >
                    <IoGridOutline className="size-4" />
                  </button>
                  <button
                    onClick={() => setFileView("list")}
                    className={`p-1.5 rounded transition-colors ${fileView === "list"
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
                      className={`shrink-0 cursor-pointer rounded-md px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        activeFileType === null
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 border border-gray-200 bg-white hover:border-gray-300 dark:bg-[#09090B] dark:border-[#3F3F46] dark:text-[#A1A1AA]'
                      }`}
                    >
                      <span>All Files</span>
                      {/* <span className="text-xs cursor-pointer bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                        {getFileCount('All Files')}
                      </span> */}
                    </button>
                    
                    {['Documents', 'Photos', 'Videos', 'Compressed ZIPs', 'Audio', 'Excel'].map((tab) => {
                      const count = getFileCount(tab);
                      const isActive = activeFileType === tab;

                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveFileType(isActive ? null : tab)}
                          className={`shrink-0 cursor-pointer rounded-md px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 dark:bg-[#09090B] ${
                            isActive
                              ? 'bg-primary/10 text-primary dark:border-[#3F3F46] border border-primary/20 shadow-sm dark:bg-[#27272A]'
                              : 'text-gray-600 hover:bg-gray-50 border border-gray-200 bg-white hover:border-gray-300 dark:border-[#3F3F46] dark:text-[#A1A1AA] dark:bg-[#09090B]'
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
                    <div className={`transition-all duration-300 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
                      filteredFiles.length === 0 ? 'min-h-[200px] flex items-center justify-center' : ''
                    }`}>
                      {filteredFiles.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          <p className="text-sm">
                            {activeFileType
                              ? `No ${activeFileType.toLowerCase()} files found`
                              : 'No files found'}
                          </p>
                        </div>
                      ) : (
                        filteredFiles.map((file) => (
                          <div
                            key={file.id}
                            onClick={() => handleFileSelect(file)}
                            className="flex items-center rounded-lg bg-[#F4F4F5] dark:bg-[#27272A] dark:border-[#27272A] border border-gray-200 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && handleFileSelect(file)}
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
                              ) : file.type === "XLSX" || file.type === "XLS" ? (
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
                              ) : file.type === "JPG" || file.type === "JPEG" || file.type === "PNG" || file.type === "GIF" ? (
                                <img
                                  src="/Files/JPG-icon.svg"
                                  alt="Image"
                                  className="max-w-[44px] max-h-[44px] object-contain"
                                />
                              ) : file.type === "MP3" || file.type === "WAV" || file.type === "AAC" ? (
                                <img
                                  src="/Files/MP3-icon.svg"
                                  alt="Audio"
                                  className="max-w-[44px] max-h-[44px] object-contain"
                                />
                              ) : file.type === "ZIP" || file.type === "RAR" || file.type === "7Z" ? (
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
                              <p className="truncate text-sm font-medium">{file.name}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="overflow-hidden bg-white dark:bg-[#09090B]">
                      {filteredFiles.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">
                            {activeFileType
                              ? `No ${activeFileType.toLowerCase()} files found`
                              : 'No files found'}
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Table Header */}
                          <div className="grid grid-cols-[32px_1fr_40px] sm:grid-cols-[40px_1fr_50px] md:grid-cols-[40px_1fr_120px_120px_50px] gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 py-3 bg-gray-50 border-b dark:border-[#3F3F46] border-gray-200 text-xs font-medium text-gray-500 tracking-wider dark:text-[#A1A1AA] dark:bg-[#09090B] ">
                            <div></div>
                            <div>Name</div>
                            <div className="hidden md:block">Size</div>
                            <div className="hidden md:block">Date Created</div>
                            <div></div>
                          </div>

                          {/* Table Rows */}
                          <div className="divide-y divide-gray-100 dark:divide-[#3F3F46]">
                            {filteredFiles.length === 0 ? (
                              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p className="text-sm">
                                  {activeFileType
                                    ? `No ${activeFileType.toLowerCase()} files found`
                                    : 'No files found'}
                                </p>
                              </div>
                            ) : (
                              filteredFiles.map((file) => {
                              const getFileIcon = () => {
                                if (file.type === "PDF") return "/Files/PDF-icon.svg";
                                if (file.type === "DOCX" || file.type === "DOC") return "/Files/Docs-icon.svg";
                                if (file.type === "XLSX" || file.type === "XLS") return "/Files/XLS-icon.svg";
                                if (file.type === "PPTX" || file.type === "PPT") return "/Files/PDF-icon.svg";
                                if (file.type === "JPG" || file.type === "JPEG" || file.type === "PNG" || file.type === "GIF") return "/Files/JPG-icon.svg";
                                if (file.type === "MP3" || file.type === "WAV" || file.type === "AAC") return "/Files/MP3-icon.svg";
                                if (file.type === "ZIP" || file.type === "RAR" || file.type === "7Z") return "/Files/ZIP-icon.svg";
                                if (file.type === "TXT") return "/Files/TXT-icon.svg";
                                return "/Files/file.svg";
                              };

                              const fileId = file.id || file.name; // Fallback to name if id is undefined

                              return (
                                <div
                                  key={fileId}
                                  onClick={() => handleFileSelect(file)}
                                  className="grid grid-cols-[32px_1fr_40px] sm:grid-cols-[40px_1fr_50px] md:grid-cols-[40px_1fr_120px_120px_50px] gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 py-2 sm:py-3 hover:bg-gray-50 dark:hover:bg-[#27272A] cursor-pointer transition-colors items-center"
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => e.key === "Enter" && handleFileSelect(file)}
                                >
                                  {/* Checkbox */}
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedFiles.has(fileId)}
                                      onChange={(e) => toggleFileSelection(fileId, e as any)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                                    />
                                  </div>

                                  {/* Icon and Name */}
                                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <img
                                      src={getFileIcon()}
                                      alt={file.type}
                                      className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] md:h-[20px] md:w-[20px] flex-shrink-0 object-contain"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                      <p className="text-[10px] sm:text-xs text-gray-500 md:hidden dark:text-white">{formatFileSize(file.size || 0)}</p>
                                    </div>
                                  </div>

                                  {/* Size - Hidden on mobile */}
                                  <div className="hidden md:block text-sm text-gray-500 dark:text-white">
                                    {formatFileSize(file.size || 0)}
                                  </div>

                                  {/* Date Created - Hidden on mobile */}
                                  <div className="hidden md:block text-sm text-gray-500 dark:text-white">
                                    {formatDate(file.uploadedAt || new Date())}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Open menu for file:", file.name);
                                      }}
                                      className="p-1 sm:p-1.5 text-gray-500 hover:text-gray-900 dark:text-white dark:hover:bg-[#27272A] hover:bg-gray-100 rounded transition-colors"
                                      title="More actions"
                                    >
                                      <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

            </section>

            {/* Bottom spacer */}
            <div className="h-8 sm:h-8" aria-hidden="true"></div>
          </div>
        </main>

        {/* AI Chat Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-[#09090B] border-l border-gray-200 dark:border-[#3F3F46] shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isAIChatOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46]">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm font-medium dark:text-white text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 p-0 m-0 w-full"
            />
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  searchInputRef.current?.focus();
                }}
                className="p-1 text-gray-500 dark:text-white hover:text-gray-700 transition-colors"
                aria-label="Edit search query"
                type="button"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  router.push('/Dashboard/chat');
                }}
                className="p-1 text-gray-500 dark:text-white hover:text-gray-700 transition-colors"
                aria-label="Maximize chat"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsAIChatOpen(false)}
                className="p-1 text-gray-500 dark:text-white hover:text-gray-700 transition-colors"
                aria-label="Close AI chat"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
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
                  onClick={() => setIsAIChatOpen(true)}
                  className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 transition-all duration-200 flex items-center justify-center z-30 hover:scale-110"
                  aria-label="Open AI chat"
                >
                  <Image
                    src={Logomark}
                    alt="Tequity AI"
                    width={56}
                    height={56}
                    className="flex-shrink-0"
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
          onMaximizeChange={(isMaximized) => setIsPDFMaximized(isMaximized)}
        />
      </div>
    </>
  );
}

export default function LibraryPage() {
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

  const handleFileUpload = (newFiles: FileItem[], newFolders: UploadedFolder[]) => {
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
