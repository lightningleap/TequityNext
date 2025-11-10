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
  folders?: Array<{ id: string; name: string; fileCount?: number }>;
  files?: Array<{ id?: string; name: string; type: string; size?: number }>;
}

interface CategoryItem {
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

// File icons mapping to match SearchDropdown
const fileIcons = {
  folder: (
    <div className="w-4 h-4 flex-shrink-0 relative" style={{ width: "16px", height: "16px" }}>
      <Image
        src="/Folder.svg"
        alt="Folder"
        width={16}
        height={16}
        className="object-contain"
      />
    </div>
  ),
  pdf: (
    <div className="w-4 h-4 flex-shrink-0 relative" style={{ width: "16px", height: "16px" }}>
      <Image
        src="/Files/PDF-icon.svg"
        alt="PDF"
        width={16}
        height={16}
        className="object-contain"
      />
    </div>
  ),
  doc: (
    <div className="w-4 h-4 flex-shrink-0 relative" style={{ width: "16px", height: "16px" }}>
      <Image
        src="/Files/Docs-icon.svg"
        alt="DOC"
        width={16}
        height={16}
        className="object-contain"
      />
    </div>
  ),
  xls: (
    <div className="w-4 h-4 flex-shrink-0 relative">
      <Image
        src="/Files/XLS-icon.svg"
        alt="XLS"
        fill
        sizes="16px"
        className="object-contain"
      />
    </div>
  ),
  ppt: (
    <div className="w-4 h-4 flex-shrink-0 relative" style={{ width: "16px", height: "16px" }}>
      <Image
        src="/Files/PPT-icon.svg"
        alt="PPT"
        width={16}
        height={16}
        className="object-contain"
      />
    </div>
  ),
  txt: (
    <div className="w-4 h-4 flex-shrink-0 relative" style={{ width: "16px", height: "16px" }}>
      <Image
        src="/Files/TXT-icon.svg"
        alt="TXT"
        width={16}
        height={16}
        className="object-contain"
      />
    </div>
  ),
} as const;

// Helper function to get file icon based on file type
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return fileIcons.pdf;
    case 'doc':
    case 'docx':
      return fileIcons.doc;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return fileIcons.xls;
    case 'ppt':
    case 'pptx':
      return fileIcons.ppt;
    case 'txt':
      return fileIcons.txt;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'image':
      return fileIcons.folder; // Using folder icon as fallback for images
    case 'mp3':
    case 'wav':
    case 'aac':
    case 'ogg':
    case 'wma':
    case 'audio':
      return fileIcons.folder; // Using folder icon as fallback for audio
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
    case 'archive':
      return fileIcons.folder; // Using folder icon as fallback for archives
    default:
      return fileIcons.folder; // Default to folder icon
  }
};

export function SearchDialog({ open, onOpenChange, folders = [], files = [] }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Convert folders to categories format
  const categories: CategoryItem[] = folders.length > 0
    ? folders.map((folder, index) => ({
        id: index + 1,
        name: folder.name,
        icon: "/Folder.svg",
      }))
    : [
        { id: 1, name: "Legal Agreements", icon: "/Folder.svg" },
        { id: 2, name: "Financial Statements", icon: "/Folder.svg" },
        { id: 3, name: "Team & HR Docs", icon: "/Folder.svg" },
      ];

  // Helper function to format file size
  const formatSize = (bytes?: number): string => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  // Convert files to display format
  const allFiles: FileItem[] = files.length > 0
    ? files.map((file, index) => ({
        id: index + 1,
        name: file.name,
        type: file.type.toLowerCase(),
        size: formatSize(file.size),
      }))
    : [
        { id: 1, name: "Q4_Financial_Report.pdf", type: "pdf", size: "2.4 MB" },
        { id: 2, name: "Client_Proposal_Template.docx", type: "docx", size: "1.2 MB" },
        { id: 3, name: "Sales_Data_Analysis.xlsx", type: "xlsx", size: "3.8 MB" },
        { id: 4, name: "2023_Marketing_Strategy.pptx", type: "pptx", size: "5.1 MB" },
        { id: 5, name: "Project_Management_Guide.txt", type: "txt", size: "890 KB" },
      ];

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter files based on search query
  const filteredFiles = allFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (file.type && file.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Check if there are any search results
  const hasSearchQuery = searchQuery.trim() !== '';
  const hasResults = filteredCategories.length > 0 || filteredFiles.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[480px] md:w-[480px] lg:w-[480px] h-auto max-h-[85vh] sm:max-h-[650px] max-w-[95vw] p-0 overflow-hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [&>button]:top-3 [&>button]:right-3 sm:[&>button]:top-4 sm:[&>button]:right-4 rounded-lg dark:bg-[#09090B] dark:border-[#3F3F46] dark:border">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search for files and folders</DialogDescription>

        <div className="h-full flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b dark:border-[#3F3F46] px-4 py-3 focus-within:border-gray-400 transition-colors">
              <CiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 text-sm outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400"
                autoFocus
              />
            </div>

            {/* Categories Section with Folder Icons */}
            {filteredCategories.length > 0 && (
              <div className="px-4 py-4 border-b dark:border-[#3F3F46]">
                <h3 className="text-xs font-medium text-[#71717A] dark:text-gray-400 mb-2">Categories</h3>
                <div className="space-y-1">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors text-left"
                    >
                      {fileIcons.folder}
                      <span className="text-sm text-gray-900 dark:text-white">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Files Section or No Results */}
            {hasSearchQuery && !hasResults ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-sm text-gray-900 dark:text-white">No results found.</p>
              </div>
            ) : filteredFiles.length > 0 ? (
              <div className="px-4 py-4">
                <h3 className="text-xs font-medium text-[#71717A] dark:text-gray-400 mb-2">Files</h3>
                <div className="space-y-1">
                  {filteredFiles.map((file) => (
                    <button
                      key={file.id}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors text-left"
                    >
                      <div className="flex-shrink-0">
                        {getFileIcon(file.type || file.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white truncate">{file.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
