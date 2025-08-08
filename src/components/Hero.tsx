const Hero = () => {
    return (
        <div className="relative h-screen w-full">
            <img
                src="/images/hero.jpg"
                alt="smile"
                className="w-full h-full object-cover"
            />

            {/* Overlay Text */}
            <div className="absolute top-1/3 left-8 md:left-16 lg:left-36 text-white max-w-xl text-shadow-lg/30">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                    They didn&apos;t choose this life.
                    <br />
                    But you can choose to{" "}
                    <span className="text-amber-400">change it.</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-white">
                    join us in our mission to support those in need.
                </p>
                <a
                    href="#donate"
                    className="mt-6 inline-block bg-amber-100 text-gray-800 px-6 py-3 text-shadow-none rounded-xl border border-amber-700 font-semibold hover:bg-amber-300 transition-colors shadow-xl "
                >
                    Get Involved
                </a>
            </div>
        </div>
    );
};

export default Hero;
