// "use client";

// import { useState, useRef, useCallback } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../../components/ui/dialog";
// import { Button } from "../../../components/ui/button";
// import { FaCloudUploadAlt } from "react-icons/fa";
// import { X, Upload } from "lucide-react";

// type FileType = "PDF" | "DOCX" | "XLSX" | "PPTX" | "PNG";

// export interface FileItem {
//   name: string;
//   type: FileType;
//   size?: number;
//   uploadedAt?: Date;
// }

// export function UploadDialog() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [files, setFiles] = useState<File[]>([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState<Record<number, number>>(
//     {}
//   );
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleUploadProgress = (fileIndex: number, progress: number) => {
//     setUploadProgress((prev) => ({
//       ...prev,
//       [fileIndex]: progress,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//     }
//   };

//   const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   }, []);

//   const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);

//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const droppedFiles = Array.from(e.dataTransfer.files);
//       setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
//     }
//   }, []);

//   const removeFile = (index: number) => {
//     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//     setUploadProgress((prev) => {
//       const newProgress = { ...prev };
//       delete newProgress[index];
//       return newProgress;
//     });
//   };

//   const uploadFile = (file: File, index: number) => {
//     return new Promise((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
//       const formData = new FormData();
//       formData.append("file", file);

//       xhr.upload.onprogress = (event) => {
//         if (event.lengthComputable) {
//           const progress = Math.round((event.loaded * 100) / event.total);
//           handleUploadProgress(index, progress);
//         }
//       };

//       xhr.onload = () => {
//         if (xhr.status >= 200 && xhr.status < 300) {
//           resolve(xhr.response);
//         } else {
//           reject(new Error("Upload failed"));
//         }
//       };

//       xhr.onerror = () => reject(new Error("Upload failed"));
//       xhr.open("POST", "your-upload-endpoint", true);
//       xhr.send(formData);
//     });
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) return;

//     try {
//       const uploadPromises = files.map((file, index) =>
//         uploadFile(file, index)
//       );
//       await Promise.all(uploadPromises);
//       setFiles([]);
//       setUploadProgress({});
//       setIsOpen(false);
//     } catch (error) {
//       console.error("Upload failed:", error);
//     }
//   };

//   const handleButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button
//           className="flex items-center gap-2"
//           onClick={() => setIsOpen(true)}
//         >
//           <FaCloudUploadAlt className="h-4 w-4" />
//           Upload
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-[560px] p-6">
//         <div className="space-y-6">
//           <DialogHeader className="text-left p-0">
//             <DialogTitle>Upload Files</DialogTitle>
//           </DialogHeader>

