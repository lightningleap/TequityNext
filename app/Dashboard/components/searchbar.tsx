"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FileItem } from "./filegrid";
import { useRef, useEffect } from "react";
import { SearchDropdown } from "./SearchDropdown";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onClick?: () => void;
  onFileSelect?: (file: FileItem) => void;
  onFolderSelect?: (folder: { id: string; name: string; fileCount: number }) => void;
  searchResults?: Array<{
    id: string;
    name: string;
    type: string;
    isFolder: boolean;
    fileCount?: number;
    size?: number;
    uploadedAt?: Date;
    url?: string;
  }>;
  isSearchFocused?: boolean;
  onSearchFocus?: (focused: boolean) => void;
  files?: FileItem[];
  folders?: Array<{ id: string; name: string; fileCount: number }>;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  onFocus,
  onClick,
  onFileSelect,
  onFolderSelect,
  isSearchFocused = false,
  onSearchFocus,
  files = [],
  folders = [],
}: SearchBarProps) {
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onSearchFocus?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onSearchFocus]);

  // Handle selection from SearchDropdown
  const handleSelect = (item: { name: string; type: string }) => {
    console.log("SearchDropdown item selected:", item);
    if (item.type === 'folder') {
      // Find the corresponding folder and call onFolderSelect
      const folder = folders.find(f => f.name === item.name);
      if (folder && onFolderSelect) {
        onFolderSelect(folder);
      }
    } else {
      // Find the corresponding file and call onFileSelect
      const file = files.find(f => f.name === item.name);
      if (file && onFileSelect) {
        onFileSelect(file as FileItem);
      }
    }
    onSearchFocus?.(false);
  };

  return (
    <div className="max-auto w-full max-w-6xl relative" ref={searchRef}>
      <div className="flex items-center gap-2 bg-muted px-3 py-2 w-full max-w-[794px] h-[36px] dark:bg-[#27272A] rounded-md">
        <Search
          className="size-4 text-muted-foreground flex-shrink-0"
          aria-hidden="true"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-none px-2 text-sm placeholder:text-muted-foreground focus-visible:ring-0 dark:bg-[#27272A] dark:text-white rounded-none shadow-none"
          aria-label="Search files"
          onClick={onClick}
          onFocus={() => {
            onFocus?.();
            onSearchFocus?.(true);
          }}
        />
      </div>
      
      {/* Use SearchDropdown component */}
      <SearchDropdown
        isOpen={isSearchFocused}
        searchQuery={value}
        onSelect={handleSelect}
        files={files}
        folders={folders}
      />
    </div>
  );
}
