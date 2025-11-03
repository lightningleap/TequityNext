"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  useEffect(() => {
    if (open) {
      const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
      const lastOverlay = overlays[overlays.length - 1] as HTMLElement;
      if (lastOverlay) lastOverlay.style.zIndex = '100';
    }
  }, [open]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("General");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = ["Admin", "General", "Financial"];

  const handleSubmit = () => {
    // Handle add user logic here
    console.log("Adding user:", { name, email, role });
    onOpenChange(false);
    setName("");
    setEmail("");
    setRole("General");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="w-[368px] sm:max-w-[425px] z-[100] !fixed !left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
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
            <label htmlFor="user-email" className="text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2 relative">
            <label htmlFor="user-role" className="text-sm font-medium text-gray-900">
              Role
            </label>
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md  flex items-center justify-between"
            >
              <span>{role}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showRoleDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowRoleDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-3 py-4">
          {/* <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button> */}
          <button
            onClick={handleSubmit}
            className="px-4 w-full py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
          >
            Send Invite
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
