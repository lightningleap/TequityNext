"use client";

import { FiUser } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChangePasswordDialog } from "../dialogbox/ChangePasswordDialog";
import { LogoutDialog } from "../dialogbox/LogoutDialog";
import { DisableAccountDialog } from "../dialogbox/DisableAccountDialog";
import { usersApi, type User } from "@/lib/api";
import { toast } from "sonner";

export function Account() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [disableAccountOpen, setDisableAccountOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await usersApi.getMe();
        if (response.success && response.data) {
          setUser(response.data);
          setName(response.data.name || "");
          setProfilePicture(response.data.avatarUrl || null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Save name changes
  const handleNameSave = async () => {
    if (!user || name === user.name) return;

    setIsSaving(true);
    try {
      const response = await usersApi.update(user.id, { name });
      if (response.success && response.data) {
        setUser(response.data);
        toast.success("Name updated successfully");
      } else {
        toast.error(response.error || "Failed to update name");
      }
    } catch (err) {
      toast.error("Failed to update name");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 dark:bg-[#09090B]">
      <div className="flex items-center gap-3 dark:text-white">
        {/* <FiUser className="h-6 w-6 text-gray-700" /> */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Account
        </h2>
      </div>

      {/* Profile Picture and Name */}
      <div className="space-y-3 dark:text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="h-8 w-8 text-gray-500 dark:text-white" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs font-medium" style={{ color: "#64748B" }}>
              Preferred Name
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="w-50% px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              {name !== (user?.name || "") && (
                <button
                  onClick={handleNameSave}
                  disabled={isSaving}
                  className="px-3 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {" "}
          {!profilePicture ? (
            <span
              className="text-blue-500 cursor-pointer hover:text-blue-600"
              onClick={() => fileInputRef.current?.click()}
            >
              Add photo
            </span>
          ) : (
            <span
              className="text-blue-500 cursor-pointer hover:text-blue-600"
              onClick={() => fileInputRef.current?.click()}
            >
              Change photo
            </span>
          )}{" "}
          or{" "}
          {profilePicture && (
            <span
              className="text-red-500 cursor-pointer hover:text-red-600"
              onClick={() => {
                setProfilePicture(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Remove photo
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfilePicture(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </p>
      </div>

      {/* Email Section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">
            Email
          </p>
          <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">
            {isLoading ? "Loading..." : user?.email || "No email"}
          </p>
        </div>
        <button
          disabled
          className="whitespace-nowrap w-[123px] h-9 px-4 py-0 border border-gray-300 rounded-md text-sm opacity-50 cursor-not-allowed transition-colors dark:border-[#27272A] dark:text-white"
          aria-label="Change Email"
        >
          Change Email
        </button>
      </div>

      {/* Password Section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">
            Password
          </p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
            Change your password to login to your account.
          </p>
        </div>
        <button
          onClick={() => setChangePasswordOpen(true)}
          className="whitespace-nowrap w-[152px] h-9 px-4 py-0 border border-gray-300 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-[#27272A] dark:hover:text-white dark:border-[#27272A] transition-colors dark:text-white flex items-center justify-center cursor-pointer"
          aria-label="Change Password"
        >
          Change Password
        </button>
      </div>

      {/* Logout of all devices */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">
            Logout of all device
          </p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
            Log out of all other active sessions besides this device.
          </p>
        </div>
        <button
          onClick={() => setLogoutOpen(true)}
          className="whitespace-nowrap w-[83px] h-9 px-4 py-0 border border-gray-300 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-[#27272A] dark:hover:text-white transition-colors dark:border-[#27272A] dark:text-white flex items-center justify-center cursor-pointer"
          aria-label="Log out"
        >
          Log out
        </button>
      </div>

      {/* Disable Account */}
      <div className="flex items-center gap-2 justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">
            Disable my account
          </p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
            This will temporarily disable your account and log you out from all
            sessions. You can reactivate it by logging in again.
          </p>
        </div>

        <button
          onClick={() => setDisableAccountOpen(true)}
          className="whitespace-nowrap px-4 py-0 w-[140px] h-9 bg-red-600 text-white text-[12px] rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          aria-label="Disable Account"
        >
          Disable Account
        </button>
      </div>

      {/* Dialog Components */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
      <DisableAccountDialog
        open={disableAccountOpen}
        onOpenChange={setDisableAccountOpen}
      />
    </div>
  );
}


