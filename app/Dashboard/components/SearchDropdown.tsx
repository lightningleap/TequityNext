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
}

const fileIcons = {
  folder: (
    <div
      className="w-4 h-4 flex-shrink-0 relative"
      style={{ width: "16px", height: "16px" }}
    >
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
    <div
      className="w-4 h-4 flex-shrink-0 relative"
      style={{ width: "16px", height: "16px" }}
    >
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
    <div
      className="w-4 h-4 flex-shrink-0 relative"
      style={{ width: "16px", height: "16px" }}
    >
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
    <div
      className="w-4 h-4 flex-shrink-0 relative"
      style={{ width: "16px", height: "16px" }}
    >
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
    <div
      className="w-4 h-4 flex-shrink-0 relative"
      style={{ width: "16px", height: "16px" }}
    >
      <Image
        src="/Files/TXT-icon.svg"
        alt="TXT"
        width={16}
        height={16}
        className="object-contain"
      />
    </div>
  ),
};

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  searchQuery,

  onSelect,
}) => {
  // Sample data - replace with your actual data
  const files: FileItem[] = [
    { id: "1", name: "Legal Agreements", type: "folder", section: "Folders" },
    {
      id: "2",
      name: "Financial Statements",
      type: "folder",
      section: "Folders",
    },
    { id: "3", name: "Team & HR Docs", type: "folder", section: "Folders" },
    { id: "4", name: "Q4_Financial_Report.pdf", type: "pdf", section: "Files" },
    {
      id: "5",
      name: "Client_Proposal_Template.docx",
      type: "doc",
      section: "Files",
    },
    {
      id: "6",
      name: "Sales_Data_Analysis.xlsx",
      type: "xls",
      section: "Files",
    },
    {
      id: "7",
      name: "2023_Marketing_Strategy.pptx",
      type: "ppt",
      section: "Files",
    },
    {
      id: "8",
      name: "Project_Management_Guide.txt",
      type: "txt",
      section: "Files",
    },
  ];

  // Filter files based on search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group files by section
  const filesBySection = filteredFiles.reduce((acc, file) => {
    if (!acc[file.section]) {
      acc[file.section] = [];
    }
    acc[file.section].push(file);
    return acc;
  }, {} as Record<string, FileItem[]>);

  if (!isOpen || !searchQuery) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-1 w-full max-w-[792px] max-h-[328px]",
        "bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden",
        "dark:bg-[#09090B] dark:border-[#3F3F46]",
        "border border-gray-200 dark:border-gray-800"
      )}
    >
      <div className="overflow-y-auto max-h-[320px]">
        {Object.entries(filesBySection).map(([section, sectionFiles]) => (
          <div
            key={section}
            className="border-b border-gray-800 last:border-b-0"
          >
            <div className="px-4 py-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-1.5">
                {section}
              </div>
              <div className="mt-1">
                {sectionFiles.map((file) => (
                  <button
                    key={file.id}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm flex items-center gap-3",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      "focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800",
                      "transition-colors duration-150",
                      "text-gray-900 dark:text-gray-100"
                    )}
                    onClick={() => onSelect(file)}
                  >
                    {fileIcons[file.type]}
                    <span className="truncate">{file.name}</span>
                    <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                      {file.type.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredFiles.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No results found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
};
