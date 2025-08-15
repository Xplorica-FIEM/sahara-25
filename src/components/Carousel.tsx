import React from "react";
import DONOR_LIST from "../data/DonorDetails";
import ReactTimeAgo from "react-time-ago";

interface InfiniteScrollDonorsProps {
    speed?: number; // seconds per loop
    direction?: "left" | "right";
}

const InfiniteScrollDonors: React.FC<InfiniteScrollDonorsProps> = ({
    speed = 20,
    direction = "left",
}) => {
    return (
        <div className="relative w-full overflow-hidden">
            <div className="w-full text-center font-bold text-xl my-2">
                Donated by
            </div>
            <div
                className="flex whitespace-nowrap"
                style={{
                    animation: `${
                        direction === "left" ? "scroll-left" : "scroll-right"
                    } ${speed}s linear infinite`,
                }}
            >
                {/* Repeat twice for seamless scroll */}
                {[...Array(2)].map((_, loopIndex) => (
                    <React.Fragment key={loopIndex}>
                        {DONOR_LIST.filter((d) => d.name && d.amount > 0).map(
                            (donor, index) => (
                                <div
                                    key={`${loopIndex}-${index}`}
                                    className="bg-white shadow-md rounded-lg px-4 py-2 mx-2 flex border border-teal-500 flex-col justify-center items-start min-w-[200px]"
                                >
                                    <div className="flex flex-col items-start mb-2">
                                        <span className="text-sm text-gray-500">
                                            <ReactTimeAgo
                                                date={new Date(donor.timestamp)}
                                                locale="en-US"
                                            />
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            {donor.name.split(" ")[0]}{" "}
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
                            )
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default InfiniteScrollDonors;
