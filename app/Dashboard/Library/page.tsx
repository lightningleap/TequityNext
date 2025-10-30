"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, X, Search, ChevronsRight, Maximize2, Edit } from "lucide-react";
import { FileGrid, FileItem } from "../components/filegrid";
import { SearchBar } from "../components/searchbar";
import { FileCard } from "../components/filecard";
import { UploadDialog, FolderItem as UploadedFolder } from "../components/UploadDialog";
import { LuClock } from "react-icons/lu";
import { IoGridOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { Folder, FileText, Clock, FilePlus, Download, RefreshCw, ChevronUp, Sparkles } from "lucide-react";
import { ChatInterface } from "../components/ChatInterface";
import { DashboardLayout } from "../components/DashboardLayout";
import { PDFViewer } from "../components/PDFViewer";
import { useChatContext } from "../context/ChatContext";
import { useSidebar } from "@/components/ui/sidebar";
import redFolder from "../assets/redFolder.svg";
import yellowFolder from "../assets/yellowFolder.svg";
import blackFolder from "../assets/blackFolder.svg";
// import blueFolder from "";

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
  const [searchQuery, setSearchQuery] = useState('Search Query');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isPDFMaximized, setIsPDFMaximized] = useState(false);
  const [activeFileType, setActiveFileType] = useState<string | null>(null);

  // File type mapping for filtering
  const fileTypeMap: Record<string, string[]> = {
    'Documents': ['PDF', 'DOCX', 'TXT', 'PPTX'],
    'Photos': ['JPG', 'JPEG', 'PNG', 'GIF', 'SVG'],
    'Videos': ['MP4', 'MOV', 'AVI', 'WMV'],
    'Compressed ZIPs': ['ZIP', 'RAR', '7Z', 'TAR', 'GZ'],
    'Audio': ['MP3', 'WAV', 'AAC', 'OGG', 'WMA'],
    'Excel': ['XLSX', 'XLS', 'CSV']
  };

  // Filter files based on active tab with memoization for better performance
  const filteredFiles = activeFileType
    ? files.filter(file => {
      const fileExt = file.name.split('.').pop()?.toUpperCase();
      return fileTypeMap[activeFileType]?.includes(fileExt || '');
    })
    : files;

  // Get count of files for each tab
  const getFileCount = (tab: string) => {
    if (tab === 'All Files') return;
    return files.filter(file => {
      const fileExt = file.name.split('.').pop()?.toUpperCase();
      return fileTypeMap[tab]?.includes(fileExt || '');
    }).length;
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
          className="flex-1 overflow-y-auto overflow-x-hidden p-6 flex justify-center transition-all duration-300 scroll-smooth"
          style={{
            scrollbarGutter: 'stable',
            marginRight: getMainMargin()
          }}
        >
          <div className="w-[792px]">
            <header className="mb-8 flex flex-col items-start justify-start gap-12">
              <SearchBar />
            </header>

            <section aria-labelledby="recently-visited" className="mb-10">
              <h2
                id="recently-visited"
                className="mb-6 flex gap-2 text-sm font-medium text-muted-foreground"
              >
                <LuClock className="size-4 text-muted-foreground" />
                Recently visited
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center w-[180px] h-[161.59px] rounded-lg border border-gray-200 bg-[#F4F4F5] hover:bg-gray-50 cursor-pointer transition-colors text-center pt-5 px-3 pb-3">
                  <div className="flex items-center justify-center mb-4">
                    <img src="/blueFolder.svg" alt="Recent Files" className="h-[75.59px] w-[75.48px]" />
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-900">Opened 3 hours ago</p>
                    <p className="text-xs text-muted-foreground mt-1">5 items</p>
                  </div>
                </div>

                <div className="flex flex-col items-center w-[180px] h-[161.59px] rounded-lg border border-gray-200 bg-[#F4F4F5] hover:bg-gray-50 cursor-pointer transition-colors text-center pt-5 px-3 pb-3">
                  <div className="flex items-center justify-center mb-4">
                    <img src="/blackFolder.svg" alt="Created Files" className="h-[75.59px] w-[75.48px]" />
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-xs text-muted-foreground mt-1">12 documents</p>
                  </div>
                </div>

                <div className="flex flex-col items-center w-[180px] h-[161.59px] rounded-lg border border-gray-200 bg-[#F4F4F5] hover:bg-gray-50 cursor-pointer transition-colors text-center pt-5 px-3 pb-3">
                  <div className="flex items-center justify-center mb-4">
                    <img src="/yellowFolder.svg" alt="Received Files" className="h-[75.59px] w-[75.48px]" />
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-900">Received</p>
                    <p className="text-xs text-muted-foreground mt-1">8 folders</p>
                  </div>
                </div>

                <div className="flex flex-col items-center w-[180px] h-[161.59px] rounded-lg border border-gray-200 bg-[#F4F4F5] hover:bg-gray-50 cursor-pointer transition-colors text-center pt-5 px-3 pb-3">
                  <div className="flex items-center justify-center mb-4">
                    <img src="/redFolder.svg" alt="Updated Files" className="h-[75.59px] w-[75.48px]" />
                  </div>
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-900">Updated</p>
                    <p className="text-xs text-muted-foreground mt-1">15 files</p>
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="all-folders" className="space-y-4 mb-10">
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
                  <button
                    onClick={() => setFolderView("grid")}
                    className={`p-1.5 rounded transition-colors ${folderView === "grid"
                        ? "text-foreground bg-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-gray-200"
                      }`}
                    aria-label="Grid view"
                  >
                    <IoGridOutline className="size-4" />
                  </button>
                  <button
                    onClick={() => setFolderView("list")}
                    className={`p-1.5 rounded transition-colors ${folderView === "list"
                        ? "text-foreground bg-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-gray-200"
                      }`}
                    aria-label="List view"
                  >
                    <FaListUl className="size-4" />
                  </button>
                </div>
              </div>

              {foldersExpanded && (
                <div
                  className={
                    folderView === "grid"
                      ? "grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                      : "flex flex-col gap-2"
                  }
                >
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      onClick={() => handleFolderSelect(folder)}
                      className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3 hover:bg-muted/80 cursor-pointer transition-colors"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && handleFolderSelect(folder)}
                    >
                      <img src="/Folder.svg" alt="Updated Files" className="h-[20px] w-[20px]" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{folder.name}</p>
                        {/* <p className="text-xs text-muted-foreground">
                            {folder.fileCount} files
                          </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section aria-labelledby="all-files" className="space-y-4">
              <div className="flex items-center justify-between">
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

                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
                  <button
                    onClick={() => setFileView("grid")}
                    className={`p-1.5 rounded transition-colors ${fileView === "grid"
                        ? "text-foreground bg-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-gray-200"
                      }`}
                    aria-label="Grid view"
                  >
                    <IoGridOutline className="size-4" />
                  </button>
                  <button
                    onClick={() => setFileView("list")}
                    className={`p-1.5 rounded transition-colors ${fileView === "list"
                        ? "text-foreground bg-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-gray-200"
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
                  <div className="flex items-center gap-2 bg-white py-4 overflow-x-auto pb-4 scrollbar-hide">
                    <button
                      onClick={() => setActiveFileType(null)}
                      className={`shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        activeFileType === null
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 border border-gray-200 bg-white hover:border-gray-300'
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
                          className={`shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 border border-gray-200 bg-white hover:border-gray-300'
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

                  <div
                    className={`transition-all duration-300 ${
                      fileView === "grid"
                        ? "grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                        : "flex flex-col gap-2"
                    } ${
                      filteredFiles.length === 0 ? 'min-h-[200px] flex items-center justify-center' : ''
                    }`}
                  >
                    {filteredFiles.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">
                          {activeFileType 
                            ? `No ${activeFileType.toLowerCase()} files found` 
                            : 'No files found'}
                        </p>
                      </div>
                    )}
                    {(filteredFiles.length > 0 ? filteredFiles : files).map((file) => (
                      <div
                        key={file.id}
                        onClick={() => handleFileSelect(file)}
                        className="flex items-center rounded-lg bg-[#F4F4F5] border border-gray-200 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleFileSelect(file)}
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          {file.type === "PDF" ? (
                            <div className="w-24 h-24 flex items-center justify-center">
                              <img
                                src="/Files/PDF-icon.svg"
                                alt="PDF"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            </div>
                          ) : file.type === "DOCX" || file.type === "DOC" ? (
                            <div className="w-24 h-24 flex items-center justify-center">
                              <img
                                src="/Files/Docs-icon.svg"
                                alt="Document"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            </div>
                          ) : file.type === "XLSX" || file.type === "XLS" ? (
                            <div className="w-24 h-24 flex items-center justify-center">
                              <img
                                src="/Files/XLS-icon.svg"
                                alt="Spreadsheet"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            </div>
                          ) : file.type === "PPTX" || file.type === "PPT" ? (
                            <div className="w-24 h-24 flex items-center justify-center">
                              <img
                                src="/Files/PDF-icon.svg"
                                alt="Presentation"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            </div>
                          ) : file.type === "JPG" || file.type === "JPEG" || file.type === "PNG" || file.type === "GIF" ? (
                            <div className="w-24 h-24 flex items-center justify-center">
                              <img
                                src="/Files/JPG-icon.svg"
                                alt="Image"
                                className="max-w-[44px] max-h-[44px] object-contain"
                              />
                            </div>
                          ) : file.type === "MP3" || file.type === "WAV" || file.type === "AAC" ? (
                            <div className="w-24 h-24 flex items-center justify-center">
                              <img
                                src="/Files/MP3-icon.svg"
                                alt="Audio"
                                className="max-w-[44px] max-h-[44px] object-contain"
                              />
                            </div>
                          ) : file.type === "ZIP" || file.type === "RAR" || file.type === "7Z" ? (
                            <div className="w-24 h-24 flex items-center justify-center">
                              <img
                                src="/Files/ZIP-icon.svg"
                                alt="Archive"
                                className="max-w-[44px] max-h-[44px] object-contain"
                              />
                            </div>
                          ) : file.type === "TXT" ? (
                            <div className="w-24 h-24 flex items-center justify-center">
                              <img
                                src="/Files/TXT-icon.svg"
                                alt="Text"
                                className="max-w-[44px] max-h-[44px] object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 flex items-center justify-center">
                              <img
                                src="/Files/file.svg"
                                alt="File"
                                className="max-w-[34px] max-h-[34px] object-contain"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 ml-2">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          {/* <p className="text-xs text-muted-foreground">
                            {file.size
                              ? `${(file.size / 1024).toFixed(0)} KB`
                              : "Unknown size"}
                          </p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </section>
          </div>
        </main>

        {/* AI Chat Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-[400px] bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isAIChatOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm font-medium text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 p-0 m-0 w-full"
            />
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  searchInputRef.current?.focus();
                }}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Edit search query"
                type="button"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  router.push('/Dashboard/chat');
                }}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Maximize chat"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsAIChatOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
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
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center z-30 hover:scale-110"
            aria-label="Open AI chat"
          >
            <Sparkles className="h-6 w-6" />
          </button>
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
