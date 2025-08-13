import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-teal-50 w-full px-6 pt-16 pb-10">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row flex-wrap justify-between">
                    <div className="basis-full md:basis-60 mb-8 md:mb-0">
                        <h2 className="text-2xl font-bold text-teal-400 mb-4">
                            साhara
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Empowering kids through hands-on learning and <br />
                            creativity. Your support builds futures.
                        </p>
                    </div>

                    <div className="basis-full md:basis-40 mb-8 md:mb-0">
                        <h3 className="text-lg font-semibold mb-3 text-teal-400">
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
                    <div className="basis-full md:basis-60 mb-8 md:mb-0">
                        <h3 className="text-lg font-semibold mb-3 text-teal-400">
                            Contact Us
                        </h3>
                        <p className="text-sm leading-relaxed">
                            Email: <a href="mailto:xplorica@teamfuture.in" className="hover:underline">xplorica@teamfuture.in</a> <br />
                            Mobile: <a href="tel:+919831658714" className="hover:underline">+919831658714</a> <br />
                            Address: <a
                                href="https://maps.app.goo.gl/AJ3ZXVeJFiCSJhy56"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline"
                            >
                                Sonarpur Station Road, Kolkata , 700150, India
                            </a>
                        </p>
                    </div>

                    <div className="basis-full md:basis-40">
                        <h3 className="text-lg font-semibold mb-3 text-teal-400">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://instagram.com/xplorica.fiem"
                                className="hover:text-teal-400"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Instagram />
                            </a>
                            <a
                                href="https://www.facebook.com/XplOriCa.fiem"
                                className="hover:text-teal-400"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Facebook />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/xplorica"
                                className="hover:text-teal-400"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Linkedin />
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="my-10 border-slate-300" />

                <p className="text-center text-xs text-slate-500 leading-relaxed">
                    &copy;{new Date().getFullYear()} XPLORICA, All rights
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
