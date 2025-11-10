"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { AddUserDialog } from "../dialogbox/AddUserDialog";
import { RemoveUserDialog } from "../dialogbox/RemoveUserDialog";

export function People() {
  const [inviteLinkEnabled, setInviteLinkEnabled] = useState(true);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [removeUserOpen, setRemoveUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ name: string; email: string } | null>(null);

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      initials: "JD",
      role: "Admin",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      initials: "JS",
      role: "General",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      initials: "MJ",
      role: "Financial",
    },
  ];

  return (
    <div className="space-y-6 dark:bg-[#09090B] max-h-[500px] overflow-y-auto">
      <div className="flex items-center gap-3">
        {/* <FiUsers className="h-6 w-6 text-gray-700" /> */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">People</h2>
      </div>

      {/* Invite link section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Invite link to add members</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
            Only people with permission to invite members can see this. You can also{" "}
            <button className="underline hover:text-gray-700">Generate a new link</button>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 whitespace-nowrap border border-gray-300 hover:bg-gray-50 dark:hover:bg-[#27272A] rounded-md text-sm hover:bg-gray-50 transition-colors">
            Copy link
          </button>
          <button
            onClick={() => setInviteLinkEnabled(!inviteLinkEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              inviteLinkEnabled ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-[#27272A]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                inviteLinkEnabled ? "translate-x-6 dark:bg-black" : "translate-x-1 dark:bg-black"
              }`}
            />
          </button>
        </div>
      </div>

      {/* All users section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">All users</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">List of registered accounts</p>
        </div>
        <button
          onClick={() => setAddUserOpen(true)}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 transition-colors"
        >
          Add user
        </button>
      </div>

      {/* Users table */}
      <div className="w-full sm:max-w-[290px] max-w-[308px] md:max-w-none border border-gray-200 dark:border-[#27272A] rounded-lg overflow-x-auto bg-white">
        <div className="sm:min-w-[290px] max-w-[500px]">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_150px_50px] gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 bg-gray-50 border-b dark:border-[#27272A] border-gray-200 dark:bg-[#09090B]">
            <div className="text-xs font-medium text-gray-500 tracking-wider dark:text-white">User</div>
            <div className="text-xs font-medium text-gray-500 tracking-wider dark:text-white">Role</div>
            <div></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100 dark:divide-[#27272A] dark:bg-[#09090B]">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[1fr_150px_50px] gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 items-center hover:bg-gray-50 dark:hover:bg-[#27272A]"
              >
                {/* User Column */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600 dark:text-white">{user.initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">{user.email}</p>
                  </div>
                </div>

                {/* Role Column */}
                <div className="text-sm text-gray-900 dark:text-white">
                  {user.role}
                </div>

                {/* Action Column */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => {
                      setSelectedUser({ name: user.name, email: user.email });
                      setRemoveUserOpen(true);
                    }}
                    className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-[#27272A] hover:bg-gray-100 dark:hover:bg-gray-500 rounded transition-colors dark:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog Components */}
      <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />
      <RemoveUserDialog
        open={removeUserOpen}
        onOpenChange={setRemoveUserOpen}
        userName={selectedUser?.name}
        userEmail={selectedUser?.email}
      />
    </div>
  );
}
