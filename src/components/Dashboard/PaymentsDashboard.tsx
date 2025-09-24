import React, { useCallback, useEffect, useState } from "react";
import PaymentsStatistics from './PaymentsStatistics'; // Import the new component

interface ApiDonation {
  order_id: string;
  payment_id: string | null;
  status: string;
  amount_paise: number;
  amount_rupees: string | number;
  currency: string;
  method: string | null;
  email: string | null;
  contact: string | null;
  captured: boolean | null;
  order_created_at: string;
  payment_created_at: string | null;
  donor?: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  receipt: string | null;
}

const PAGE_SIZE = 20; // Define page size for pagination

const PaymentsDashboard: React.FC = () => {
  const [payments, setPayments] = useState<ApiDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaymentsCount, setTotalPaymentsCount] = useState(0); // Total count from DB
  const [hasMore, setHasMore] = useState(true); // Whether there are more pages to load
  const [statusFilter, setStatusFilter] = useState<"all" | "captured" | "failed" | "created">("all");
  const [amountSort, setAmountSort] = useState<"default" | "low-to-high" | "high-to-low">("default");

  const fetchPayments = useCallback(async (pageToLoad: number, append: boolean = true) => {
      setLoading(true);
      setError(null);
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // Ensure this matches your backend URL
        const res = await fetch(`${backendUrl}/all-payments`, { // Updated endpoint
          method: "POST", // Changed to POST
          headers: { 
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          credentials: "same-origin",
          body: JSON.stringify({ page: pageToLoad, pageSize: PAGE_SIZE }) // Send page and pageSize
        });
        
        if (!res.ok) {
          throw new Error(`Backend API error: ${res.status} ${res.statusText}`);
        }
        
        const json = await res.json(); // Expected: { success: true, page, pageSize, current_page_count, total_count, data: [...] }
        if (json.success && Array.isArray(json.data)) { // Check for success and data array
          if (append) {
            setPayments(prev => [...prev, ...json.data]); // Append new payments
          } else {
            setPayments(json.data); // For initial load or refresh, replace all
          }
          setTotalPaymentsCount(json.total_count); // Update total count from backend
          setHasMore(json.data.length === PAGE_SIZE); // Check if the number of records returned is equal to PAGE_SIZE
          setCurrentPage(pageToLoad); // Update current page
        } else {
          throw new Error("Invalid API response format or success: false");
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error("❌ Failed to fetch payments from backend:", error.message);
        setError(`Unable to connect to backend API: ${error.message}`);
        setPayments([]);
        setHasMore(false); // No more data if there's an error
      } finally {
        setLoading(false);
      }
  }, []); // Empty dependency array for useCallback

  useEffect(() => {
    fetchPayments(1, false); // Initial load, do not append
  }, [fetchPayments]); // Dependency on fetchPayments

  const handleLoadMore = () => {
    fetchPayments(currentPage + 1);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      captured: "bg-green-100 text-green-800",
      created: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    };
    return statusStyles[status.toLowerCase() as keyof typeof statusStyles] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };
  
  const refreshData = () => {
    // Reset pagination and fetch first page
    setCurrentPage(1);
    setPayments([]); // Clear existing payments before refetching
    setHasMore(true); // Assume there's more data on refresh
    fetchPayments(1, false); // Fetch first page, do not append
  };

  // Statistics based on currently loaded payments
  const successfulPaymentsCount = payments.filter(p => p.status === "captured").length;
  const pendingPaymentsCount = payments.filter(p => p.status === "created").length;
  const failedPaymentsCount = payments.filter(p => p.status === "failed").length;

  const totalCapturedPaise = payments
    .filter(p => p.status === "captured")
    .reduce((sum, p) => sum + (p.amount_paise || 0), 0);

  // Apply filters and sorting to unique payments
  const filteredAndSortedPayments = payments // Operate on all loaded payments
    .filter(payment => {
      if (statusFilter === "all") return true;
      
      // Normalize status value
      const paymentStatus = (payment.status || "").toString().toLowerCase().trim();
      
      // Map filter values to actual status values
      let expectedStatus = "";
      if (statusFilter === "captured") {
        expectedStatus = "captured";
      } else if (statusFilter === "failed") {
        expectedStatus = "failed";
      } else if (statusFilter === "created") {
        expectedStatus = "created";
      } else {
        expectedStatus = String(statusFilter).toLowerCase().trim();
      }
      
      return paymentStatus === expectedStatus;
    })
    .sort((a, b) => {
      // Define amounts for comparison
      const amountA = a.amount_paise || 0;
      const amountB = b.amount_paise || 0;

      // Define dates for default comparison (most recent first)
      const dateA = new Date(a.payment_created_at || a.order_created_at || 0).getTime();
      const dateB = new Date(b.payment_created_at || b.order_created_at || 0).getTime();

      if (amountSort === "low-to-high") {
        return amountA - amountB;
      } else if (amountSort === "high-to-low") {
        return amountB - amountA;
      }
      // If amountSort is "default", sort by date (most recent first)
      return dateB - dateA;
    });

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
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? "Loading..." : "Refresh"}
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
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
        
        {/* Responsive statistics grid */}
        <PaymentsStatistics
          totalPaymentsCount={totalPaymentsCount}
          successfulPaymentsCount={successfulPaymentsCount}
          pendingPaymentsCount={pendingPaymentsCount}
          failedPaymentsCount={failedPaymentsCount}
          totalCapturedPaise={totalCapturedPaise}
        />
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {loading && payments.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading payments...</p>
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-600">No payment data found</div>
        </div>
      )}

      {!loading && !error && payments.length > 0 && filteredAndSortedPayments.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-600">No payments match your current filters</div>
          <button
            onClick={() => {
              setStatusFilter("all");
              setAmountSort("default");
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {!loading && !error && filteredAndSortedPayments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900">Payment Transactions</h3>
              <span className="text-sm text-gray-500">
                Showing {filteredAndSortedPayments.length} of {totalPaymentsCount} payments
              </span>
            </div>
          </div>
          
          {/* Mobile Card Layout */}
          <div className="block sm:hidden">
            <div className="divide-y divide-gray-200">
              {filteredAndSortedPayments.map((payment, index) => (
                <div key={`${payment.order_id}-${payment.payment_id || index}`} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-gray-900 truncate">
                        {payment.order_id}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {payment.donor?.name || "Anonymous"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ₹{payment.amount_rupees}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-3">
                    <div>
                      <span className="font-medium">Method:</span> {payment.method || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Contact:</span> {payment.contact || "N/A"}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Email:</span> 
                      <span className="ml-1 break-all">{payment.email || "N/A"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Date:</span> {formatDate(payment.payment_created_at || payment.order_created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200"
                   style={{ minWidth: '1200px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Email</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px] w-44">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedPayments.map((payment, index) => (
                <tr key={`${payment.order_id}-${payment.payment_id || index}`} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {payment.order_id}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    ₹{payment.amount_rupees}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.method || "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.donor?.name || "Anonymous"}
                  </td>
                  <td className="px-2 py-4 w-48">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <div className="text-sm text-gray-500 whitespace-nowrap min-w-0">
                        {payment.email || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.contact || "N/A"}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[180px] w-44">
                    {formatDate(payment.payment_created_at || payment.order_created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}

      {hasMore && !error && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors text-lg font-semibold"
          >
            {loading ? "Loading More..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentsDashboard;
