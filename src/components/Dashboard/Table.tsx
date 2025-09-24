import React from 'react';
import type { ApiDonation } from './AllTransactions'; // Assuming ApiDonation is exported from AllTransactions.tsx
import { RefreshCw } from 'lucide-react'; // Import RefreshCw icon

interface TableProps {
  payments: ApiDonation[];
  displayStartIndex: number;
  getStatusBadge: (status: string) => string;
  getDisplayStatus: (status: string) => string;
  formatDate: (dateString: string | null) => string;
  handleRefreshTransaction: (orderId: string) => void; // New prop for refresh action
  refreshingOrderId: string | null; // New prop to indicate which order is refreshing
}

const Table: React.FC<TableProps> = ({ payments, displayStartIndex, getStatusBadge, getDisplayStatus, formatDate, handleRefreshTransaction, refreshingOrderId }) => {
  return (
    <div className="hidden sm:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Donor & Email</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">Date</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment, index) => (
            <tr key={`${payment.order_id}-${payment.payment_id || index}`} className="hover:bg-gray-50">
              <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">{displayStartIndex + index + 1}</td>
              <td className="px-4 py-2 text-sm text-gray-900 min-w-[200px]">
                <p className="font-medium">{payment.donor?.name || "Anonymous"}</p>
                <p className="text-gray-500 text-xs break-all">{payment.email || "N/A"}</p>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{payment.amount_rupees}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(payment.status)}`}>{getDisplayStatus(payment.status)}</span>
                  {payment.status.toLowerCase() === 'created' && (
                    <button
                      onClick={() => handleRefreshTransaction(payment.order_id)}
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
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 min-w-[180px]">{formatDate(payment.payment_created_at || payment.order_created_at)}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{payment.contact || "N/A"}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{payment.method || "N/A"}</td>
              <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-gray-900">{payment.order_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;