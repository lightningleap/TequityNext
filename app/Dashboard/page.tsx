"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarMenuItems } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileGrid, FileItem } from "./components/filegrid";
import { SearchBar } from "./components/searchbar";
import { FileCard } from "./components/filecard";
import { UploadDialog } from "./components/UploadDialog";
import CompanyLogo from "@/public/CompanyLogo.svg";
import Image from "next/image";
import { LuClock } from "react-icons/lu";
import { IoGridOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
export default function DashboardPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeItem] = useState("Library");

  const handleFileUpload = (newFiles: FileItem[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  const handleFileSelect = (file: FileItem) => {
    console.log("File selected:", file);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800/50 dark:bg-[#111111]">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Breadcrumb />
            <Button variant="ghost" className="flex items-center gap-2">
              {activeItem}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <UploadDialog onUpload={handleFileUpload} />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
          <Sidebar
            side="left"
            variant="sidebar"
            collapsible="icon"
            className="flex-shrink-0"
          >
            <div className="flex items-center gap-3 px-4 py-2">
              <Image
                src={CompanyLogo}
                alt="Company Logo"
                width={32}
                height={32}
                priority
                className="flex-shrink-0"
              />
              <p className="text-balance text-xl font-semibold tracking-tight whitespace-nowrap">
                LLA&apos;s DATAROOM
              </p>
            </div>
            <SidebarMenuItems />
            <hr className="my-4" />
          </Sidebar>

          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-6xl">
              <header className="mb-8 flex flex-col items-start justify-start gap-12 h-[6px]max-w-6xl">
                <SearchBar />
              </header>

              <section aria-labelledby="recently-visited" className="mb-10">
                <h2
                  id="recently-visited"
                  className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground"
                >
                  <LuClock className="size-4 text-muted-foreground" />
                  Recently visited
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  <FileCard title="Documents" meta="24 files" tone="blue" />
                  <FileCard title="Images" meta="156 files" tone="amber" />
                  <FileCard title="Videos" meta="12 files" tone="red" />
                </div>
              </section>

              <section aria-labelledby="all-files" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground">
                      All Folders
                    </h2>
                    <div className="flex items-center gap-3 mr-72">
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <IoGridOutline className="size-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <FaListUl className="size-4" />
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground">
                      All Files
                    </h2>
                    <div className="flex items-center gap-3 mr-72">
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <IoGridOutline className="size-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <FaListUl className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <FileGrid files={files} onFileSelect={handleFileSelect} />
              </section>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
