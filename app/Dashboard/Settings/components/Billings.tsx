"use client";

import { FiCreditCard } from "react-icons/fi";

export function Billings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {/* <FiCreditCard className="h-6 w-6 text-gray-700" /> */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Billings</h2>
      </div>

      {/* Current Plan */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Current Plan</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">Professional Plan - Billed monthly at $29/month</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors dark:border-[#27272A] dark:bg-[#27272A]">
          Manage Plan
        </button>
      </div>

      {/* Payment Method */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Payment method</p>
          <div className="flex items-center gap-2">
            <FiCreditCard className="h-4 w-4 text-gray-500" />
            <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">•••• •••• •••• 4242 - Expires 12/25</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors dark:border-[#27272A] dark:bg-[#27272A]">
          Update
        </button>
      </div>

      {/* Billing Email */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Billing email</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">billing@example.com</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors dark:border-[#27272A] dark:bg-[#27272A]">
          Change
        </button>
      </div>

      {/* Billing Address */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Billing address</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">123 Main St, San Francisco, CA 94105</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors dark:border-[#27272A] dark:bg-[#27272A]">
          Update
        </button>
      </div>

      {/* Invoice Settings */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Invoice settings</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">Customize company details on invoices</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors dark:border-[#27272A] dark:bg-[#27272A]">
          Configure
        </button>
      </div>

      {/* Billing History */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Billing history</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">View and download past invoices</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors dark:border-[#27272A] dark:bg-[#27272A]">
          View History
        </button>
      </div>

      {/* Cancel Subscription */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#27272A]">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1 dark:text-white">Cancel subscription</p>
          <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">You will lose access to all premium features</p>
        </div>
        <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors dark:border-[#27272A]">
          Cancel Plan
        </button>
      </div>
    </div>
  );
}
