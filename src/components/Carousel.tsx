"use client";
import { useState, useEffect } from "react";

export default function DonorCardCarousel() {
    const [loading, setLoading] = useState(true);

    const donors = [
        { name: "Saptarshi Chakraborty", amount: 150, time: "2h ago", pfp: "https://picsum.photos/200" },
        { name: "Sagnik Chakraborty", amount: 300, time: "1d ago", pfp: "https://picsum.photos/200" },
        { name: "Hakla Sharukh", amount: 75, time: "3h ago", pfp: "https://picsum.photos/200" },
        { name: "Raunak Manna", amount: 200, time: "4d ago", pfp: "https://picsum.photos/200" },
        { name: "Shamba Saha", amount: 90, time: "5h ago", pfp: "https://picsum.photos/200" },
        { name: "Saikat Tanti", amount: 500, time: "6d ago", pfp: "https://picsum.photos/200" },
        { name: "Swagnik G", amount: 120, time: "30m ago", pfp: "https://picsum.photos/200" },
        { name: "Bill Gates", amount: 100000, time: "1y ago", pfp: "https://picsum.photos/200" },
        { name: "Johnny Sins", amount: 69, time: "Nice", pfp: "https://picsum.photos/200" },
    ];

    const donorList = [...donors, ...donors];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const SkeletonCard = () => (
        <div className="min-w-[240px] flex-shrink-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-4 border border-teal-200 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
                <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
    );

    return (
        <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 py-8 overflow-hidden">
            <h1 className="text-2xl font-extrabold text-center text-teal-700 mb-6 tracking-tight">
                Donated By
            </h1>

            <div className="flex gap-5 animate-carousel">
                {loading
                    ? Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)
                    : donorList.map((donor, i) => (
                        <div
                            key={i}
                            className="min-w-[240px] flex-shrink-0 bg-teal-100/20 rounded-2xl p-5 border border-teal-200 hover:scale-[1.02] transition-all duration-300"
                        >
                            <div className="flex gap-3 items-center mb-3">
                                <img
                                    src={donor.pfp}
                                    alt={`${donor.name}'s profile`}
                                    className="w-12 h-12 rounded-full border-2 border-teal-500 shadow-sm"
                                />
                                <p className="text-lg font-bold text-teal-700 leading-tight truncate">
                                    {donor.name.split(" ").map((part, idx) => (
                                        <span
                                            key={idx}
                                            className={idx === 0 ? "" : "block text-sm font-medium text-gray-500"}
                                        >
                                            {part}
                                        </span>
                                    ))}
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-3xl font-extrabold text-gray-800 mb-1">
                                    ₹{donor.amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    ⏳ {donor.time}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
