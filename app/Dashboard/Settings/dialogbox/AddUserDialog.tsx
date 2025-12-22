"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { usersApi } from "@/lib/api";
import { toast } from "sonner";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded?: () => void;
}

export function AddUserDialog({ open, onOpenChange, onUserAdded }: AddUserDialogProps) {
  useEffect(() => {
    if (open) {
      const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
      const lastOverlay = overlays[overlays.length - 1] as HTMLElement;
      if (lastOverlay) lastOverlay.style.zIndex = '100';
    }
  }, [open]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "member", label: "Member" },
  ];

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await usersApi.invite({
        email,
        role: role as "admin" | "member",
      });

      if (response.success) {
        toast.success("Invitation sent successfully");
        onOpenChange(false);
        setEmail("");
        setRole("member");
        onUserAdded?.();
      } else {
        toast.error(response.error || "Failed to send invitation");
      }
    } catch (err) {
      toast.error("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleLabel = roles.find((r) => r.value === role)?.label || "Member";

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="w-[368px] sm:max-w-[425px] z-[100] !fixed !left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%] dark:bg-[#09090B] dark:border">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <hr className="border-gray-300 dark:border-[#27272A]" />
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* <div className="space-y-2">
            <label htmlFor="user-name" className="text-sm font-medium text-gray-900">
              Name
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter user name"
            />
          </div> */}
          <div className="space-y-2">
            <label htmlFor="user-email" className="text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs w-full px-3 py-2 border border-gray-300 dark:border-[#27272A] rounded-md"
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2 relative">
            <label htmlFor="user-role" className="text-sm font-medium text-gray-900 dark:text-white">
              Role
            </label>
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="text-xs w-full px-3 py-2 border border-gray-300 dark:border-[#27272A] rounded-md  flex items-center justify-between"
            >
              <span>{selectedRoleLabel}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showRoleDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 dark:border-[#27272A] rounded-md shadow-lg dark:bg-[#09090B]">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => {
                      setRole(r.value);
                      setShowRoleDropdown(false);
                    }}
                    className="text-xs w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-3 py-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className="px-4 font-semibold w-full border dark:border-[#27272A] dark:hover:bg-[#27272A] py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
