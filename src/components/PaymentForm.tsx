"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function PaymentForm() {
    const [selectedAmount, setSelectedAmount] = useState(3200);
    const [customAmount, setCustomAmount] = useState("");

    const donationOptions = [
        { amount: 10, label: "₹10" },
        { amount: 50, label: "₹50" },
        { amount: 100, label: "₹100" },
        { amount: 500, label: "₹500" },
    ];

    const handleCustomAmount = (value: string) => {
        const numericValue = value.replace(/\D/g, "");
        setCustomAmount(numericValue);
        setSelectedAmount(Number(numericValue) || 0);
    };

    return (
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-3 border border-teal-500">
            <div className="text-center pb-4 border-b border-gray-300">
                <h1 className="text-base md:text-lg font-semibold text-gray-700">
                    Choose an amount to donate and make a change
                </h1>
            </div>

            <div className="space-y-4 pt-4">
                <div className="grid grid-cols-4 gap-2">
                    {donationOptions.map((option) => (
                        <button
                            key={option.amount}
                            onClick={() => {
                                setSelectedAmount(option.amount);
                                setCustomAmount("");
                            }}
                            className={`col-span-2 py-3 px-2 rounded-lg border transition-all text-sm font-medium ${
                                selectedAmount === option.amount
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
                        onChange={(e) => handleCustomAmount(e.target.value)}
                        className={`col-span-4 py-3 px-2 rounded-lg border text-sm font-medium text-center focus:outline-none focus:ring-2 ${
                            selectedAmount === 0 && customAmount
                                ? "bg-teal-100 border-teal-500 ring-teal-300"
                                : "bg-gray-100 border-gray-300"
                        }`}
                    />
                </div>

                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm py-3 rounded-lg transition-colors duration-200">
                    DONATE {selectedAmount > 0 ? `₹${selectedAmount}` : ""}
                </button>

                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-600 pt-2 text-center">
                    <Lock className="h-full" />
                    <span>
                        Secure Payment · This site is protected by reCAPTCHA and
                        the Google{" "}
                        <a href="#" className="underline hover:text-gray-800">
                            Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline hover:text-gray-800">
                            Terms of Service
                        </a>{" "}
                        apply.
                    </span>
                </div>
            </div>
        </div>
    );
}
