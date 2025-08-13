"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Facebook } from "lucide-react";
import DATA_PREVIOUS_YEAR from "../data/PreviousYearData";

export default function PrevYear() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? DATA_PREVIOUS_YEAR.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === DATA_PREVIOUS_YEAR.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="w-full py-10">
      <h1 className="text-2xl font-extrabold text-center text-teal-400 mb-6">
        Previous Year Highlights
      </h1>

      <div className="relative max-w-3xl mx-auto">
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-2xl shadow-lg border border-teal-200">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {DATA_PREVIOUS_YEAR.map((event, i) => (
              <div
                key={i}
                className="min-w-full flex flex-col md:flex-row bg-teal-100"
              >
                {/* Image */}
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full md:w-1/2 h-64 md:h-auto object-cover"
                />

                {/* Info */}
                <div className="p-6 flex flex-col justify-between w-full md:w-1/2">
                  <div>
                    <h2 className="text-2xl md:text-5xl font-bold text-teal-800 mb-2">
                      {event.name}
                    </h2>
                    <p className="text-sm md:text-lg text-gray-600 mb-2">
                      📍 {event.venue.name}
                    </p>
                    {/* New: label above the amount */}
                    <p className="text-xs md:text-sm text-gray-500">
                      Collected amount
                    </p>
                    <p className="text-lg md:text-3xl font-semibold text-gray-800 mb-4">
                      ₹{event.collected_amount.toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={event.facebook_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-800"
                  >
                    <Facebook className="w-4 h-4" /> View on Facebook
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={prevSlide}
          className="md:ml-3 absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        >
          <ChevronLeft className="w-5 h-5 text-teal-700" />
        </button>
        <button
          onClick={nextSlide}
          className="md:mr-3 absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        >
          <ChevronRight className="w-5 h-5 text-teal-700" />
        </button>
      </div>
    </div>
  );
}
