import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl bg-amber-100 shadow-lg rounded-xl px-6 py-2 flex items-center justify-between border-amber-700 border">
            <div className="flex items-center justify-between w-full">
                {/* Logo */}
                <a href="#" className="text-gray-800 font-bold text-2xl ml-3">
                    सh<span className="italic text-amber-700 -ml-1">a</span>ra
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-4">
                    <a
                        href="#mission"
                        className="text-gray-800 font-medium transition hover:bg-amber-200/50 duration-150 rounded-md p-1"
                    >
                        MISSION
                    </a>
                    <a
                        href="#donate"
                        className="text-gray-800 font-medium transition hover:bg-amber-200/50 duration-150 rounded-md p-1"
                    >
                        DONATE
                    </a>
                    <a
                        href="#gallery"
                        className="text-gray-800 font-medium transition hover:bg-amber-200/50 duration-150 rounded-md p-1"
                    >
                        GALLERY
                    </a>
                </div>

                {/* Right-side brand */}
                <a
                    href="https://xplorica.in"
                    className="hidden md:block text-gray-800 transition font-semibold hover:bg-amber-200/50 duration-150 rounded-md p-1 text-right"
                >
                    <h2 className="-mb-2 text-black/60 px-7">from</h2>
                    <h1>XPLORICA</h1>
                </a>

                {/* Hamburger Icon */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-800"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-amber-100 rounded-xl border border-amber-700 mt-2 px-6 py-4 flex flex-col space-y-3 md:hidden shadow-lg z-40">
                    <a
                        href="#mission"
                        className="text-gray-800 font-medium transition hover:bg-amber-200/50 duration-150 rounded-md p-2"
                        onClick={() => setIsOpen(false)}
                    >
                        MISSION
                    </a>
                    <a
                        href="#donate"
                        className="text-gray-800 font-medium transition hover:bg-amber-200/50 duration-150 rounded-md p-2"
                        onClick={() => setIsOpen(false)}
                    >
                        DONATE
                    </a>
                    <a
                        href="#gallery"
                        className="text-gray-800 font-medium transition hover:bg-amber-200/50 duration-150 rounded-md p-2"
                        onClick={() => setIsOpen(false)}
                    >
                        GALLERY
                    </a>
                    <a
                        href="https://xplorica.in"
                        className="text-gray-800 font-semibold transition hover:bg-amber-200/50 duration-150 rounded-md p-2 text-right"
                        onClick={() => setIsOpen(false)}
                    >
                        <h2 className="-mb-1 text-black/60">from</h2>
                        <h1>XPLORICA</h1>
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
