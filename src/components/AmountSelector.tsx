import { useMemo } from "react";

interface AmountSelectorProps {
  selectedAmount: number;
  customAmount: string;
  onSelectAmount: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
}

export default function AmountSelector({
  selectedAmount,
  customAmount,
  onSelectAmount,
  onCustomAmountChange,
}: AmountSelectorProps) {
  const donationOptions = useMemo(
    () => [
      { amount: 30, label: "₹30" },
      { amount: 50, label: "₹50" },
      { amount: 100, label: "₹100" },
      { amount: 500, label: "₹500" },
      { amount: 1000, label: "₹1000" },
      { amount: 1500, label: "₹1500" },
    ],
    []
  );

  return (
    <div className="grid grid-cols-4 gap-2">
      {donationOptions.map((option) => (
        <button
          key={option.amount}
          onClick={() => onSelectAmount(option.amount)}
          className={`col-span-2 py-3 px-2 rounded-lg border transition-all text-sm font-medium ${
            selectedAmount === option.amount && !customAmount
              ? "bg-teal-500 border-teal-600 text-white"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {option.label}
        </button>
      ))}

      <input
        type="text"
        placeholder="Other"
        value={(customAmount && "₹") + customAmount}
        onChange={(e) => onCustomAmountChange(e.target.value)}
        className={`col-span-4 py-3 px-2 rounded-lg border text-sm font-medium text-center focus:outline-none focus:ring-2 ${
          selectedAmount > 0 && customAmount
            ? "bg-teal-100 border-teal-500 ring-teal-300"
            : "bg-gray-100 border-gray-300"
        }`}
      />
    </div>
  );
}
