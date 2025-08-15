"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import DONOR_LIST from "../data/DonorDetails";

export default function DonorCardCarousel() {
    const [loading, setLoading] = useState(true);
    // Detect mobile viewport
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 640px)");
        const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
            setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
        // initialize
        setIsMobile(mql.matches);
        // subscribe (support older browsers)
        if (mql.addEventListener) mql.addEventListener("change", onChange as (e: MediaQueryListEvent) => void);
        else mql.addListener(onChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
        return () => {
            if (mql.removeEventListener) mql.removeEventListener("change", onChange as (e: MediaQueryListEvent) => void);
            else mql.removeListener(onChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
        };
    }, []);

    // Using donors from data file (removed inline list)
    const donorList = useMemo(() => DONOR_LIST, []);

    // Stable, pure formatter that uses a provided "now"
    const timeAgoFrom = useCallback((input: number | string | Date, now: number) => {
        // Parse various timestamp representations robustly
        const toTs = (val: number | string | Date) => {
            if (typeof val === "number") return val;
            if (val instanceof Date) return val.getTime();
            const s = String(val).trim();

            // Try native Date.parse first
            let t = Date.parse(s);
            if (!Number.isNaN(t)) return t;

            // Fallback: parse formats like "Fri Aug 15, 08:04pm"
            const m = s.match(/^(?:\w{3}\s+)?([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{1,2}):(\d{2})\s*(am|pm)$/i);
            if (m) {
                const [, monStr, dayStr, hourStr, minStr, ampm] = m;
                const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
                const monthIdx = months.indexOf(monStr.toLowerCase());
                if (monthIdx >= 0) {
                    const year = new Date().getFullYear();
                    let hour = parseInt(hourStr, 10) % 12;
                    if (ampm.toLowerCase() === "pm") hour += 12;
                    const minute = parseInt(minStr, 10);
                    const day = parseInt(dayStr, 10);
                    const dt = new Date(year, monthIdx, day, hour, minute);
                    return dt.getTime();
                }
            }

            // As a last resort, treat as "now" to avoid NaN
            return now;
        };

        const ts = toTs(input);
        // Clamp to avoid negative "future" durations
        const diff = Math.max(0, now - ts);
        const sec = Math.floor(diff / 1000);
        if (sec < 60) return "just now";
        const min = Math.floor(sec / 60);
        if (min < 60) return `${min}m ago`;
        const hr = Math.floor(min / 60);
        if (hr < 24) return `${hr}h ago`;
        const day = Math.floor(hr / 24);
        if (day < 7) return `${day}d ago`;
        const week = Math.floor(day / 7);
        if (week < 4) return `${week}w ago`;
        const month = Math.floor(day / 30);
        if (month < 12) return `${month}mo ago`;
        const year = Math.floor(day / 365);
        return `${year}y ago`;
    }, []);

    // Compute "now" once per render; updates once after loading completes
    const now = useMemo(() => Date.now(), [loading]);

    // Precompute derived fields to avoid repeating work in render
    const enrichedDonors = useMemo(
        () =>
            donorList
                // Skip donors whose amount is zero or less
                .filter((d) => (typeof d.amount === "number" ? d.amount > 0 : Number(d.amount) > 0))
                .map((d) => {
                    const parts = d.name.trim().split(/\s+/);
                    return {
                        ...d,
                        amountStr: d.amount.toLocaleString(),
                        nameParts: parts,
                        initials: `${(parts[0]?.[0] ?? "").toUpperCase()}${(parts[1]?.[0] ?? "").toUpperCase()}`,
                        timeStr: timeAgoFrom(d.timestamp, now),
                    };
                }),
        [donorList, now, timeAgoFrom]
    );

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Match animation speed responsively (faster on mobile)
    const carouselAnimStyle = useMemo(
        () => ({ animationDuration: isMobile ? "10s" : "20s" }),
        [isMobile]
    );

    const SkeletonCard = () => (
        <div className="min-w-[200px] sm:min-w-[240px] flex-shrink-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-3 sm:p-4 border border-teal-200 animate-pulse">
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
                <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
    );

    // Memoized skeleton keys to avoid recreating arrays
    const skeletonKeys = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

    return (
        <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-8 overflow-hidden">
            <h1 className="text-xl sm:text-2xl font-extrabold text-center text-teal-700 mb-4 sm:mb-6 tracking-tight">
                Donated By
            </h1>

            <div
                className="flex gap-3 sm:gap-5 animate-carousel will-change-transform"
                style={carouselAnimStyle}
            >
                {loading
                    ? skeletonKeys.map((i) => <SkeletonCard key={i} />)
                    : enrichedDonors.map((donor, i) => (
                        <div
                            key={i}
                            className="min-w-[200px] sm:min-w-[240px] flex-shrink-0 bg-teal-100/20 rounded-2xl p-4 sm:p-5 border border-teal-200 hover:scale-[1.02] transition-all duration-300"
                        >
                            <div className="flex gap-2 sm:gap-3 items-center mb-2 sm:mb-3">
                                {/* Replaced profile photo with initials */}
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-teal-500 bg-teal-50 text-teal-700 flex items-center justify-center shadow-sm">
                                    <span className="font-bold text-sm sm:text-base">{donor.initials}</span>
                                </div>
                                <p className="text-base sm:text-lg font-bold text-teal-700 leading-tight truncate">
                                    {donor.nameParts.map((part: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className={idx === 0 ? "" : "block text-xs sm:text-sm font-medium text-gray-500"}
                                        >
                                            {part}
                                        </span>
                                    ))}
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
                                    ₹{donor.amountStr}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    ⏳ {donor.timeStr}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
