"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { FiUploadCloud } from "react-icons/fi";
import { FileItem } from "./filegrid";

import {
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  File,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
type FileType =
  | "PDF"
  | "DOCX"
  | "XLSX"
  | "PPTX"
  | "PNG"
  | "MP4"
  | "CSV"
  | "TXT";

export interface FolderItem {
  id: string;
  name: string;
  fileCount: number;
}

interface UploadDialogProps {
  onUpload: (files: FileItem[], folders: FolderItem[]) => void;
}

type UploadStatus = "pending" | "uploading" | "success" | "error";

export function UploadDialog({ onUpload }: UploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>(
    {}
  );
  const [uploadStatus, setUploadStatus] = useState<Record<number, UploadStatus>>(
    {}
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"files" | "folder">("files");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleUploadProgress = (fileIndex: number, progress: number) => {
    setUploadProgress((prev) => ({
      ...prev,
      [fileIndex]: progress,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    // Track status locally
    const statusMap: Record<number, UploadStatus> = {};

    // Set all files to uploading status
    const initialStatus: Record<number, UploadStatus> = {};
    files.forEach((_, index) => {
      initialStatus[index] = "uploading";
      statusMap[index] = "uploading";
    });
    setUploadStatus(initialStatus);

    // Upload each file with simulated progress
    for (let index = 0; index < files.length; index++) {
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress((prev) => ({
            ...prev,
            [index]: progress,
          }));
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // All uploads succeed
        statusMap[index] = "success";
        setUploadStatus((prev) => ({
          ...prev,
          [index]: "success",
        }));
      } catch (error) {
        statusMap[index] = "error";
        setUploadStatus((prev) => ({
          ...prev,
          [index]: "error",
        }));
      }
    }

    // Wait a bit to show the final status
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Only upload successful files using local statusMap
    const successfulFiles = files.filter((_, index) => statusMap[index] === "success");
    const failedFiles = files.filter((_, index) => statusMap[index] === "error");

    // If there are any failed files, don't close the dialog
    if (failedFiles.length > 0) {
      setIsUploading(false);
      return;
    }

    let fileItems: FileItem[] = [];
    let folderItems: FolderItem[] = [];

    if (uploadMode === "folder") {
      // Group files by folder
      const folderMap = new Map<string, File[]>();

      successfulFiles.forEach((file) => {
        const path = (file as any).webkitRelativePath || file.name;
        const pathParts = path.split("/");

        if (pathParts.length > 1) {
          const folderName = pathParts[0];
          if (!folderMap.has(folderName)) {
            folderMap.set(folderName, []);
          }
          folderMap.get(folderName)!.push(file);
        }
      });

      // Create folder items
      folderItems = Array.from(folderMap.entries()).map(
        ([folderName, folderFiles], index) => ({
          id: `folder-${Date.now()}-${index}`,
          name: folderName,
          fileCount: folderFiles.length,
        })
      );
    } else {
      // Create file items for all successful files
      fileItems = successfulFiles.map((file, idx) => {
        const extension = file.name.split(".").pop()?.toUpperCase() || "TXT";
        const fileType = ["PDF", "DOCX", "XLSX", "PPTX", "PNG", "MP4", "CSV", "TXT"].includes(
          extension
        )
          ? (extension as FileType)
          : "TXT";

        // Create a blob URL for the file so it can be previewed
        const fileUrl = URL.createObjectURL(file);

        return {
          id: `file-${Date.now()}-${idx}`,
          name: file.name,
          type: fileType,
          size: file.size,
          uploadedAt: new Date(),
          url: fileUrl, // Add the blob URL for preview
        };
      });
    }

    // Always call onUpload with both parameters
    console.log("Upload mode:", uploadMode);
    console.log("File items:", fileItems);
    console.log("Folder items:", folderItems);
    onUpload(fileItems, folderItems);

    // Reset and close only if all uploads were successful
    setFiles([]);
    setUploadProgress({});
    setUploadStatus({});
    setIsUploading(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFiles([]);
    setUploadProgress({});
    setUploadStatus({});
    setIsUploading(false);
    setIsOpen(false);
  };

  const handleButtonClick = (mode: "files" | "folder") => {
    setUploadMode(mode);
    if (mode === "files") {
      fileInputRef.current?.click();
    } else {
      folderInputRef.current?.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-center size-9 md:w-auto md:h-9 bg-[#f1f5f9] gap-0 md:gap-2 text-[#0f172a] dark:bg-[#27272A] hover:bg-gray-200 md:px-3 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <FiUploadCloud className="h-4 w-4 dark:text-white" />
          <span className="hidden md:inline text-xs font-medium dark:text-white">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[560px] max-w-[95vw] p-4 sm:p-6 max-h-[90vh] overflow-y-auto scrollbar-hide flex items-center justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="space-y-4 sm:space-y-6 w-full">
          <DialogHeader className="text-left p-0">
            <DialogTitle className="text-base sm:text-lg">Upload Files</DialogTitle>
            <DialogDescription className="sr-only">Upload files to your library</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button
              type="button"
              onClick={() => handleButtonClick("files")}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium">Upload Files</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleButtonClick("folder")}
              className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <FiUploadCloud className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                <span className="text-xs sm:text-sm font-medium">Upload Folder</span>
              </div>
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg sm:rounded-xl text-center transition-colors w-full ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-[#E4E4E7] hover:border-gray-400"
            }`}
            style={{
              minHeight: "80px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
              boxShadow:
                "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)",
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center px-2">
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                {isDragging
                  ? "Drop files or folders here"
                  : "Or drag & drop files/folders here"}
              </p>
              <p className="text-[10px] sm:text-xs text-[#71717A] mt-1">
                Supported: PDF, DOCX, XLSX, PPTX, PNG, MP4, CSV, TXT
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,.xlsx,.pptx,.png,.mp4,.csv,.txt"
          />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            {...({ webkitdirectory: "", directory: "" } as any)}
          />

          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-medium">Files to upload</h4>
                <button
                  type="button"
                  className="text-[10px] sm:text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => setFiles([])}
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                {files.map((file, index) => {
                  const status = uploadStatus[index] || "pending";
                  const progress = uploadProgress[index] || 0;
                  const fileTypeLabel = getFileTypeLabel(file.name);

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between rounded-lg p-2 sm:p-3 ${
                        status === "error"
                          ? "border-2 border-red-500"
                          : "border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                          {fileTypeLabel}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                            {status === "uploading" && (
                              <p className="text-[10px] sm:text-xs text-blue-600">
                                • {progress}%
                              </p>
                            )}
                            {status === "error" && (
                              <p className="text-[10px] sm:text-xs text-red-600 truncate">
                                • Failed
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {status === "uploading" && (
                          <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 transform -rotate-90">
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#E5E7EB"
                                strokeWidth="2"
                                fill="none"
                                className="sm:cx-16 sm:cy-16 sm:r-14 sm:stroke-[3]"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 10}`}
                                strokeDashoffset={`${
                                  2 * Math.PI * 10 * (1 - progress / 100)
                                }`}
                                strokeLinecap="round"
                                className="transition-all duration-300 sm:cx-16 sm:cy-16 sm:r-14 sm:stroke-[3]"
                              />
                            </svg>
                          </div>
                        )}
                        {status === "success" && (
                          <>
                            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </>
                        )}
                        {status === "error" && (
                          <>
                            <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </>
                        )}
                        {status === "pending" && (
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                <Button
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  <Upload className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Upload {files.length} file{files.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getFileTypeLabel(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "PDF";
    case "docx":
    case "doc":
      return "Word";
    case "xlsx":
    case "xls":
      return "Excel";
    case "pptx":
    case "ppt":
      return "PowerPoint";
    case "png":
    case "jpg":
    case "jpeg":
      return "Image";
    case "mp4":
    case "mov":
      return "Video";
    case "txt":
      return "Text";
    case "csv":
      return "CSV";
    default:
      return "File";
  }
}

function FileTypeIcon({ fileName }: { fileName: string }) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const iconClass = "h-5 w-5 text-gray-500";

  switch (extension) {
    case "pdf":
      return <FileText className={iconClass} />;
    case "docx":
    case "doc":
      return <FileText className={iconClass} />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className={iconClass} />;
    case "png":
    case "jpg":
    case "jpeg":
      return <ImageIcon className={iconClass} />;
    default:
      return <File className={iconClass} />;
  }
}
