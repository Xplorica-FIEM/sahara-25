import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Search } from 'lucide-react'; // Import Search icon
import Table from './Table'; // Import the new Table component
import { toast } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify


export interface ApiDonation { // Exported for use in Table.tsx
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

interface AllTransactionsProps {
  statusFilter: "all" | "captured" | "failed" | "created";
  amountSort: "default" | "low-to-high" | "high-to-low";
}

const PAGE_SIZE = 20;

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

// New helper function to map backend status to display status
const getDisplayStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "captured":
      return "Success";
    case "created":
      return "Pending";
    default:
      return status; // Return original status for other cases
  }
};

const AllTransactions: React.FC<AllTransactionsProps> = ({ statusFilter, amountSort }) => {
  const [payments, setPayments] = useState<ApiDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [refreshingOrderId, setRefreshingOrderId] = useState<string | null>(null); // State to track which order is being refreshed
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for the input field value
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>(''); // State for the query that is actually being searched

  // Removed the debounce useEffect

  const fetchPayments = useCallback(async (pageToLoad: number) => { // Simplified signature, now uses activeSearchQuery from state
      setLoading(true);
      setError(null);
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        
        let endpoint = `${backendUrl}/all-payments`;
        let body: { [key: string]: any } = {
          page: pageToLoad,
          pageSize: PAGE_SIZE + 1,
          statusFilter: statusFilter,
          amountSort: amountSort
        };

        if (activeSearchQuery.trim().length >= 2) { // Use activeSearchQuery here
          endpoint = `${backendUrl}/search-transactions`;
          body = { query: activeSearchQuery }; // For search, we only send the query
          // Note: The backend search-transactions currently doesn't support pagination,
          // so we'll fetch all matching results and paginate them on the frontend.
          // If backend search supported pagination, we'd add page/pageSize to body here.
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          credentials: "same-origin",
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          throw new Error(`Backend API error: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const fetchedData = json.data;
          
          // Frontend pagination for search results if search is active
          if (activeSearchQuery.trim().length >= 2) { // Use activeSearchQuery for this check
            const startIndex = (pageToLoad - 1) * PAGE_SIZE;
            const endIndex = startIndex + PAGE_SIZE;
            setPayments(fetchedData.slice(startIndex, endIndex));
            setHasNextPage(fetchedData.length > endIndex);
            setCurrentPage(pageToLoad);
          } else {
            // Original pagination logic for all-payments
            const hasMore = fetchedData.length > PAGE_SIZE;
            setHasNextPage(hasMore);
            setPayments(hasMore ? fetchedData.slice(0, PAGE_SIZE) : fetchedData);
            setCurrentPage(pageToLoad);
          }
        } else {
          throw new Error("Invalid API response format or success: false");
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error("❌ Failed to fetch payments from backend:", error.message);
        setError(`Unable to connect to backend API: ${error.message}`);
        setPayments([]);
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
  }, [statusFilter, amountSort, activeSearchQuery]); // Dependencies now include activeSearchQuery

  // New function to handle refreshing a single transaction
  const handleRefreshTransaction = useCallback(async (orderId: string) => {
    setRefreshingOrderId(orderId); // Set loading for this specific order
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/sync-order`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({ orderId })
      });

      if (!res.ok) {
        throw new Error(`Backend API error: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      if (json.success && json.order) {
        let statusChanged = false;
        setPayments(prevPayments =>
          prevPayments.map(p => {
            if (p.order_id === orderId) {
              const originalStatus = p.status; // Store original status
              const updatedPayment = { ...p, status: json.order.status };

              // Update donor details if available in the response
              if (json.order.donor) {
                updatedPayment.donor = {
                  ...p.donor, // Keep existing if not overwritten
                  name: json.order.donor.name || p.donor?.name || "Anonymous",
                  email: json.order.donor.email || p.donor?.email || null,
                  phone: json.order.donor.phone || p.donor?.phone || null,
                };
              }

              // If a successful payment was found in the sync response, update more fields
              if (json.payments && json.payments.successful_payment) {
                const successfulPayment = json.payments.successful_payment;
                updatedPayment.payment_id = successfulPayment.id;
                updatedPayment.method = successfulPayment.method;
                updatedPayment.captured = successfulPayment.captured;
                // Note: payment_created_at is not directly returned in successful_payment,
                // but the backend updates it. For a full update, a re-fetch of all payments
                // or an enhanced /sync-order response would be needed.
              }

              if (originalStatus !== updatedPayment.status) {
                statusChanged = true;
              }
              return updatedPayment;
            }
            return p;
          })
        );
        if (statusChanged) {
          toast.success(`Transaction ${orderId} status updated to ${getDisplayStatus(json.order.status)}!`);
        } else {
          toast.info(`Transaction ${orderId} is already up to date.`);
        }
      } else {
        throw new Error("Invalid API response format or success: false from sync-order");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`❌ Failed to refresh order ${orderId}:`, error.message);
      toast.error(`Failed to refresh transaction ${orderId}: ${error.message}`);
    } finally {
      setRefreshingOrderId(null); // Clear loading for this specific order
    }
  }, [getDisplayStatus]); // Added getDisplayStatus to dependencies

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter/sort/activeSearchQuery change
    fetchPayments(1); // fetchPayments will use the current activeSearchQuery
  }, [fetchPayments, statusFilter, amountSort, activeSearchQuery]); // Added activeSearchQuery to dependencies

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    if (page > currentPage && !hasNextPage) return;

    setCurrentPage(page);
    fetchPayments(page); // fetchPayments will use the current activeSearchQuery
  };

  const handleSearchButtonClick = () => {
    setCurrentPage(1); // Reset to first page
    setActiveSearchQuery(searchQuery); // Update activeSearchQuery to trigger fetch
  };

  const displayStartIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h3 className="text-lg font-medium text-gray-900">Payment Transactions</h3>
          <div className="flex items-center gap-2"> {/* Wrapper for search and refresh */}
            {/* Search Input */}
            <div className="relative flex items-center"> {/* Added flex items-center here */}
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1); // Reset page when clearing search
                    setActiveSearchQuery(''); // Clear active search query immediately
                  }}
                  className="absolute inset-y-0 right-10 pr-3 flex items-center text-gray-400 hover:text-gray-600" // Adjusted right position
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
              {/* Search Button */}
              <button
                onClick={handleSearchButtonClick}
                disabled={loading}
                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Perform search"
              >
                <Search className="h-4 w-4 sm:mr-2" /> {/* Icon always visible, text only on sm+ */}
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
            {/* Refresh Button */}
            <button
              onClick={() => fetchPayments(currentPage)}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh transactions"
            >
              {loading ? (
                <RefreshCw className="animate-spin h-4 w-4 sm:mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">Refresh</span> {/* Text only on sm+ */}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

    
      <div className="relative min-h-[200px]">

        {/* Show initial loading spinner if no data yet, loading, and no error */}
        {loading && payments.length === 0 && !error && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-700">Loading payments...</p>
          </div>
        )}

        {/* Show "No data" message if not loading, no error, and no payments */}
        {!loading && !error && payments.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mx-4 my-4">
            <div className="text-gray-600">No payment data found or no payments match your current filters</div>
          </div>
        )}

        {/* Mobile Card Layout */}
        {/* Render if there's data and no error, regardless of current loading state (to show old data while fetching new) */}
        {!error && payments.length > 0 && (
          <div className="block sm:hidden">
            <div className="divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <div key={`${payment.order_id}-${payment.payment_id || index}`} className="p-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    {/* Serial Number, Donor Name & Email */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-400 mb-1">#{displayStartIndex + index + 1}</p>
                      <p className="text-sm font-medium text-gray-900">{payment.donor?.name || "Anonymous"}</p>
                      <p className="text-xs text-gray-600 break-all mt-0.5">{payment.email || "N/A"}</p>
                    </div>
                    {/* Amount & Status & Refresh Button */}
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{payment.amount_rupees}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                          {getDisplayStatus(payment.status)}
                        </span>
                        {payment.status.toLowerCase() === 'created' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click if any
                              handleRefreshTransaction(payment.order_id);
                            }}
                            disabled={refreshingOrderId === payment.order_id}
                            className="ml-2 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Refresh order ${payment.order_id}`}
                          >
                            {refreshingOrderId === payment.order_id ? (
                              <RefreshCw className="animate-spin h-4 w-4" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-3">
                    {/* Date */}
                    <div className="col-span-2">
                      <span className="font-medium">Date:</span> {formatDate(payment.payment_created_at || payment.order_created_at)}
                    </div>
                    {/* Contact */}
                    <div>
                      <span className="font-medium">Contact:</span> {payment.contact || "N/A"}
                    </div>
                    {/* Method */}
                    <div>
                      <span className="font-medium">Method:</span> {payment.method || "N/A"}
                    </div>
                    {/* Order ID */}
                    <div className="col-span-2 mt-2">
                      <span className="font-medium">Order ID:</span> <span className="font-mono break-all">{payment.order_id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Table Layout */}
        {/* Render if there's data and no error, regardless of current loading state (to show old data while fetching new) */}
        {!error && payments.length > 0 && (
          <Table
            payments={payments}
            displayStartIndex={displayStartIndex}
            getStatusBadge={getStatusBadge}
            getDisplayStatus={getDisplayStatus}
            formatDate={formatDate}
            handleRefreshTransaction={handleRefreshTransaction} // Pass the new prop
            refreshingOrderId={refreshingOrderId} // Pass loading state
          />
        )}

        {/* Loading Overlay: Appears when loading and there's existing data to show (and no error) */}
        {loading && payments.length > 0 && !error && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div> {/* End of relative content div */}

      {/* Pagination Controls */}
      {/* Show pagination if there are payments or if we're not on the first page (to allow going back), and no error */}
      {!error && (payments.length > 0 || currentPage > 1) && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage || loading} // Disabled if no next page or still loading
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllTransactions;