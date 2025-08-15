import DonorCarousel from "./Carousel";
import PaymentForm from "./PaymentForm";
import FeatureRule from "../data/Feature.Rules";
import PaymentButton from "./PaymentButton";

const Payment = () => {
  return (
    <div
      className="flex flex-col items-center bg-gray-50 p-5 pt-20"
      id="donate"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 mt-10 text-gray-700">
        Over <span className="text-teal-500">260 million</span> children around
        the world <br /> still lack access to basic education.
      </h1>
      {/* <p className="text-sm md:text-base text-gray-700 text-center max-w-2xl mb-8">
                Your contribution helps us teach problem-solving, creativity,
                and technical skills through hands-on learning, empowering the
                next generation of makers.
            </p> */}
            <div className="p-5">
                {FeatureRule?.paymentButton ? (
                    <PaymentButton />
                ) : (
                    <PaymentForm />
                )}
            </div>

            {FeatureRule?.ShowDonors && <DonorCarousel />}
        </div>
    );
};

export default Payment;
