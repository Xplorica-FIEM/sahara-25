import React from "react";

const Payment = () => {
    return (
        <div
            className="min-h-screen flex flex-col items-center bg-amber-50 p-5 pt-24"
            id="donate"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 mt-16">
                "Over <span className="text-amber-400">260 million</span>{" "}
                children around the world <br /> still lack access to basic
                education."
            </h1>
            <p className="text-base md:text-lg text-amber-700 text-center w-2/3">
                Your contribution helps us teach problem-solving, creativity, and
                technical skills through hands-on learning, empowering the next
                generation of makers.
            </p>

            <div className="mt-10 w-full flex justify-center">
                <div className="bg-red-400 w-full max-w-md h-96 rounded-xl shadow-lg flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                        [Payment Form Placeholder]
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Payment;
