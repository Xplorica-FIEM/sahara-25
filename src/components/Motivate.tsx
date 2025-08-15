import PrevYear from "./PrevYears";

const Motivate = () => {
    const images = [
        { src: "/images/gallery/img1.webp", alt: "Gallery 1" },
        { src: "/images/gallery/img2.webp", alt: "Gallery 2" },
        { src: "/images/gallery/img3.webp", alt: "Gallery 3" },
        { src: "/images/gallery/img4.webp", alt: "Gallery 4" },
        { src: "/images/gallery/img5.webp", alt: "Gallery 5" },
        { src: "/images/gallery/img6.webp", alt: "Gallery 6" },
        { src: "/images/gallery/img7.webp", alt: "Gallery 7" },
        { src: "/images/gallery/img8.webp", alt: "Gallery 8" },
    ];

    return (
        <div
            className="min-h-screen flex flex-col items-center bg-slate-900 text-white p-5 pt-24 pb-10"
            id="gallery"
        >
            <PrevYear />

            <div className="relative flex justify-center md:w-1/2 -mt-4">
                <img
                    src="/images/trasparency/sahara_expenses_2024.webp"
                    alt="Final"
                    className="max-w-full rounded-xl shadow-lg object-cover"
                />
                <div className="absolute md:bottom-4 bottom-2 md:left-4 left-2 text-white md:text-md text-xs font-semibold bg-black/50 px-3 py-1 rounded-md">
                    Sahara 2024 Donation Transparency
                </div>
            </div>


            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 mt-16">
                Know that your donation is making a{" "}
                <span className="text-teal-400">difference</span>
            </h1>
            <p className="text-base md:text-lg text-teal-700 text-center md:w-2/3 mb-10">
                Sahara uses 100% of your donation to teach, empower, and inspire
                the next generation of makers, from the bottom of the social
                ladder. We provide names and photos of all of our funding
                recipients, with a detailed estimate of how funds are being
                used.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 max-w-6xl w-full px-4 mx-auto">
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

            <div className="w-full mt-2 px-4 mx-auto max-w-6xl">
                <div className="relative w-full">
                    <img
                        src="/images/final_medium.webp"
                        alt="Final"
                        className="w-full rounded-xl shadow-lg object-cover"
                    />
                    <div className="absolute bottom-4 left-4 text-white text-xl font-semibold bg-black/50 px-3 py-1 rounded-md">
                        Sahara 2024
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Motivate;
