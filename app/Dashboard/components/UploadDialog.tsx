/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { FiUploadCloud } from "react-icons/fi";
import { FileItem } from "./filegrid";
import PdfIcon from "../../../public/uploadModal/File Type Icon.svg";
import XlsIcon from "../../../public/uploadModal/File Type Icon-2.svg";
import FolderIcon from "../../../public/uploadModal/File Type Icon-1.svg";
import PlusIcon from "../../../public/uploadModal/Icon.svg";
import {
  X,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return <Image src={PdfIcon} alt="PDF" className="w-8 h-8" />;
    case "docx":
    case "doc":
      return <Image src={FolderIcon} alt="Document" className="w-8 h-8" />;
    case "xlsx":
    case "xls":
    case "csv":
      return <Image src={XlsIcon} alt="Spreadsheet" className="w-8 h-8" />;
    case "pptx":
    case "ppt":
      return <Image src={FolderIcon} alt="Presentation" className="w-8 h-8" />;
    case "png":
    case "jpg":
    case "jpeg":
      return <Image src={FolderIcon} alt="Image" className="w-8 h-8" />;
    case "mp4":
    case "mov":
      return <Image src={FolderIcon} alt="Video" className="w-8 h-8" />;
    case "txt":
      return <Image src={FolderIcon} alt="Text" className="w-8 h-8" />;
    case "zip":
      return <Image src={FolderIcon} alt="Archive" className="w-8 h-8" />;
    default:
      return <Image src={FolderIcon} alt="File" className="w-8 h-8" />;
  }
}

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
  const [uploadStatus, setUploadStatus] = useState<
    Record<number, UploadStatus>
  >({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"files" | "folder">("files");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);



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
    const successfulFiles = files.filter(
      (_, index) => statusMap[index] === "success"
    );
    const failedFiles = files.filter(
      (_, index) => statusMap[index] === "error"
    );

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

      successfulFiles.forEach((file : File) => {
        // webkitRelativePath is available on File objects from directory inputs
        const path = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
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
        const fileType = [
          "PDF",
          "DOCX",
          "XLSX",
          "PPTX",
          "PNG",
          "MP4",
          "CSV",
          "TXT",
        ].includes(extension)
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
      <DialogContent className="w-[calc(100vw-32px)] max-w-[352px] h-[400px] sm:w-[560px] sm:max-w-[560px] p-[16px] overflow-y-auto scrollbar-hide border border-[#E2E8F0] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center w-full h-full">
          {/* Header */}
          <div className="flex flex-row items-center gap-3 w-full h-9 mb-0">
            <h2 className="flex-1 font-['Inter'] font-medium text-[20px] leading-[28px] tracking-[-0.12px] text-[#020617]">
              Upload
            </h2>
            <DialogDescription className="sr-only">
              Upload files to your library
            </DialogDescription>
          </div>

          {/* Upload Area - Only show when no files */}
          {files.length === 0 && (
            <div
              className="flex flex-col justify-center items-center flex-1 w-full p-6 gap-5 rounded-xl cursor-pointer"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => handleButtonClick("files")}
            >
              {/* Graphic - Custom File Icons */}
              <div
                className={`relative flex items-center justify-center group ${
                  isDragging ? "opacity-70" : ""
                }`}
              >
                <div className="relative flex items-center gap-3 transition-all duration-300 group-hover:gap-5">
                  <Image
                    src={PdfIcon}
                    alt="PDF"
                    className="w-[70px] h-[70px] -rotate-[20deg] transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-2"
                  />
                  <Image
                    src={FolderIcon}
                    alt="Folder"
                    className="w-[60px] h-[60px] transition-all duration-300 group-hover:scale-110"
                  />
                  <Image
                    src={XlsIcon}
                    alt="Excel"
                    className="w-[70px] h-[70px] rotate-[20deg] transition-all duration-300 group-hover:scale-110 group-hover:translate-x-2"
                  />
                </div>
                <div className="absolute top-[20px] transition-all duration-300 group-hover:scale-110">
                  <Image src={PlusIcon} alt="Add" className="w-[60px] h-[60px]" />
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center items-center gap-1.5 w-full">
                <p className="font-['Inter'] font-medium text-2xl leading-8 tracking-[-0.006em] text-[#09090B]">
                  {isDragging ? "Drop files here" : <><span className="sm:hidden">Select or Paste</span><span className="hidden sm:inline">Drop or Select</span></>}
                </p>
                <p className="font-['Inter'] font-normal text-sm leading-5 text-center text-[#71717A] w-full">
                  {isDragging
                    ? "Release to upload"
                    : "Files, Folders, or .zip Archives"}
                </p>
              </div>
            </div>
          )}
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
            {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
          />

          {files.length > 0 && (
            <div className="flex flex-col gap-[16px] w-full flex-1">
              {/* Files Grid */}
              <div className="grid grid-cols-3 grid-rows-2 gap-[12px] w-full overflow-y-auto flex-1">
                {files.map((file, index) => {
                  const status = uploadStatus[index] || "pending";
                  const progress = uploadProgress[index] || 0;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-start p-[12px] gap-[8px] bg-white border border-[#E2E8F0] rounded-xl relative h-[126px] ${
                        status === "uploading" ? "overflow-hidden" : ""
                      }`}
                    >
                      {/* Progress bar background for uploading state */}
                      {status === "uploading" && (
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-[#F4F4F5] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      )}

                      <div className="flex flex-col justify-center items-start gap-[12px] w-full relative z-10">
                        {/* File icon and action button */}
                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="w-8 h-8 flex-shrink-0">
                            {getFileIcon(file.name)}
                          </div>

                          {status === "pending" && (
                            <button
                              type="button"
                              className="flex items-center justify-center w-[40px] h-[36px] rounded-md hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                            >
                              <X className="h-4 w-4 text-[#020617]" />
                            </button>
                          )}
                          {status === "success" && (
                            <button
                              type="button"
                              className="flex items-center justify-center w-[40px] h-[36px] rounded-md hover:bg-gray-100"
                              onClick={() => removeFile(index)}
                            >
                              <CheckCircle className="h-4 w-4 text-[#008A2E]" />
                            </button>
                          )}
                          {status === "error" && (
                            <button
                              type="button"
                              className="flex items-center justify-center w-[40px] h-[36px] rounded-md hover:bg-gray-100"
                              onClick={() => removeFile(index)}
                            >
                              <RefreshCw className="h-4 w-4 text-[#020617]" />
                            </button>
                          )}
                        </div>

                        {/* File info */}
                        <div className="flex flex-col items-start gap-[4px] w-full">
                          <p className="font-['Inter'] font-medium text-[12px] leading-[20px] text-[#020617] line-clamp-2 w-full overflow-ellipsis overflow-hidden">
                            {file.name}
                          </p>
                          <p className={`font-['Inter'] font-normal text-[10px] leading-[14px] w-full ${
                            status === "error" ? "text-[#E60000]" : "text-[#64748B]"
                          }`}>
                            {status === "error"
                              ? "Upload failed try again"
                              : `${(file.size / (1024 * 1024)).toFixed(1)}MB`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add files card - only show if less than 6 files */}
                {files.length < 6 && (
                  <button
                    type="button"
                    onClick={() => handleButtonClick("files")}
                    className="flex flex-col justify-center items-center p-[12px] gap-[8px] bg-[#FAFAFA] rounded-xl hover:bg-gray-200 transition-colors h-[126px]"
                  >
                    <Image src={PlusIcon} alt="Add files" className="w-10 h-10" />
                    <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#020617]">
                      Add files
                    </p>
                  </button>
                )}
              </div>

              {/* Done Button */}
              <Button
                className="w-full h-10 bg-[#020617] text-white rounded-lg font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.084px] hover:bg-[#020617]/90"
                onClick={handleUpload}
                disabled={isUploading}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
