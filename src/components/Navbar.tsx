const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl bg-amber-100 shadow-lg rounded-xl px-6 py-2 flex items-center justify-between border-amber-700 border-1">
            <div className="flex items-center space-x-6 text-center justify-between w-full">
                <a
                    href="#"
                    className="text-gray-800  transition font-bold text-2xl ml-3"
                >
                    सhara
                </a>
                <div className="flex space-x-4">
                    <a
                        href="#mission"
                        className="text-gray-800  font-medium transition hover:bg-amber-200/50 duration-150 rounded-md p-1"
                    >
                        MISSION
                    </a>
                    <a
                        href="#donate"
                        className="text-gray-800  font-medium transition hover:bg-amber-200/50 duration-150 rounded-md p-1"
                    >
                        DONATE
                    </a>
                    <a
                        href="#gallery"
                        className="text-gray-800  font-medium transition hover:bg-amber-200/50 duration-150 rounded-md p-1"
                    >
                        GALLERY
                    </a>
                </div>
                <a
                    href="https://xplorica.in"
                    className="text-gray-800 transition font-semibold hover:bg-amber-200/50 duration-150 rounded-md p-1"
                >
                    <h2 className="-mb-2 text-black/60 px-7">from</h2>
                    <h1>XPLORICA</h1>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
