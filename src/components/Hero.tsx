const Hero = () => {
    return (
        <div className="relative h-screen w-full">
            <img
                src="/images/hero.webp"
                alt="smile"
                className="w-full h-full object-cover"
            />

            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

            {/* Existing top-left content */}
            <div className="absolute top-1/3 left-8 md:left-16 lg:left-36 text-white max-w-xl text-shadow-lg/30">
                <p className="mt-4 text-xl text-white/90 font-extrabold">
                    <span className="text-teal-300">#Udaan</span>सhara
                </p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                    They didn&apos;t choose this life.
                    <br />
                    But you can choose to{" "}
                    <span className="text-teal-400">
                        <span className="italic">change </span>it.
                    </span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-white">
                    join us in our mission to support those in need
                </p>
                <a
                    href="#donate"
                    className="mt-6 inline-block bg-teal-100 text-gray-800 px-6 py-3 text-shadow-none rounded-xl border border-teal-700 font-semibold hover:bg-teal-300 transition-colors shadow-xl"
                >
                    Donate Now
                </a>
            </div>

            {/* New bottom-right text */}
            <div className="absolute bottom-4 right-6 text-white text-sm md:text-base text-right bg-black/50 px-3 py-1 rounded-lg md:block hidden">
                Children of fallen illegal coal miners grow up in the shadows —
                <br />
                with empty plates, lost dreams, and no safety net.
            </div>
        </div>
    );
};

export default Hero;
