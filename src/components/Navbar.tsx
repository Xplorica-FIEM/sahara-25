import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl bg-teal-100 shadow-lg rounded-xl md:px-6 md:py-2 px-3 py-1 flex items-center justify-between border-teal-700 border">
            <div className="flex items-center justify-between w-full">
                <a href="#" className="text-gray-800 font-bold text-2xl ml-3">
                    साh<span className="italic text-teal-700 -ml-1">a</span>ra
                </a>

                <div className="hidden md:flex items-center space-x-4">
                    <a
                        href="#mission"
                        className="text-gray-800 font-medium transition hover:bg-teal-200/50 duration-150 rounded-md p-1"
                    >
                        MISSION
                    </a>
                    <a
                        href="#donate"
                        className="text-gray-800 font-medium transition hover:bg-teal-200/50 duration-150 rounded-md p-1"
                    >
                        DONATE
                    </a>
                    <a
                        href="#gallery"
                        className="text-gray-800 font-medium transition hover:bg-teal-200/50 duration-150 rounded-md p-1"
                    >
                        GALLERY
                    </a>
                </div>

                <a
                    href="https://xplorica.in"
                    className="text-gray-800 font-semibold transition hover:bg-teal-200/50 duration-150 rounded-md p-2 text-right flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                >
                    <h1 className="text-base/5 text-black/60">
                        an initiative <br />
                        from
                    </h1>
                    <img
                        src="/images/xplorica-logo.png"
                        alt="XPLORICA"
                        className="w-10 h-10 mix-blend-multiply"
                    />
                </a>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-800"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-teal-100 rounded-xl border border-teal-700 mt-2 px-6 py-4 flex flex-col space-y-3 md:hidden shadow-lg z-40">
                    <a
                        href="#mission"
                        className="text-gray-800 font-medium transition hover:bg-teal-200/50 duration-150 rounded-md p-2"
                        onClick={() => setIsOpen(false)}
                    >
                        MISSION
                    </a>
                    <a
                        href="#donate"
                        className="text-gray-800 font-medium transition hover:bg-teal-200/50 duration-150 rounded-md p-2"
                        onClick={() => setIsOpen(false)}
                    >
                        DONATE
                    </a>
                    <a
                        href="#gallery"
                        className="text-gray-800 font-medium transition hover:bg-teal-200/50 duration-150 rounded-md p-2"
                        onClick={() => setIsOpen(false)}
                    >
                        GALLERY
                    </a>
                    <a
                        href="https://xplorica.in"
                        className="text-gray-800 font-semibold transition hover:bg-teal-200/50 duration-150 rounded-md p-2 text-right"
                        onClick={() => setIsOpen(false)}
                    >
                        <img
                            src="/images/xplorica-logo.png"
                            alt="XPLORICA"
                            className="w-10 h-10 mix-blend-multiply"
                        />
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
