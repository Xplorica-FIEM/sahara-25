import { Facebook, Instagram, Mail } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-amber-50 w-full px-6 pt-16 pb-10">
            {/* Centered container */}
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row flex-wrap justify-between gap-10">
                    {/* Brand */}
                    <div className="basis-60">
                        <h2 className="text-2xl font-bold text-amber-400 mb-4">
                            सhara
                        </h2>
                        <p className="text-sm">
                            Empowering kids through hands-on learning and <br />
                            creativity. Your support builds futures.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="basis-40">
                        <h3 className="text-lg font-semibold mb-3 text-amber-400">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#mission" className="hover:underline">
                                    Mission
                                </a>
                            </li>
                            <li>
                                <a href="#donate" className="hover:underline">
                                    Donate
                                </a>
                            </li>
                            <li>
                                <a href="#gallery" className="hover:underline">
                                    Gallery
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="basis-60">
                        <h3 className="text-lg font-semibold mb-3 text-amber-400">
                            Contact Us
                        </h3>
                        <p className="text-sm">
                            Email: sahara@xplorica.in <br />
                            Address: 123 Maker Street, Imagineland, Earth
                        </p>
                    </div>

                    {/* Social */}
                    <div className="basis-40">
                        <h3 className="text-lg font-semibold mb-3 text-amber-400">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-amber-400">
                                <Facebook />
                            </a>
                            <a href="#" className="hover:text-amber-400">
                                <Instagram />
                            </a>
                            <a href="#" className="hover:text-amber-400">
                                <Mail />
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="my-10 border-slate-700" />

                <p className="text-center text-xs text-slate-500">
                    &copy;{new Date().getFullYear()} XPLORICA. All rights
                    reserved.
                    <br />
                    All funds raised go directly towards supporting our mission
                    and programs. We are committed to transparency and
                    accountability in all our financial dealings.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
