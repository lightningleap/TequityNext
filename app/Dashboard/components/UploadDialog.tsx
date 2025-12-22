/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { FiUploadCloud } from "react-icons/fi";
import { FileItem } from "./filegrid";
import PdfIcon from "../../../public/Files/PDF-icon.svg";
import XlsIcon from "../../../public/Files/XLS-icon.svg";
import PptIcon from "../../../public/Files/PPT-icon.svg";
import PngIcon from "../../../public/Files/PNG-icon.svg";
import JpgIcon from "../../../public/Files/JPG-icon.svg";
import DocsIcon from "../../../public/Files/Docs-icon.svg";
import Mp3Icon from "../../../public/Files/MP3-icon.svg";
import TxtIcon from "../../../public/Files/TXT-icon.svg";
import SvgIcon from "../../../public/Files/SVG-icon.svg";
import ZipIcon from "../../../public/Files/ZIP-icon.svg";
import PlusIcon from "../../../public/uploadModal/Icon.svg";
import { X, CheckCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import { UploadGraphic } from "./UploadGraphic";
import { toast } from "sonner";
import { useFiles } from "../context/FilesContext";

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return <Image src={PdfIcon} alt="PDF" className="w-12 h-12" />;
    case "docx":
    case "doc":
      return <Image src={DocsIcon} alt="Document" className="w-12 h-12" />;
    case "xlsx":
    case "xls":
    case "csv":
      return <Image src={XlsIcon} alt="Spreadsheet" className="w-12 h-12" />;
    case "pptx":
    case "ppt":
      return <Image src={PptIcon} alt="Presentation" className="w-12 h-12" />;
    case "png":
      return <Image src={PngIcon} alt="PNG Image" className="w-12 h-12" />;
    case "jpg":
    case "jpeg":
      return <Image src={JpgIcon} alt="JPEG Image" className="w-12 h-12" />;
    case "svg":
      return <Image src={SvgIcon} alt="SVG" className="w-12 h-12" />;
    case "mp4":
    case "mov":
    case "mp3":
      return <Image src={Mp3Icon} alt="Media" className="w-12 h-12" />;
    case "txt":
      return <Image src={TxtIcon} alt="Text" className="w-12 h-12" />;
    case "zip":
      return <Image src={ZipIcon} alt="Archive" className="w-12 h-12" />;
    default:
      return <Image src={DocsIcon} alt="File" className="w-12 h-12" />;
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

  // Get upload function and current dataroom from context
  const { uploadFile, currentDataroom, refreshFiles } = useFiles();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      // Automatically start uploading new files
      setTimeout(() => startUpload(newFiles, files.length), 100);
    }
  };

  const retryUpload = (fileIndex: number) => {
    const fileToRetry = files[fileIndex];
    if (!fileToRetry) return;

    setUploadProgress((prev) => ({
      ...prev,
      [fileIndex]: 0,
    }));
    setUploadStatus((prev) => ({
      ...prev,
      [fileIndex]: "pending",
    }));

    startUpload([fileToRetry], fileIndex);
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

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
        // Automatically start uploading dropped files
        setTimeout(() => startUpload(droppedFiles, files.length), 100);
      }
    },
    [files.length]
  );

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };

  const startUpload = async (filesToUpload: File[], startIndex: number) => {
    if (!currentDataroom) {
      toast.error("Please select a dataroom first");
      return;
    }

    const initialStatus: Record<number, UploadStatus> = {};
    filesToUpload.forEach((_, index) => {
      const actualIndex = startIndex + index;
      initialStatus[actualIndex] = "uploading";
    });
    setUploadStatus((prev) => ({ ...prev, ...initialStatus }));

    for (let i = 0; i < filesToUpload.length; i++) {
      const actualIndex = startIndex + i;
      const file = filesToUpload[i];

      try {
        // Show initial progress
        setUploadProgress((prev) => ({
          ...prev,
          [actualIndex]: 10,
        }));

        // Actually upload the file to the backend
        const success = await uploadFile(file, currentDataroom.id);

        if (success) {
          setUploadProgress((prev) => ({
            ...prev,
            [actualIndex]: 100,
          }));
          setUploadStatus((prev) => ({
            ...prev,
            [actualIndex]: "success",
          }));
        } else {
          setUploadStatus((prev) => ({
            ...prev,
            [actualIndex]: "error",
          }));
        }
      } catch (error) {
        console.error("Upload error:", error);
        setUploadStatus((prev) => ({
          ...prev,
          [actualIndex]: "error",
        }));
      }
    }
  };

  const handleUpload = async () => {
    const failedFiles = files.filter(
      (_, index) => uploadStatus[index] === "error"
    );
    const pendingFiles = files.filter(
      (_, index) => uploadStatus[index] === "pending"
    );

    if (failedFiles.length > 0 || pendingFiles.length > 0) {
      return;
    }

    const successfulFiles = files.filter(
      (_, index) => uploadStatus[index] === "success"
    );

    // Files are already uploaded to the backend via startUpload
    // Just refresh the files list and close the dialog
    if (successfulFiles.length > 0) {
      await refreshFiles();
      toast.success(`${successfulFiles.length} file(s) uploaded successfully`);
    }

    // Reset and close
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
        <div onClick={() => setIsOpen(true)}>
          <button className="flex items-center gap-2 bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-gray-200 dark:hover:bg-[#27272A] dark:hover:text-white text-gray-700 dark:text-white hover:text-gray-900 transition-colors px-3 py-3 rounded-md dark:border-gray-700 cursor-pointer ">
            <FiUploadCloud className="h-4 w-4 dark:text-white" />
            Upload
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-32px)] max-w-[352px] h-[400px] sm:w-[560px] sm:max-w-[560px] p-[16px] border border-[#E2E8F0] dark:border-[#27272A] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] flex flex-col">
        <DialogTitle className="sr-only">Upload Files</DialogTitle>
        <div className="flex flex-col items-center w-full h-full">
          {/* Header */}
          <div className="flex flex-row items-center gap-3 w-full h-9 mb-0 shrink-0">
            <h2 className="flex-1 font-['Inter'] font-medium text-[20px] leading-[28px] tracking-[-0.12px] text-[#020617] dark:text-white">
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
                className={`relative flex items-center justify-center ${
                  isDragging ? "opacity-70" : ""
                }`}
              >
                <UploadGraphic />
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center items-center gap-1.5 w-full">
                <p className="font-['Inter'] font-medium text-2xl leading-8 tracking-[-0.006em] text-[#09090B] dark:text-white">
                  {isDragging ? (
                    "Drop files here"
                  ) : (
                    <>
                      <span className="sm:hidden">Select or Paste</span>
                      <span className="hidden sm:inline">Drop or Select</span>
                    </>
                  )}
                </p>
                <p className="font-['Inter'] font-normal text-sm leading-5 text-center text-[#71717A] w-full dark:text-white">
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
            accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.pptx,.ppt,.png,.jpg,.jpeg,.svg,.mp4,.mov,.mp3,.txt,.zip"
          />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            {...({
              webkitdirectory: "",
              directory: "",
            } as React.InputHTMLAttributes<HTMLInputElement>)}
          />

          {files.length > 0 && (
            <div className="flex flex-col gap-[16px] w-full flex-1 overflow-hidden">
              {/* Files Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-[12px] w-full overflow-y-auto flex-1 pr-2 scrollbar-hide">
                {files.map((file, index) => {
                  const status = uploadStatus[index] || "pending";
                  const progress = uploadProgress[index] || 0;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-start p-[12px] gap-[8px] bg-white border border-[#E2E8F0] rounded-xl relative h-[140px] dark:bg-[#18181B] dark:border-[#3F3F46] transition-colors duration-200 hover:bg-[#F8FAFC] hover:border-[#CBD5F6] dark:hover:bg-[#27272A] dark:hover:border-[#52525B] ${
                        status === "uploading" ? "overflow-hidden" : ""
                      }`}
                    >
                      {/* Progress bar background for uploading state */}
                      {status === "uploading" && (
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-[#F4F4F5] transition-all duration-300 dark:bg-[#3F3F46]/40"
                          style={{ width: `${progress}%` }}
                        />
                      )}

                      <div className="flex flex-col justify-center items-start gap-[12px] w-full relative z-10">
                        {/* File icon and action button */}
                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="w-12 h-12 flex-shrink-0">
                            {getFileIcon(file.name)}
                          </div>

                          {status === "pending" && (
                            <button
                              type="button"
                              className="flex items-center justify-center w-[40px] h-[36px] rounded-md hover:bg-gray-100 dark:hover:bg-[#27272A]"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                            >
                              <X className="h-4 w-4 text-[#020617] dark:text-white" />
                            </button>
                          )}
                          {status === "success" && (
                            <button
                              type="button"
                              className="flex items-center justify-center w-[40px] h-[36px] rounded-md hover:bg-gray-100 dark:hover:bg-[#27272A]"
                              onClick={() => removeFile(index)}
                            >
                              <CheckCircle className="h-4 w-4 text-[#008A2E] dark:text-[#4ADE80]" />
                            </button>
                          )}
                          {status === "error" && (
                            <button
                              type="button"
                              className="flex items-center justify-center w-[40px] h-[36px] rounded-md hover:bg-gray-100 dark:hover:bg-[#27272A]"
                              onClick={() => removeFile(index)}
                            >
                              <RefreshCw className="h-4 w-4 text-[#020617] dark:text-white" />
                            </button>
                          )}
                        </div>

                        {/* File info */}
                        <div className="flex flex-col items-start gap-[4px] w-full">
                          <p className="font-['Inter'] font-medium text-[12px] leading-[20px] text-[#020617] dark:text-white line-clamp-2 w-full overflow-ellipsis overflow-hidden">
                            {file.name}
                          </p>
                          <p
                            className={`font-['Inter'] font-normal text-[10px] leading-[14px] w-full ${
                              status === "error"
                                ? "text-[#E60000] dark:text-[#FF6B6B]"
                                : "text-[#64748B] dark:text-[#A1A1AA]"
                            }`}
                          >
                            {status === "error"
                              ? "Upload failed try again"
                              : `${(file.size / (1024 * 1024)).toFixed(1)}MB`}
                          </p>
                          {status === "error" && (
                            <button
                              type="button"
                              onClick={() => retryUpload(index)}
                              className="text-[11px] font-semibold text-[#E60000] dark:text-[#FF6B6B] underline-offset-2 hover:underline"
                            >
                              Upload failed try again
                            </button>
                          )}
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
                    className="flex flex-col justify-center items-center p-[12px] gap-[8px] bg-[#FAFAFA] rounded-xl hover:bg-gray-200 transition-colors h-[140px] cursor-pointer border border-[#E2E8F0] dark:bg-[#18181B] dark:border-[#3F3F46] dark:hover:bg-[#3F3F46]/60 hover:border-[#CBD5F6] dark:hover:border-[#52525B]"
                  >
                    <Image
                      src={PlusIcon}
                      alt="Add files"
                      className="w-10 h-10"
                    />
                    <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#020617] dark:text-white">
                      Add files
                    </p>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Fixed Bottom Button Area */}
          {files.length > 0 && (
            <div className="flex-shrink-0 mt-auto pt-4 w-full">
              <Button
                className="w-full h-10 cursor-pointer bg-zinc-900 text-white rounded-lg font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[-0.084px] hover:bg-zinc-800"
                onClick={handleUpload}
                disabled={files.some(
                  (_, index) =>
                    uploadStatus[index] === "uploading" ||
                    uploadStatus[index] === "error"
                )}
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