//           <div
//             className={`border-2 border-dashed rounded-xl text-center transition-colors w-full ${
//               isDragging
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-[#E4E4E7] hover:border-gray-400"
//             }`}
//             style={{
//               minHeight: "145px",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               boxShadow:
//                 "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)",
//             }}
//             onDragOver={handleDragOver}
//             onDragEnter={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             onClick={handleButtonClick}
//           >
//             <div className="flex flex-col items-center gap-2">
//               <div className="w-10 h-10 rounded-full bg-[#FAFAFA] flex items-center justify-center">
//                 <FaCloudUploadAlt className="h-5 w-5 text-gray-900" />
//               </div>
//               <div className="text-center">
//                 <p className="text-sm font-medium text-gray-900">
//                   {isDragging
//                     ? "Drop files here"
//                     : "Drag & drop files here, or click to select"}
//                 </p>
//                 <p className="text-xs text-[#71717A] mt-1">
//                   Supported formats: PDF, DOCX, XLSX,
//                 </p>
//               </div>
//             </div>
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               onChange={handleFileChange}
//               className="hidden"
//               accept=".pdf,.docx,.xlsx"
//             />
//           </div>

//           {files.length > 0 && (
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <h4 className="text-sm font-medium">Files to upload</h4>
//                 <button
//                   type="button"
//                   className="text-xs text-gray-500 hover:text-gray-700"
//                   onClick={() => setFiles([])}
//                 >
//                   Clear all
//                 </button>
//               </div>
//               <div className="space-y-2 max-h-40 overflow-y-auto">
//                 {files.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
//                   >
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900 truncate">
//                         {file.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {(file.size / 1024).toFixed(1)} KB
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {uploadProgress[index] !== undefined && (
//                         <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-blue-500 transition-all duration-300"
//                             style={{ width: `${uploadProgress[index]}%` }}
//                           />
//                         </div>
//                       )}
//                       <button
//                         type="button"
//                         className="text-gray-400 hover:text-red-500 p-1"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           removeFile(index);
//                         }}
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end gap-3 pt-2">
//             <Button
//               variant="outline"
//               className="w-[200px] flex items-center gap-2"
//               onClick={() => {
//                 setFiles([]);
//                 setUploadProgress({});
//                 setIsOpen(false);
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleUpload}
//               disabled={
//                 files.length === 0 ||
//                 Object.values(uploadProgress).some((p) => p > 0 && p < 100)
//               }
//               className="w-[200px] flex items-center gap-2"
//             >
//               {Object.values(uploadProgress).some((p) => p > 0 && p < 100)
//                 ? "Uploading..."
//                 : `Upload ${files.length > 0 ? `(${files.length})` : ""}`}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
// In UploadDialog.tsx
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
import { FaCloudUploadAlt } from "react-icons/fa";
import { FileItem } from "./filegrid";

import {
  X,
  Upload,
  Image as ImageIcon,

  FileText,
  File,
  FileSpreadsheet,
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

interface UploadDialogProps {
  onUpload: (files: FileItem[]) => void;
}

export function UploadDialog({ onUpload }: UploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>(
    {}
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        files.forEach((_, index) => {
          const currentProgress = uploadProgress[index] || 0;
          if (currentProgress < 90) {
            handleUploadProgress(index, currentProgress + 10);
          }
        });
      }, 100);

      // Simulate upload completion after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      clearInterval(progressInterval);
      
      // Complete all uploads to 100%
      files.forEach((_, index) => {
        handleUploadProgress(index, 100);
      });

      // Convert File[] to FileItem[] and call onUpload
      const fileItems: FileItem[] = files.map(file => {
        const extension = file.name.split('.').pop()?.toUpperCase() || 'TXT';
        const fileType = 
          ["PDF", "DOCX", "XLSX", "PPTX", "PNG", "MP4", "CSV", "TXT"].includes(extension)
            ? (extension as FileType)
            : 'TXT';
            
        return {
          name: file.name,
          type: fileType,
          size: file.size,
          uploadedAt: new Date()
        };
      });
      
      onUpload(fileItems);
      setFiles([]);
      setUploadProgress({});
      setIsOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <FaCloudUploadAlt className="h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[560px] p-6">
        <div className="space-y-6">
          <DialogHeader className="text-left p-0">
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>

          <div
            className={`border-2 border-dashed rounded-xl text-center transition-colors w-full ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-[#E4E4E7] hover:border-gray-400"
            }`}
            style={{
              minHeight: "145px",
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
            onClick={handleButtonClick}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#FAFAFA] flex items-center justify-center">
                <FaCloudUploadAlt className="h-5 w-5 text-gray-900" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  {isDragging
                    ? "Drop files here"
                    : "Drag & drop files here, or click to select"}
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
          </div>

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
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-gray-100 p-2">
                        <FileTypeIcon fileName={file.name} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-4"
                onClick={handleUpload}
                disabled={Object.values(uploadProgress).some((p) => p < 100)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload {files.length} file{files.length !== 1 ? "s" : ""}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FileTypeIcon({ fileName }: { fileName: string }) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const iconClass = "h-5 w-5 text-gray-500";

  switch (extension) {
    case "pdf":
      return <FileText className={iconClass} />;
    case "docx":
      return <FileText className={iconClass} />;
    case "xlsx":
      return <FileSpreadsheet className={iconClass} />;

    default:
      return <File className={iconClass} />;
  }
}
