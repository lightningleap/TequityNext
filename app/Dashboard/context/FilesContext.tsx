"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { filesApi, dataroomsApi, type FileItem as ApiFileItem, type Dataroom } from "@/lib/api";

interface FileItem {
  id?: string;
  name: string;
  type: string;
  size?: number;
  uploadedAt?: Date;
  url?: string;
  hasText?: boolean;
  files?: FileItem[];
  isStarred?: boolean;
}

interface FolderItem {
  id: string;
  name: string;
  fileCount?: number;
}

interface FilesContextType {
  files: FileItem[];
  folders: FolderItem[];
  datarooms: Dataroom[];
  currentDataroom: Dataroom | null;
  isLoading: boolean;
  error: string | null;
  setFiles: (files: FileItem[]) => void;
  setFolders: (folders: FolderItem[]) => void;
  setCurrentDataroom: (dataroom: Dataroom | null) => void;
  refreshFiles: () => Promise<void>;
  refreshDatarooms: () => Promise<void>;
  uploadFile: (file: File, dataroomId: string, folderId?: string) => Promise<boolean>;
  deleteFile: (fileId: string) => Promise<boolean>;
  toggleStarFile: (fileId: string) => Promise<boolean>;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

// Convert API file to local file format
function mapApiFileToLocal(apiFile: ApiFileItem): FileItem {
  const ext = apiFile.name.split('.').pop()?.toUpperCase() || '';
  return {
    id: apiFile.id,
    name: apiFile.name,
    type: ext,
    size: apiFile.size,
    uploadedAt: new Date(apiFile.createdAt),
    url: apiFile.path,
    isStarred: apiFile.isStarred,
  };
}

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [datarooms, setDatarooms] = useState<Dataroom[]>([]);
  const [currentDataroom, setCurrentDataroom] = useState<Dataroom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch datarooms
  const refreshDatarooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dataroomsApi.list();
      if (response.success && response.data) {
        setDatarooms(response.data);
        // Auto-select first dataroom if none selected
        if (!currentDataroom && response.data.length > 0) {
          setCurrentDataroom(response.data[0]);
        }
      } else {
        setError(response.error || 'Failed to fetch datarooms');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch datarooms');
    } finally {
      setIsLoading(false);
    }
  }, [currentDataroom]);

  // Fetch files for current dataroom
  const refreshFiles = useCallback(async () => {
    if (!currentDataroom) {
      setFiles([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await filesApi.list({ dataroomId: currentDataroom.id });
      if (response.success && response.data) {
        setFiles(response.data.map(mapApiFileToLocal));
      } else {
        setError(response.error || 'Failed to fetch files');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  }, [currentDataroom]);

  // Upload file
  const uploadFile = useCallback(async (file: File, dataroomId: string, folderId?: string): Promise<boolean> => {
    try {
      const response = await filesApi.upload({ file, dataroomId, folderId });
      if (response.success) {
        await refreshFiles();
        return true;
      }
      setError(response.error || 'Failed to upload file');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      return false;
    }
  }, [refreshFiles]);

  // Delete file
  const deleteFile = useCallback(async (fileId: string): Promise<boolean> => {
    try {
      const response = await filesApi.delete(fileId);
      if (response.success) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        return true;
      }
      setError(response.error || 'Failed to delete file');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
      return false;
    }
  }, []);

  // Toggle star file
  const toggleStarFile = useCallback(async (fileId: string): Promise<boolean> => {
    try {
      const response = await filesApi.toggleStar(fileId);
      if (response.success && response.data) {
        setFiles(prev => prev.map(f =>
          f.id === fileId ? { ...f, isStarred: response.data?.isStarred } : f
        ));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Load datarooms on mount
  useEffect(() => {
    refreshDatarooms();
  }, []);

  // Load files when dataroom changes
  useEffect(() => {
    if (currentDataroom) {
      refreshFiles();
    }
  }, [currentDataroom?.id]);

  return (
    <FilesContext.Provider value={{
      files,
      folders,
      datarooms,
      currentDataroom,
      isLoading,
      error,
      setFiles,
      setFolders,
      setCurrentDataroom,
      refreshFiles,
      refreshDatarooms,
      uploadFile,
      deleteFile,
      toggleStarFile,
    }}>
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
