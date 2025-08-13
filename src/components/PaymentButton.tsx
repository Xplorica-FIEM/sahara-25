import { useEffect, useRef } from "react";

/**
 * Razorpay Hosted Payment Button embed.
 * Uses the payment button id created on Razorpay Dashboard.
 * You can set VITE_RAZORPAY_BUTTON_ID to override the default.
 */
const PaymentButton = () => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const buttonId =
    import.meta.env.VITE_RAZORPAY_BUTTON_ID || "";

  useEffect(() => {
    if (!formRef.current) return;

    // Avoid duplicate script injection if component remounts
    const existing = document.querySelector(
      `script[data-payment_button_id='${buttonId}']`
    ) as HTMLScriptElement | null;
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", buttonId);
    formRef.current.appendChild(script);

    return () => {
      // Clean up only the script we added (if any)
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [buttonId]);

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-3 border border-teal-500">
      <div className="text-center pb-4 border-b border-gray-300">
        <h2 className="text-base md:text-lg font-semibold text-gray-700">
          Choose any amount to donate and make a change
        </h2>
      </div>
      <div className="pt-4 flex flex-col items-center">
        <form ref={formRef} className="flex justify-center"></form>
        <p className="mt-3 text-xs text-gray-500 text-center">
          You’ll be redirected to Razorpay Checkout.
        </p>
      </div>
    </div>
  );
};

export default PaymentButton;
