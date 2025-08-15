import React from "react";
import DUMMY_DETAILS from "../data/DummyDetails.json";
import ReactTimeAgo from "react-time-ago";
import { Crown } from "lucide-react";

interface InfiniteScrollDonorsProps {
    speed?: number; // seconds per loop
    direction?: "left" | "right";
}

const InfiniteScrollDonors: React.FC<InfiniteScrollDonorsProps> = ({
    speed = 20,
    direction = "left",
}) => {
    // Extract only captured donations
    const donors = DUMMY_DETAILS.data
        .filter((d) => d.status === "captured")
        .map((d) => ({
            name: d.donor.name,
            amount: parseFloat(d.amount_rupees),
            timestamp: d.payment_created_at,
        }))
        .sort((a, b) => b.amount - a.amount); // highest donations first

    const tierColors = [
        {
            bgClass: "bg-[#FFD700]/20",
            label: "Gold Contributor",
            crown: "gold",
        },
        {
            bgClass: "bg-[#C0C0C0]/20",
            label: "Silver Contributor",
            crown: "silver",
        },
        {
            bgClass: "bg-[#CD7F32]/20",
            label: "Bronze Contributor",
            crown: "#CD7F32",
        },
    ];

    return (
        <div className="relative w-full overflow-hidden">
            <div className="w-full text-center font-bold text-xl my-2">
                Donated by
            </div>

            {/* Top 3 Contributors */}
            <div className="flex w-full flex-col md:flex-row p-2 gap-2">
                {donors.slice(0, 3).map((donor, index) => {
                    const tier = tierColors[index] || tierColors[2];
                    return (
                        <div
                            key={index}
                            className={`${tier.bgClass} shadow-md rounded-lg px-4 py-2 flex border border-teal-500 flex-col justify-between items-start min-w-[200px] w-full`}
                        >
                            <div className="flex items-center gap-2 justify-between w-full">
                                <span className="text-teal-600 text-xs flex items-center gap-1">
                                    {tier.label}{" "}
                                    <Crown
                                        className="w-4 h-4"
                                        color={tier.crown}
                                    />
                                </span>
                                <span className="text-sm text-gray-500">
                                    <ReactTimeAgo
                                        date={new Date(donor.timestamp ?? "")}
                                        locale="en-US"
                                    />
                                </span>
                            </div>
                            <hr className="w-full border-t border-gray-200 my-2" />
                            <div className="flex items-center gap-2 justify-between w-full">
                                <div className="flex flex-col items-start mb-2 w-full">
                                    <span className="font-semibold text-gray-800 text-xl">
                                        {donor.name.split(" ")[0]}
                                        <div className="text-gray-500">
                                            {donor.name
                                                .split(" ")
                                                .slice(1)
                                                .join(" ")}
                                        </div>
                                    </span>
                                </div>
                                <span className="text-teal-600 font-bold text-4xl text-right w-full">
                                    ₹{donor.amount}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Infinite Scrolling List */}
            <div
                className="flex whitespace-nowrap"
                style={{
                    animation: `${
                        direction === "left" ? "scroll-left" : "scroll-right"
                    } ${speed}s linear infinite`,
                }}
            >
                {[...Array(2)].map((_, loopIndex) => (
                    <React.Fragment key={loopIndex}>
                        {donors.map((donor, index) => (
                            <div
                                key={`${loopIndex}-${index}`}
                                className="bg-white shadow-md rounded-lg px-4 py-2 ml-2 flex border border-teal-500 flex-col justify-between items-start min-w-[200px]"
                            >
                                <div className="flex flex-col items-start mb-2">
                                    <span className="text-sm text-gray-500">
                                        <ReactTimeAgo
                                            date={
                                                new Date(donor.timestamp ?? "")
                                            }
                                            locale="en-US"
                                        />
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        {donor.name.split(" ")[0]}
                                        <div className="text-gray-500">
                                            {donor.name
                                                .split(" ")
                                                .slice(1)
                                                .join(" ")}
                                        </div>
                                    </span>
                                </div>
                                <span className="text-teal-600 font-bold text-4xl text-center w-full">
                                    ₹{donor.amount}
                                </span>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default InfiniteScrollDonors;
