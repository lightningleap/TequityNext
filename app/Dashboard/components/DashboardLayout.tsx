"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarMenuItems } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BlackLogo from "@/public/BlackLogo.svg";
import Image from "next/image";
import { ChatHistory } from "./ChatHistory";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  headerActions?: ReactNode;
  activeChatId?: string;
  onChatSelect?: (chatId: string) => void;
}

export function DashboardLayout({
  children,
  title,
  headerActions,
  activeChatId,
  onChatSelect,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const isChatPage = pathname === "/Dashboard/chat";

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <Sidebar
          side="left"
          variant="sidebar"
          collapsible="icon"
          className="flex-shrink-0"
        >
          <div className="flex items-center gap-2 px-4 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 transition-all duration-300 ease-in-out">
            <Image
              src={BlackLogo}
              alt="Company Logo"
              width={32}
              height={32}
              priority
              className="flex-shrink-0 ml-1"
            />
            <p className="font-sans font-medium text-sm leading-none tracking-[-0.15%] align-middle whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0">
              LLA&apos;s DATAROOM
            </p>
          </div>
          <SidebarMenuItems />
          {isChatPage && <hr className="my-4 transition-opacity duration-300" />}

          {/* Chat History - Only visible on Tequity AI page */}
          {isChatPage && (
            <ChatHistory
              activeChatId={activeChatId}
              onChatSelect={onChatSelect}
            />
          )}
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800/50 dark:bg-[#111111]">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold text-black">{title}</h1>
            </div>
            {headerActions && (
              <div className="flex items-center gap-4">{headerActions}</div>
            )}
          </header>

          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
