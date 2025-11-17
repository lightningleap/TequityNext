"use client";

import { ReactNode, useState, useEffect } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  Plus, Settings, LogOut, Moon, Sun } from "lucide-react";
import { SettingsDialog } from "../Settings/SettingsDialog";
import { ChevronsLeft, ChevronDown, UploadCloud } from "lucide-react";
import { MdOutlineFolderCopy } from "react-icons/md";
import { useTheme } from "next-themes";
import { useChatContextOptional } from "../context/ChatContext";

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
  const { theme, setTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const chatContext = useChatContextOptional();
  const [dataroomName, setDataroomName] = useState("LLA");

  // Load dataroom name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('dataroomName');
    if (savedName) {
      setDataroomName(savedName);
    }

    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      const updatedName = localStorage.getItem('dataroomName');
      if (updatedName) {
        setDataroomName(updatedName);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Format dataroom name with suffix
  const formattedDataroomName = `${dataroomName}'s Dataroom`;


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
          <div className="flex flex-col gap-2 px-2 py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3">
            <div className="flex items-center gap-2 px-2 py-2 rounded-md h-12 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 transition-all duration-300 ease-in-out w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-2 -mx-2 -my-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:mx-0 group-data-[collapsible=icon]:my-0 dark:hover:bg-[#27272A] dark:hover:text-white">
                    <Image
                      src={BlackLogo}
                      alt="Company Logo"
                      width={32}
                      height={32}
                      priority
                      className="flex-shrink-0"
                    />
                    <div className="flex items-center gap-2 flex-1 overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                      <p className="font-sans font-medium text-sm leading-none tracking-[-0.084px] whitespace-nowrap overflow-hidden text-left">
                        {formattedDataroomName}
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-59 -ml-1 space-y-1.5 dark:bg-[#09090B] dark:text-white md:mt-2" align="start">
                {/* Header */}
                <DropdownMenuLabel className="text-xs text-gray-500 font-normal dark:text-[#F4F4F5] px-3">
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
                  <span className="font-medium">{formattedDataroomName}</span>
                </DropdownMenuItem>

                {/* Add Dataroom */}
                <DropdownMenuItem className="flex cursor-pointer items-center gap-2 mx-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Dataroom</span>
                </DropdownMenuItem>
                <hr className="my-1" />

                {/* Light/Dark Mode Toggle - Side by Side */}
                <div className="flex items-center rounded-lg dark:bg-[#27272A] bg-gray-100 dark:text-white gap-1 px-1 py-1">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex cursor-pointer items-center gap-2 px-3 py-2 rounded-md flex-1 transition-colors ${
                      theme === "light"
                        ? "bg-white shadow-sm"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-[#27272A] dark:text-white"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span className="text-sm">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex cursor-pointer items-center gap-2 px-3 py-2 rounded-md flex-1 transition-colors ${
                      theme === "dark"
                        ? "bg-white shadow-sm dark:bg-[#09090B] dark:text-white"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-[#09090B] dark:text-white"
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                const trigger = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
                trigger?.click();
              }}
              className="flex items-center justify-center size-4 text-gray-500 hover:text-gray-700 transition-colors group-data-[collapsible=icon]:hidden"
            >
              <ChevronsLeft className="size-4" />
            </button>
          </div>
        </div>
          <SidebarMenuItems />
          {isChatPage && <hr className="my-4 transition-opacity duration-300 group-data-[collapsible=icon]:hidden" />}

          {/* Chat History - Only visible on Tequity AI page and when sidebar is expanded */}
          {isChatPage && (
            <div className="group-data-[collapsible=icon]:hidden">
              <ChatHistory
                activeChatId={activeChatId}
                onChatSelect={onChatSelect}
              />
            </div>
          )}
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile Header */}
          <header className="flex md:hidden h-16 items-center justify-between border-b dark:border-[#A1A1AA] border-gray-200 bg-white dark:bg-[#09090B] px-3">
            <SidebarTrigger className="size-9 p-2" />

            {isChatPage && chatContext && chatContext.chats.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors">
                    <span className="text-sm font-semibold text-[#3f3f46] dark:text-white truncate max-w-[150px]">
                      {chatContext.activeChat?.title || "New Chat"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 dark:bg-[#09090B] dark:text-white" align="center">
                  <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                    Recent Chats
                  </DropdownMenuLabel>
                  {chatContext.chats.slice(0, 5).map((chat) => (
                    <DropdownMenuItem
                      key={chat.id}
                      onClick={() => {
                        chatContext.selectChat(chat.id);
                        onChatSelect?.(chat.id);
                      }}
                      className={`cursor-pointer ${
                        chatContext.activeChatId === chat.id ? 'bg-gray-100 dark:bg-[#27272A]' : ''
                      }`}
                    >
                      <span className="truncate">{chat.title}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Image
                  src={BlackLogo}
                  alt="Company Logo"
                  width={20}
                  height={20}
                  priority
                  className="flex-shrink-0"
                />
                <span className="text-sm font-semibold text-[#3f3f46] dark:text-white">{formattedDataroomName}</span>
              </div>
            )}

            {headerActions ? (
              <div className="flex items-center">{headerActions}</div>
            ) : (
              <button className="flex items-center justify-center size-9 p-2 rounded-md bg-[#f1f5f9] dark:bg-[#27272A] hover:bg-gray-200 dark:hover:bg-[#27272A] transition-colors">
                <UploadCloud className="size-4 text-black dark:text-white" />
              </button>
            )}
          </header>

          {/* Desktop Header */}
          <header className="hidden md:flex h-16 items-center justify-between bg-white px-4 dark:bg-[#09090B] dark:text-white">
            <div className="flex items-center gap-3">
              {title === "Library" ? (
                <button className="flex items-center gap-2 h-9 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <MdOutlineFolderCopy className="h-4 w-4 text-black dark:text-white" />
                  <span className="text-sm font-medium text-[#0f172a] dark:text-white">{title}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              ) : (
                <h1 className="text-lg font-semibold text-black dark:text-white">{title}</h1>
              )}
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
