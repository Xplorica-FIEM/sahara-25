import React, { useState, useEffect } from 'react';

interface PaymentStatisticsData {
  total_transactions: number;
  successful_transactions: number;
  pending_transactions: number;
  failed_transactions: number;
  total_captured_amount_paise: number;
}

const PaymentsStatistics: React.FC = () => {
  const [stats, setStats] = useState<PaymentStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/payments-stats`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          credentials: "same-origin",
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
        } else {
          throw new Error(json.message || "Invalid API response for statistics");
        }
      } catch (err: any) {
        setError("Failed to load statistics.");
        console.error("❌ Failed to fetch payment statistics:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-4 text-gray-500">Loading statistics...</div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">{error || "Statistics data is unavailable."}</div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
        <h3 className="text-sm sm:text-lg font-semibold text-blue-900">Total Transactions</h3>
        <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.total_transactions}</p>
      </div>
      <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
        <h3 className="text-sm sm:text-lg font-semibold text-green-900">Successful</h3>
        <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.successful_transactions}</p>
      </div>
      <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
        <h3 className="text-sm sm:text-lg font-semibold text-yellow-900">Pending </h3>
        <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending_transactions}</p>
      </div>
      <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
        <h3 className="text-sm sm:text-lg font-semibold text-red-900">Failed </h3>
        <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.failed_transactions}</p>
      </div>
      <div className="bg-purple-50 p-3 sm:p-4 rounded-lg col-span-2 lg:col-span-1">
        <h3 className="text-sm sm:text-lg font-semibold text-purple-900">Total Amount</h3>
        <p className="text-xl sm:text-2xl font-bold text-purple-600">₹{(stats.total_captured_amount_paise / 100).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PaymentsStatistics;