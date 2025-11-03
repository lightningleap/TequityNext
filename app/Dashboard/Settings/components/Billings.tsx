"use client";

import { FiCreditCard } from "react-icons/fi";
import { ChevronDown } from "lucide-react";

export function Billings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {/* <FiCreditCard className="h-6 w-6 text-gray-700" /> */}
        <h2 className="text-xl font-semibold text-gray-900">Billings</h2>
      </div>

      {/* Current Plan */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Current Plan</p>
          <p className="text-xs text-gray-500">Professional Plan - Billed monthly at $29/month</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
          Manage Plan
        </button>
      </div>

      {/* Payment Method */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Payment method</p>
          <div className="flex items-center gap-2">
            <FiCreditCard className="h-4 w-4 text-gray-500" />
            <p className="text-xs text-gray-500">•••• •••• •••• 4242 - Expires 12/25</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
          Update
        </button>
      </div>

      {/* Billing Email */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Billing email</p>
          <p className="text-xs text-gray-500">billing@example.com</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
          Change
        </button>
      </div>

      {/* Billing Address */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Billing address</p>
          <p className="text-xs text-gray-500">123 Main St, San Francisco, CA 94105</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
          Update
        </button>
      </div>

      {/* Invoice Settings */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Invoice settings</p>
          <p className="text-xs text-gray-500">Customize company details on invoices</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
          Configure
        </button>
      </div>

      {/* Billing History */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Billing history</p>
          <p className="text-xs text-gray-500">View and download past invoices</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
          View History
        </button>
      </div>

      {/* Cancel Subscription */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">Cancel subscription</p>
          <p className="text-xs text-gray-500">You will lose access to all premium features</p>
        </div>
        <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors">
          Cancel Plan
        </button>
      </div>
    </div>
  );
}
