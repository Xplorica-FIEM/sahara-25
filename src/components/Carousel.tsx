import React from "react";
import ReactTimeAgo from "react-time-ago";
import { Crown } from "lucide-react";

interface InfiniteScrollDonorsProps {
  speed?: number; // seconds per loop
  direction?: "left" | "right";
}

// ---- API types & in-memory cache (module scoped) ----
type ApiDonation = {
  order_id: string;
  payment_id: string | null;
  status: string;
  amount_paise: number;
  amount_rupees: string | number;
  currency: string;
  method: string | null;
  email: string | null;
  contact: string | null;
  captured: boolean | null;
  order_created_at: string | null;
  payment_created_at: string | null;
  donor: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  receipt: string | null;
};

type TopPaymentsResponse = {
  success: boolean;
  count: number;
  data: ApiDonation[];
};

const backendBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_ENDPOINT = `${backendBaseUrl}/top-payments`; // same-origin or dev proxy
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

let topPaymentsCache: { data: ApiDonation[]; expiresAt: number } | null = null;
let topPaymentsInflight: Promise<ApiDonation[]> | null = null;

async function fetchTopPayments(): Promise<ApiDonation[]> {
  const now = Date.now();
  if (topPaymentsCache && topPaymentsCache.expiresAt > now) {
    return topPaymentsCache.data;
  }
  if (topPaymentsInflight) return topPaymentsInflight;

  topPaymentsInflight = fetch(API_ENDPOINT, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  })
    .then(async (res) => {
      if (!res.ok)
        throw new Error(`Failed to load top payments: ${res.status}`);
      const json = (await res.json()) as TopPaymentsResponse;
      const data = Array.isArray(json?.data) ? json.data : [];
      topPaymentsCache = { data, expiresAt: now + CACHE_TTL_MS };
      return data;
    })
    .finally(() => {
      topPaymentsInflight = null;
    });

  return topPaymentsInflight;
}

const InfiniteScrollDonors: React.FC<InfiniteScrollDonorsProps> = ({
  speed = 20,
  direction = "left",
}) => {
  const [rows, setRows] = React.useState<ApiDonation[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // load once with cache; StrictMode double-mount safe due to inflight promise
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchTopPayments();
        if (mounted) setRows(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load data");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Extract only captured donations and sort by amount desc
  const donors = React.useMemo(() => {
    const source = rows ?? [];
    return source
      .filter((d) => d.status === "captured")
      .map((d) => ({
        name: d.donor?.name ?? "Anonymous",
        amount: Number(
          typeof d.amount_rupees === "string"
            ? parseFloat(d.amount_rupees)
            : d.amount_rupees
        ),
        timestamp: d.payment_created_at ?? d.order_created_at ?? null,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [rows]);

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

export default React.memo(InfiniteScrollDonors);
