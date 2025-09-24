import React, { useState } from "react";
import PaymentsStatistics from './PaymentsStatistics';
import AllTransactions from "./AllTransactions";

const PaymentsDashboard: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | "captured" | "failed" | "created">("all");
  const [amountSort, setAmountSort] = useState<"default" | "low-to-high" | "high-to-low">("default");

  const refreshData = () => {
    // Reset filters and sort, which will trigger TransactionsTable to re-fetch
    setStatusFilter("all");
    setAmountSort("default");
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        {/* Responsive header layout */}
        <div className="mb-4">
          {/* Mobile: Stack everything vertically */}
          <div className="block md:hidden">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payments Dashboard</h1>
            <div className="flex flex-col gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "captured" | "failed" | "created")}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="captured">Successful</option>
                <option value="failed">Failed</option>
                <option value="created">Pending</option>
              </select>
              <select
                value={amountSort}
                onChange={(e) => setAmountSort(e.target.value as "default" | "low-to-high" | "high-to-low")}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="default">Default Order</option>
                <option value="low-to-high">Amount: Low to High</option>
                <option value="high-to-low">Amount: High to Low</option>
              </select>
              <button
                onClick={refreshData}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Desktop: Title on left, controls on right */}
          <div className="hidden md:flex md:justify-between md:items-center">
            <h1 className="text-3xl font-bold text-gray-900">Payments Dashboard</h1>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "captured" | "failed" | "created")}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="captured">Successful</option>
                <option value="failed">Failed</option>
                <option value="created">Pending</option>
              </select>
              <select
                value={amountSort}
                onChange={(e) => setAmountSort(e.target.value as "default" | "low-to-high" | "high-to-low")}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="default">Default Order</option>
                <option value="low-to-high">Amount: Low to High</option>
                <option value="high-to-low">Amount: High to Low</option>
              </select>
              <button
                onClick={refreshData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
        
         {/* Responsive statistics grid */}
         <PaymentsStatistics />

      </div>
      
      {/* Render TransactionsTable, passing only filter and sort props */}
      <AllTransactions 
        statusFilter={statusFilter} 
        amountSort={amountSort} 
      />
    </div>
  );
};

export default PaymentsDashboard;
