"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FolderItem {
  id: number;
  name: string;
  icon: string;
}

interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
}

// Helper function to get file icon based on file type
const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return '/Files/PDF-icon.svg';
    case 'doc':
    case 'docx':
      return '/Files/Docs-icon.svg';
    case 'xls':
    case 'xlsx':
      return '/Files/XLS-icon.svg';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '/Files/JPG-icon.svg';
    case 'mp3':
    case 'wav':
    case 'aac':
      return '/Files/MP3-icon.svg';
    case 'zip':
    case 'rar':
    case '7z':
      return '/Files/ZIP-icon.svg';
    case 'txt':
      return '/Files/TXT-icon.svg';
    default:
      return '/file.svg';
  }
};

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Sample data for categories (folders)
  const allCategories: FolderItem[] = [
    { id: 1, name: "Documents", icon: "/Folder.svg" },
    { id: 2, name: "Projects", icon: "/Folder.svg" },
    { id: 3, name: "Archives", icon: "/Folder.svg" },
  ];

  // Sample data for files
  const allFiles: FileItem[] = [
    { id: 1, name: "Project_Overview.pdf", type: "pdf", size: "2.4 MB" },
    { id: 2, name: "Meeting_Notes.docx", type: "docx", size: "1.2 MB" },
    { id: 3, name: "Financial_Report.xlsx", type: "xlsx", size: "3.8 MB" },
    { id: 4, name: "Presentation.mp3", type: "mp3", size: "5.1 MB" },
    { id: 5, name: "Contract_Draft.pdf", type: "pdf", size: "890 KB" },
  ];

  // Filter categories and files based on search query
  const filteredCategories = allCategories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = allFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if there are any search results
  const hasResults = filteredCategories.length > 0 || filteredFiles.length > 0;
  const hasSearchQuery = searchQuery.trim() !== '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[485px] md:w-[485px] lg:w-[485px] h-[70vh] sm:h-[368px] max-w-[95vw] max-h-[90vh] p-0 overflow-hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [&>button]:top-3 [&>button]:right-3 sm:[&>button]:top-4 sm:[&>button]:right-4 rounded-none dark:bg-[#09090B] dark:border-[#3F3F46] dark:border">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search for files and folders</DialogDescription>
        <div className="space-y-0 h-full flex flex-col overflow-hidden">
          {/* Search Input with Icon */}
          <div className="flex items-center gap-2 mt-3 sm:gap-3 border-b dark:border-[#3F3F46] px-3 sm:px-4 py-2 sm:py-2.5 focus-within:border-gray-400 transition-colors flex-shrink-0">
            <CiSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-white flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-xs sm:text-sm outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400"
              autoFocus
            />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 sm:space-y-4 py-3 sm:py-4">
            {!hasSearchQuery || hasResults ? (
            <>
              {/* Categories Section - Only show if there are matching categories or no search query */}
              {(filteredCategories.length > 0 || !hasSearchQuery) && (
                <div className="space-y-1.5 sm:space-y-2 px-3 sm:px-4">
                  <h3 className="text-[15px] sm:text-xs font-semibold text-[#71717A] tracking-wide">Categories</h3>
                  <div className="space-y-0.5 sm:space-y-1">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <button
                          key={category.id}
                          className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors text-left dark:bg-[#09090B] dark:text-white"
                        >
                          <Image
                            src={category.icon}
                            alt={category.name}
                            width={16}
                            height={16}
                            className="flex-shrink-0 sm:w-5 sm:h-5"
                          />
                          <span className="text-sm sm:text-sm text-gray-900 dark:text-white">{category.name}</span>
                        </button>
                      ))
                    ) : hasSearchQuery ? null : (
                      allCategories.map((category) => (
                        <button
                          key={category.id}
                          className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-100 transition-colors text-left dark:bg-[#09090B] dark:text-white"
                        >
                          <Image
                            src={category.icon}
                            alt={category.name}
                            width={16}
                            height={16}
                            className="flex-shrink-0 sm:w-5 sm:h-5"
                          />
                          <span className="text-xs sm:text-sm text-gray-900 dark:text-white">{category.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Files Section - Only show if there are matching files or no search query */}
              {(filteredFiles.length > 0 || !hasSearchQuery) && (
                <div className="space-y-1.5 sm:space-y-2 px-3 sm:px-4">
                  <h3 className="text-[15px] sm:text-xs font-semibold text-[#71717A] tracking-wide">Files</h3>
                  <div className="space-y-0.5 sm:space-y-1">
                    {filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <button
                          key={file.id}
                          className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#27272A] dark:text-white transition-colors text-left"
                        >
                          <Image
                            src={getFileIcon(file.name)}
                            alt={file.type}
                            width={16}
                            height={16}
                            className="flex-shrink-0 sm:w-5 sm:h-5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-sm text-gray-900 truncate dark:text-white ">{file.name}</p>
                          </div>
                        </button>
                      ))
                    ) : hasSearchQuery ? null : (
                      allFiles.map((file) => (
                        <button
                          key={file.id}
                          className="w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-100 transition-colors text-left"
                        >
                          <Image
                            src={getFileIcon(file.name)}
                            alt={file.type}
                            width={16}
                            height={16}
                            className="flex-shrink-0 sm:w-5 sm:h-5"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-gray-900 truncate dark:text-white">{file.name}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Show when there's a search query but no results
            <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-gray-500 px-4">
              <p className="text-xs sm:text-sm text-black dark:text-white">No results found.</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 dark:text-white">Try different keywords</p>
            </div>
          )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
