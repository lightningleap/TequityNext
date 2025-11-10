"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Preferences() {
  const [autoTimezone, setAutoTimezone] = useState(false);
  const [profileDiscoverable, setProfileDiscoverable] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {/* <IoSettingsOutline className="h-6 w-6 text-gray-700" /> */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
      </div>

      {/* Appearance */}
      <div className="flex items-center justify-between dark:text-white">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Appearance</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">Customize how Tequity looks on your device</p>
        </div>
        <button className="flex font-semibold items-center gap-2 px-4 py-2 text-sm transition-colors dark:text-white">
          System
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Language */}
      <div className="flex items-center justify-between dark:text-white">
        <div>
          <p className="text-sm font-normal text-gray-900 mb-1 dark:text-white">Language</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">Change the language used in the user interface.</p>
        </div>
        <button className="flex font-semibold items-center gap-2 px-4 py-2 text-sm transition-colors dark:text-white">
          English(US)
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Timezone */}
      <div className="flex items-center justify-between dark:text-white">
        <div>
          <p className="text-sm font-normal text-gray-900 mb-1 dark:text-white">Timezone</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">Current timezone setting.</p>
        </div>
        <button className="flex font-semibold items-center gap-2 px-4 py-2 text-sm transition-colors dark:text-white">
          UTC+05:30(IST)
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Auto Timezone */}
      <div className="flex items-center gap-2 justify-between dark:text-white ">
        <div>
          <p className="text-sm font-normal text-gray-900 mb-1 dark:text-white">Set timezone automatically using your location</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">Reminders, notifications and emails are delivered based on your time zone.</p>
        </div>
        <button
          onClick={() => setAutoTimezone(!autoTimezone)}
          className={`relative inline-flex h-6 sm:w-11 w-16 items-center rounded-full transition-colors ${
            autoTimezone ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-[#27272A]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoTimezone ? "translate-x-6 dark:bg-black" : "translate-x-1 dark:bg-black"
            }`}
          />
        </button>
      </div>

      {/* Profile Discoverability */}
      <div className="flex items-center gap-4 justify-between dark:text-white">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Profile discoverability</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">Users with your email can see your name and profile picture when inviting you to a new workspace.</p>
        </div>
        <button
          onClick={() => setProfileDiscoverable(!profileDiscoverable)}
          className={`relative inline-flex h-6 sm:w-14 w-20  items-center rounded-full transition-colors ${
            profileDiscoverable ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-[#27272A]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              profileDiscoverable ? "translate-x-6 dark:bg-black" : "translate-x-1 dark:bg-black"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
