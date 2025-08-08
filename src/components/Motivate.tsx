import React from "react";

const Motivate = () => {
    const images = [
        { src: "/images/gallery/1.webp", alt: "Gallery 1" },
        { src: "/images/gallery/2.webp", alt: "Gallery 2" },
        { src: "/images/gallery/3.webp", alt: "Gallery 3" },
        { src: "/images/gallery/4.webp", alt: "Gallery 4" },
        { src: "/images/gallery/5.webp", alt: "Gallery 5" },
        { src: "/images/gallery/6.webp", alt: "Gallery 6" },
        { src: "/images/gallery/7.webp", alt: "Gallery 7" },
        { src: "/images/gallery/8.webp", alt: "Gallery 8" },
    ];

    return (
        <div
            className="min-h-screen flex flex-col items-center bg-slate-900 text-white p-5 pt-24 pb-10"
            id="gallery"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 mt-16">
                Know that your donation is making a{" "}
                <span className="text-amber-400">difference</span>
            </h1>
            <p className="text-base md:text-lg text-amber-700 text-center w-2/3 mb-10">
                Sahara uses 100% of your donation to teach, empower, and inspire
                the next generation of makers, from the bottom of the social
                ladder. We provide names and photos of all of our funding
                recipients, with a detailed estimate of how funds are being
                used.
            </p>

            {/* Grid Image Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 max-w-6xl w-full px-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="w-full h-60 overflow-hidden rounded-xl shadow-lg"
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Motivate;
