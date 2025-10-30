"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
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
          className="flex items-center bg-[#F4F4F5] gap-2 text-black hover:bg-[#F4F4F5]"
          onClick={() => setIsOpen(true)}
        >
          <FiUploadCloud className="h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[560px] p-6">
        <div className="space-y-6">
          <DialogHeader className="text-left p-0">
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>

          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleButtonClick("files")}
              className="flex-1 py-3 px-4 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium">Upload Files</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleButtonClick("folder")}
              className="flex-1 py-3 px-4 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <FiUploadCloud className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium">Upload Folder</span>
              </div>
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl text-center transition-colors w-full ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-[#E4E4E7] hover:border-gray-400"
            }`}
            style={{
              minHeight: "100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow:
                "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)",
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {isDragging
                  ? "Drop files or folders here"
                  : "Or drag & drop files/folders here"}
              </p>
              <p className="text-xs text-[#71717A] mt-1">
                Supported formats: PDF, DOCX, XLSX, PPTX, PNG, MP4, CSV, TXT
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
                <h4 className="text-sm font-medium">Files to upload</h4>
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => setFiles([])}
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {files.map((file, index) => {
                  const status = uploadStatus[index] || "pending";
                  const progress = uploadProgress[index] || 0;
                  const fileTypeLabel = getFileTypeLabel(file.name);

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        status === "error"
                          ? "border-2 border-red-500"
                          : "border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {fileTypeLabel}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                            {status === "uploading" && (
                              <p className="text-xs text-blue-600">
                                • Uploaded {progress}%
                              </p>
                            )}
                            {status === "error" && (
                              <p className="text-xs text-red-600">
                                • Upload failed. Please try again.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === "uploading" && (
                          <div className="relative w-8 h-8">
                            <svg className="w-8 h-8 transform -rotate-90">
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                stroke="#E5E7EB"
                                strokeWidth="3"
                                fill="none"
                              />
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                stroke="#3B82F6"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 14}`}
                                strokeDashoffset={`${
                                  2 * Math.PI * 14 * (1 - progress / 100)
                                }`}
                                strokeLinecap="round"
                                className="transition-all duration-300"
                              />
                            </svg>
                          </div>
                        )}
                        {status === "success" && (
                          <>
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {status === "error" && (
                          <>
                            <XCircle className="h-6 w-6 text-red-600" />
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {status === "pending" && (
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
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
