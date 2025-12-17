"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FileItem {
  id?: string;
  name: string;
  type: string;
  size?: number;
  uploadedAt?: Date;
  url?: string;
  hasText?: boolean;
  files?: FileItem[];
}

interface FolderItem {
  id: string;
  name: string;
  fileCount?: number;
}

interface FilesContextType {
  files: FileItem[];
  folders: FolderItem[];
  setFiles: (files: FileItem[]) => void;
  setFolders: (folders: FolderItem[]) => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);

  return (
    <FilesContext.Provider value={{ files, folders, setFiles, setFolders }}>
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
}

export function useFilesOptional() {
  return useContext(FilesContext);
}
