"use client";

export default function DonorCarousel() {
    const donors = [
        "Saptarshi Chakraborty",
        "Sagnik Chakraborty",
        "Hakla Sharukh",
        "Raunak Manna",
        "Shamba Saha",
        "Saikat Tanti",
        "Swagnik G",
        "Mia Khalifa",
        "Bill Gates",
        "Johnny Sins",
    ];

    return (
        <div className="w-full bg-gray-50 py-4 overflow-hidden">
            <h1 className="text-xl font-bold text-center text-slate-800">
                Donated By
            </h1>
            <div
                className="flex gap-6 animate-scroll-fast whitespace-nowrap"
                style={{
                    animation: "scroll-left-fast 20s linear infinite",
                }}
            >
                {[
                    ...donors.sort(() => Math.random() - 0.5),
                    ...donors.sort(() => Math.random() - 0.5),
                ].map((name, i) => (
                    <span
                        key={`row1-${i}`}
                        className="text-base text-teal-500 opacity-70 font-medium"
                    >
                        {name}
                    </span>
                ))}
            </div>

            <div
                className="flex gap-6 animate-scroll-slow whitespace-nowrap "
                style={{
                    animation: "scroll-left-slow 30s linear infinite",
                    animationDelay: "-15s", // offset start
                }}
            >
                {[
                    ...donors.sort(() => Math.random() - 0.5),
                    ...donors.sort(() => Math.random() - 0.5),
                ].map((name, i) => (
                    <span
                        key={`row2-${i}`}
                        className="text-lg text-teal-500 opacity-70 font-medium"
                    >
                        {name}
                    </span>
                ))}
            </div>
        </div>
    );
}
