import React, { useState } from "react";
import PaymentsStatistics from './PaymentsStatistics';
import AllTransactions from "./AllTransactions";

const PaymentsDashboard: React.FC = () => {

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        {/* Responsive header layout */}
        <div className="mb-4">
          {/* Mobile: Stack everything vertically */}
          <div className="block md:hidden">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Payments Dashboard</h1>
            
          </div>

          {/* Desktop: Title on left, controls on right */}
          <div className="hidden md:flex md:justify-between md:items-center">
            <h1 className="text-3xl font-bold text-gray-900">Payments Dashboard</h1>
          </div>
        </div>
        
         {/* Responsive statistics grid */}
         <PaymentsStatistics />

      </div>
      
      {/* Render TransactionsTable, passing only filter and sort props */}
      <AllTransactions 
        statusFilter={"all"} 
        amountSort={"default"} 
      />
    </div>
  );
};

export default PaymentsDashboard;
