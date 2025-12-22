import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "pdf" | "doc" | "xls" | "ppt" | "txt";
  section: string;
}

interface SearchDropdownProps {
  isOpen: boolean;
  searchQuery: string;
  onSelect: (item: FileItem) => void;
  files?: Array<{
    id?: string;
    name: string;
    type: string;
  }>;
  folders?: Array<{
    id: string;
    name: string;
    fileCount: number;
  }>;
}

const fileIcons = {
  folder: (
    <div className="flex-shrink-0 relative" style={{ width: "30px", height: "30px" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-5 h-5 relative">
          {/* Light mode icon */}
          <div className="dark:hidden">
            <Image
              src="/white-folder.svg"
              alt="Folder"
              fill
              className="object-contain"
              style={{ filter: 'brightness(0) invert(0)' }}
            />
          </div>
          {/* Dark mode icon */}
          <div className="hidden dark:block">
            <Image
              src="/white-folder.svg"
              alt="Folder"
              fill
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  pdf: (
    <div
      className="flex-shrink-0 relative"
      style={{ width: "30px", height: "30px" }}
    >
      <Image
        src="/Files/PDF-icon.svg"
        alt="PDF"
        width={30}
        height={30}
        className="object-contain"
      />
    </div>
  ),
  doc: (
    <div
      className="flex-shrink-0 relative"
      style={{ width: "30px", height: "30px" }}
    >
      <Image
        src="/Files/Docs-icon.svg"
        alt="DOC"
        width={30}
        height={30}
        className="object-contain"
      />
    </div>
  ),
  xls: (
    <div 
      className="flex-shrink-0 relative"
      style={{ width: "30px", height: "30px" }}
    >
      <Image
        src="/Files/XLS-icon.svg"
        alt="XLS"
        width={30}
        height={30}
        className="object-contain"
      />
    </div>
  ),
  ppt: (
    <div
      className="flex-shrink-0 relative"
      style={{ width: "30px", height: "30px" }}
    >
      <Image
        src="/Files/PPT-icon.svg"
        alt="PPT"
        width={30}
        height={30}
        className="object-contain"
      />
    </div>
  ),
  txt: (
    <div
      className="flex-shrink-0 relative"
      style={{ width: "30px", height: "30px" }}
    >
      <Image
        src="/Files/TXT-icon.svg"
        alt="TXT"
        width={30}
        height={30}
        className="object-contain"
      />
    </div>
  ),
};

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  searchQuery,
  onSelect,
  files = [],
  folders = [],
}) => {
  // Convert files and folders to the format expected by SearchDropdown
  const allItems: FileItem[] = [
    ...folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      type: 'folder' as const,
      section: 'Categories'
    })),
    ...files.map(file => {
      // Map file type to the expected format
      const fileType = file.type.toLowerCase();
      let mappedType: "pdf" | "doc" | "xls" | "ppt" | "txt" = "txt";
      
      if (fileType.includes('pdf')) mappedType = "pdf";
      else if (fileType.includes('doc')) mappedType = "doc";
      else if (fileType.includes('xls') || fileType.includes('csv')) mappedType = "xls";
      else if (fileType.includes('ppt')) mappedType = "ppt";
      else if (fileType.includes('txt')) mappedType = "txt";
      
      return {
        id: file.id || file.name,
        name: file.name,
        type: mappedType,
        section: 'Files'
      };
    })
  ];

  // Filter items based on search query if it exists
  const filteredItems = searchQuery
    ? allItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allItems; // Show all items when search input is focused but no query

  // Group items by section
  const itemsBySection = filteredItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, FileItem[]>);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-1 w-full max-w-[792px] max-h-[480px]",
        "bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden",
        "dark:bg-[#09090B] dark:border-[#3F3F46]",
        "border border-gray-200 dark:border-gray-800"
      )}
    >
      <div className="overflow-y-auto max-h-[480px]">
        {Object.entries(itemsBySection).map(([section, sectionItems]) => (
          <div
            key={section}
            className="border-b border-gray-100 last:border-b-0"
          >
            <div className="px-4 py-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider px-3 py-1.5">
                {section}
              </div>
              <div className="mt-1 max-h-48 overflow-y-auto">
                {sectionItems.map((item) => (
                  <button
                    key={item.id}
                    className={cn(
                      "w-full px-3 py-1 text-left text-sm flex items-center gap-3",
                      "hover:bg-gray-100 dark:hover:bg-[#27272A] hover:rounded-md",
                      "focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800",
                      "transition-colors duration-150",
                      "text-gray-900 dark:text-gray-100"
                    )}
                    onClick={() => onSelect(item)}
                  >
                    {fileIcons[item.type]}
                    <span className="truncate">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-black dark:text-gray-400">
            No results found 
          </div>
        )}
      </div>
    </div>
  );
};
