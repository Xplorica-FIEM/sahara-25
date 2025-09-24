import React from 'react';

interface PaymentsStatisticsProps {
  totalPaymentsCount: number;
  successfulPaymentsCount: number;
  pendingPaymentsCount: number;
  failedPaymentsCount: number;
  totalCapturedPaise: number;
}

const PaymentsStatistics: React.FC<PaymentsStatisticsProps> = ({
  totalPaymentsCount,
  successfulPaymentsCount,
  pendingPaymentsCount,
  failedPaymentsCount,
  totalCapturedPaise,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
        <h3 className="text-sm sm:text-lg font-semibold text-blue-900">Total (DB)</h3>
        <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalPaymentsCount}</p>
      </div>
      <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
        <h3 className="text-sm sm:text-lg font-semibold text-green-900">Successful (Loaded)</h3>
        <p className="text-xl sm:text-2xl font-bold text-green-600">{successfulPaymentsCount}</p>
      </div>
      <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
        <h3 className="text-sm sm:text-lg font-semibold text-yellow-900">Pending (Loaded)</h3>
        <p className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingPaymentsCount}</p>
      </div>
      <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
        <h3 className="text-sm sm:text-lg font-semibold text-red-900">Failed (Loaded)</h3>
        <p className="text-xl sm:text-2xl font-bold text-red-600">{failedPaymentsCount}</p>
      </div>
      <div className="bg-purple-50 p-3 sm:p-4 rounded-lg col-span-2 lg:col-span-1">
        <h3 className="text-sm sm:text-lg font-semibold text-purple-900">Total Amount</h3>
        <p className="text-xl sm:text-2xl font-bold text-purple-600">₹{(totalCapturedPaise / 100).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PaymentsStatistics;