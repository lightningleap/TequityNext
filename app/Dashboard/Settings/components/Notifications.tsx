"use client";

import { FiBell } from "react-icons/fi";
import { useState } from "react";

export function Notifications() {
  const [activityNotifications, setActivityNotifications] = useState(true);
  const [alwaysSendEmail, setAlwaysSendEmail] = useState(false);
  const [documentUpdates, setDocumentUpdates] = useState(true);
  const [dataroomDigest, setDataroomDigest] = useState(true);
  const [tequityAnnouncements, setTequityAnnouncements] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {/* <FiBell className="h-6 w-6 text-gray-700" /> */}
        <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
      </div>

      {/* Activity in your dataroom */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Activity in your dataroom</p>
          <p className="text-xs text-gray-500">Receive email when your dataroom has comments, mentions, invites, reminders, access requests, or document changes.</p>
        </div>
        <button
          onClick={() => setActivityNotifications(!activityNotifications)}
          className={`relative inline-flex h-6 sm:w-16  w-24 items-center rounded-full transition-colors ${
            activityNotifications ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              activityNotifications ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Always send email notification */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Always send email notification</p>
          <p className="text-xs text-gray-500">Get emails for all activity, even when you’re actively using Tequity.</p>
        </div>
        <button
          onClick={() => setAlwaysSendEmail(!alwaysSendEmail)}
          className={`relative inline-flex h-6 sm:w-11 w-13 items-center rounded-full transition-colors ${
            alwaysSendEmail ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              alwaysSendEmail ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Document updates */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Document updates</p>
          <p className="text-xs text-gray-500">Receive email digest for edits, uploads, or downloads in your dataroom.</p>
        </div>
        <button
          onClick={() => setDocumentUpdates(!documentUpdates)}
          className={`relative inline-flex h-6 sm:w-11 w-14 items-center rounded-full transition-colors ${
            documentUpdates ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              documentUpdates ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Dataroom digest */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Dataroom digest</p>
          <p className="text-xs text-gray-500">Weekly email digest summarizing activity, new adds, member joins, and permissions.</p>
        </div>
        <button
          onClick={() => setDataroomDigest(!dataroomDigest)}
          className={`relative inline-flex h-6 sm:w-11 w-17 items-center rounded-full transition-colors ${
            dataroomDigest ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              dataroomDigest ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Tequity announcements */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Tequity Announcements</p>
          <p className="text-xs text-gray-500">Emails about feature launches and platform updates.</p>
        </div>
        <button
          onClick={() => setTequityAnnouncements(!tequityAnnouncements)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            tequityAnnouncements ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              tequityAnnouncements ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
