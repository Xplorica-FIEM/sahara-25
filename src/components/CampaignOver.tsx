import { Facebook, Gift, Heart, Instagram, Linkedin } from "lucide-react";

const CampaignOver = () => {
  return (
    <div
      className="flex flex-col items-center bg-gray-50 p-5 py-20"
      id="donate"
    >
      <div className="text-center max-w-3xl mx-auto">
        <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
          <Gift className="w-8 h-8 text-teal-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Our Donation Drive is Over!
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-6">
          This year's Sahara Donation Drive has successfully concluded. A huge
          thank you to everyone who contributed and supported our cause. Your
          generosity will make a significant impact.
        </p>
        <p className="text-base md:text-lg text-gray-600 mb-6">
          We will be sharing detailed updates and pictures from the drive on our
          social media accounts soon. Stay tuned to see the change you helped
          create!
        </p>
        <div className="flex items-center justify-center gap-2 font-semibold text-teal-600 mb-8">
          <Heart className="w-5 h-5 fill-current" />
          <span>#Sahara2025</span>
        </div>
        <div className="flex justify-center space-x-6">
          <a
            href="https://instagram.com/xplorica.fiem"
            className="text-gray-500 hover:text-teal-600 transition-colors"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Instagram className="w-7 h-7" />
          </a>
          <a
            href="https://www.facebook.com/XplOriCa.fiem"
            className="text-gray-500 hover:text-teal-600 transition-colors"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <Facebook className="w-7 h-7" />
          </a>
          <a
            href="https://www.linkedin.com/company/xplorica"
            className="text-gray-500 hover:text-teal-600 transition-colors"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-7 h-7" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CampaignOver;