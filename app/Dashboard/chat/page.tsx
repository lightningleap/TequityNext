"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarMenuItems } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanyLogo from "@/public/CompanyLogo.svg";
import Image from "next/image";
import { ChatInterface } from "../components/ChatInterface";

export default function ChatPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800/50 dark:bg-[#111111]">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Breadcrumb />
            <Button variant="ghost" className="flex items-center gap-2">
              Tequity AI
              <ChevronDown className="h-4 w-4" />
            </Button>
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

          <main className="flex-1 overflow-hidden">
            <ChatInterface
              selectedFile={null}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
