"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";

interface RemoveUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
  userEmail?: string;
}

export function RemoveUserDialog({
  open,
  onOpenChange,
  userName = "User",
  userEmail = ""
}: RemoveUserDialogProps) {
  useEffect(() => {
    if (open) {
      const overlays = document.querySelectorAll('[data-radix-dialog-overlay]');
      const lastOverlay = overlays[overlays.length - 1] as HTMLElement;
      if (lastOverlay) lastOverlay.style.zIndex = '100';
    }
  }, [open]);
  const handleRemove = () => {
    // Handle remove user logic here
    console.log("Removing user:", userName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="w-[368px] sm:max-w-[425px] z-[100] !fixed !left-[50%] !top-[50%] !translate-x-[-50%] !translate-y-[-50%]">
        <DialogHeader className="items-center font-bold">
          <DialogTitle>Remove User</DialogTitle>
        </DialogHeader>
        <div className=" text-center">
          <p className="text-sm text-gray-600 mb-2">
            Are you sure you want to remove <strong>{userName}</strong>
            {userEmail && ` (${userEmail})`} from this dataroom?
          </p>
          {/* <p className="text-sm text-gray-600">
            They will lose access to all data and conversations immediately.
          </p> */}
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 w-full py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRemove}
            className="px-4 w-full py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Yes, Remove
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
