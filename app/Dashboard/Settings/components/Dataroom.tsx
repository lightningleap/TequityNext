"use client";

import { MdOutlineFolderCopy } from "react-icons/md";
import Image from "next/image";
import BlackLogo from "@/public/BlackLogo.svg";
import { useState } from "react";
import { DeleteAllChatsDialog } from "../dialogbox/DeleteAllChatsDialog";
import { LeaveDataroomDialog } from "../dialogbox/LeaveDataroomDialog";
import { DeleteDataroomDialog } from "../dialogbox/DeleteDataroomDialog";

export function Dataroom() {
  const [deleteAllChatsOpen, setDeleteAllChatsOpen] = useState(false);
  const [leaveDataroomOpen, setLeaveDataroomOpen] = useState(false);
  const [deleteDataroomOpen, setDeleteDataroomOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {/* <MdOutlineFolderCopy className="h-6 w-6 text-gray-700" /> */}
        <h2 className="text-xl font-semibold text-gray-900">Dataroom</h2>
      </div>

      {/* Logo and Name */}
      <div className="">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16  flex items-center justify-center flex-shrink-0">
            <Image src={BlackLogo} alt="Logo" width={52} height={52} />
          </div>
          <div className="flex-1 space-y-1 mb-2">
            <p className="text-xs font-medium" style={{ color: '#64748B' }}>Dataroom Name</p>
            <input
              type="text"
              className="w-50% px-3 py-2 border border-gray-300 rounded-md "
              placeholder="Dataroom name"
              defaultValue="LLA's DATAROOM"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500"> <span className="text-blue-600">Add logo </span> or <span className="text-red-600">remove logo</span></p>
      </div>

      {/* Export data */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Export data</p>
          <p className="text-xs text-gray-500">Download all data and documents from this dataroom to your device.</p>
        </div>
        <button className="px-4 py-2 rounded-md text-sm hover:bg-gray-50 shadow border transition-colors">
          Export
        </button>
      </div>

      {/* Archive all chats */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Archive all chats</p>
          <p className="text-xs text-gray-500">Save and archive all messages for secure backup and future reference.</p>
        </div>
        <button className="whitespace-nowrap px-4 py-2 border shadow rounded-md text-sm hover:bg-gray-50 transition-colors">
          Archive all chats
        </button>
      </div>

      {/* Delete all chats */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Delete all chats</p>
          <p className="text-xs text-gray-500">Remove all chat history associated with this dataroom. This action cannot be undone.</p>
        </div>
        <button
          onClick={() => setDeleteAllChatsOpen(true)}
          className="whitespace-nowrap px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors"
        >
          Delete all chats
        </button>
      </div>

      {/* Leave dataroom */}
      <div className="flex gap-2 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Leave dataroom</p>
          <p className="text-xs text-gray-500">Log out and leave this dataroom. Your access will be removed from all active devices.</p>
        </div>
        <button
          onClick={() => setLeaveDataroomOpen(true)}
          className="whitespace-nowrap px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors"
        >
          Leave dataroom
        </button>
      </div>

      {/* Delete entire dataroom */}
      <div className="flex gap-2 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Delete entire dataroom</p>
          <p className="text-xs text-gray-500">Permanently delete this dataroom and all its contents. This action cannot be undone. Please confirm before proceeding.</p>
        </div>
        <button
          onClick={() => setDeleteDataroomOpen(true)}
          className="whitespace-nowrap px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Delete dataroom
        </button>
      </div>

      {/* Dialog Components */}
      <DeleteAllChatsDialog open={deleteAllChatsOpen} onOpenChange={setDeleteAllChatsOpen} />
      <LeaveDataroomDialog open={leaveDataroomOpen} onOpenChange={setLeaveDataroomOpen} />
      <DeleteDataroomDialog open={deleteDataroomOpen} onOpenChange={setDeleteDataroomOpen} />
    </div>
  );
}
