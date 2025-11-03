"use client";

import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarMenuItems } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BlackLogo from "@/public/BlackLogo.svg";
import Image from "next/image";
import { ChatHistory } from "./ChatHistory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, Settings, LogOut, Moon, Sun } from "lucide-react";
import { SettingsDialog } from "../Settings/SettingsDialog";

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
  const router = useRouter();
  const isChatPage = pathname === "/Dashboard/chat";
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // Add your theme toggle logic here
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <Sidebar
          side="left"
          variant="sidebar"
          collapsible="icon"
          className="flex-shrink-0"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-50 rounded-md mx-2 my-1">
                <Image
                  src={BlackLogo}
                  alt="Company Logo"
                  width={32}
                  height={32}
                  priority
                  className="flex-shrink-0 ml-1"
                />
                <div className="flex items-center gap-2 flex-1 overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                  <p className="font-sans font-medium text-sm leading-none tracking-[-0.15%] align-middle whitespace-nowrap overflow-hidden">
                    LLA&apos;s DATAROOM
                  </p>
                  {/* <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" /> */}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-62 -ml-1 space-y-1.5" align="start">
              {/* Header */}
              <DropdownMenuLabel className="text-xs text-gray-500 font-normal px-3">
                Your Dataroom&apos;s
              </DropdownMenuLabel>

              {/* Current Dataroom */}
              <DropdownMenuItem className="flex items-center gap-2 py-2 mx-1">
                <Image
                  src={BlackLogo}
                  alt="Logo"
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <span className="font-medium">LLA&apos;s DATAROOM</span>
              </DropdownMenuItem>

              {/* Add Dataroom */}
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2 mx-1">
                <Plus className="h-4 w-4" />
                <span>Add Dataroom</span>
              </DropdownMenuItem>
              <hr className="my-1" />

              {/* Light/Dark Mode Toggle - Side by Side */}
              <div className="flex items-center rounded-lg gap-1 px-1 py-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 rounded-md flex-1 transition-colors ${
                    theme === "light"
                      ? "bg-white shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 rounded-md flex-1 transition-colors ${
                    theme === "dark"
                      ? "bg-white shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  <span className="text-sm">Dark</span>
                </button>
              </div>
              <hr className="my-1" />

              {/* Settings */}
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2 mx-1"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              {/* Logout */}
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2 mx-1"
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </SidebarProvider>
  );
}
