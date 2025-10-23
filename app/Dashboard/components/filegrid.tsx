import { FileType } from "lucide-react";

const formatFileSize = (bytes: number = 0): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export type FileItem = {
  name: string;
  type: "PDF" | "DOCX" | "XLSX" | "PPTX" | "PNG" | "MP4" | "CSV" | "TXT";
  size?: number;
  uploadedAt?: Date;
  id?: string;
};

const typeTone: Record<FileItem["type"], string> = {
  PDF: "bg-[oklch(var(--destructive))]/15 text-[oklch(var(--destructive))]",
  DOCX: "bg-[oklch(var(--chart-2))]/15 text-[oklch(var(--chart-2))]",
  XLSX: "bg-[oklch(var(--chart-5))]/15 text-[oklch(var(--chart-5))]",
  PPTX: "bg-[oklch(var(--chart-4))]/15 text-[oklch(var(--chart-4))]",
  PNG: "bg-[oklch(var(--chart-3))]/15 text-[oklch(var(--chart-3))]",
  MP4: "bg-accent text-accent-foreground",
  CSV: "bg-secondary text-secondary-foreground",
  TXT: "bg-muted text-muted-foreground",
};

interface FileGridProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}
export function FileGrid({ files, onFileSelect }: FileGridProps) {
  const handleFileClick = (file: FileItem) => {
    console.log("File clicked:", file);
    onFileSelect(file);
  };
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => handleFileClick(file)}
          className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 hover:bg-muted/80 cursor-pointer transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleFileClick(file)}
        >
          <span
            className={`rounded px-2 py-0.5 text-[10px] ${typeTone[file.type]}`}
          >
            {file.type}
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
