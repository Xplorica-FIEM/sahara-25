"use client";

import { useState } from "react";
import { loadRazorpayScript } from "../lib/razorpay";
import AmountSelector from "./AmountSelector";
import DonorDetailsForm from "./DonorDetailsForm";
import SecurePaymentFooter from "./SecurePaymentFooter";

declare global {
  interface Window {
    Razorpay: new (options: any) => {
      open: () => void;
      on: (evt: string, cb: (data: any) => void) => void;
    };
  }
}

export default function PaymentForm() {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMobile, setDonorMobile] = useState("");
  // New: two-step flow
  const [stage, setStage] = useState<"amount" | "details">("amount");
  // New: captcha state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setCustomAmount(numericValue);
    setSelectedAmount(Number(numericValue) || 0);
  };

  // New: primary action router
  const handlePrimaryAction = async () => {
    setError(null);
    if (stage === "amount") {
      if (!selectedAmount || selectedAmount <= 0) {
        setError("Please select or enter an amount.");
        return;
      }
      setStage("details");
      return;
    }
    // stage === "details"
    await startPayment();
  };

  const backendBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID as
    | string
    | undefined;

  // New: Turnstile site key (Vite env)
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as
    | string
    | undefined;

  const startPayment = async () => {
    setError(null);
    // Validate required fields for details step
    if (!donorName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!selectedAmount || selectedAmount <= 0) {
      setError("Please select or enter an amount.");
      return;
    }
    // Basic validations
    const mobileDigits = donorMobile.replace(/\D/g, "");
    if (!mobileDigits || mobileDigits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (donorEmail && !/^\S+@\S+\.\S+$/.test(donorEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!razorpayKeyId) {
      setError("Missing public Razorpay key (VITE_RAZORPAY_KEY_ID).");
      return;
    }
    // New: ensure captcha is verified
    if (!captchaToken) {
      setError("Please complete the captcha verification.");
      return;
    }

    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // 1) Create order on backend
      const orderRes = await fetch(`${backendBaseUrl}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedAmount,
          currency: "INR",
          receipt: `donation_${Date.now()}`,
          donor: {
            name: donorName || "",
            email: donorEmail || "",
            contact: mobileDigits,
          },
          // New: pass captcha token for server-side verification
          turnstileToken: captchaToken,
        }),
      });

      if (!orderRes.ok) {
        // Surface backend error to the UI
        let errMsg = "Failed to create order";
        try {
          const errJson = await orderRes.json();
          errMsg = errJson?.message || errMsg;
        } catch {
          try {
            errMsg = await orderRes.text();
          } catch {}
        }
        throw new Error(errMsg);
      }

      const order = await orderRes.json();

      // 2) Open Razorpay checkout
      const options: any = {
        key: razorpayKeyId,
        amount: order.amount, // in subunits from backend
        currency: order.currency,
        name: "Donation",
        description: "Sahara 2025 Donation",
        order_id: order.id,
        prefill: {
          name: donorName || undefined,
          email: donorEmail || undefined,
          contact: mobileDigits,
        },
        handler: async function (response: any) {
          try {
            // 3) Verify on backend
            const verifyRes = await fetch(`${backendBaseUrl}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (verifyRes.ok && verifyJson.success) {
              alert("Thank you! Payment verified successfully.");
            } else {
              alert(
                "Payment captured but verification failed. We'll check on our end."
              );
            }
          } catch (e) {
            console.error(e);
            alert("Payment captured but verification error occurred.");
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        theme: { color: "#14b8a6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
      // Optional: reset captcha after attempt so user must reconfirm if needed
      setCaptchaToken(null);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-3 border border-teal-500">
      <div className="text-center pb-4 border-b border-gray-300">
        <h1 className="text-base md:text-lg font-semibold text-gray-700">
          Choose an amount to donate and make a change
        </h1>
      </div>

      <div className="space-y-4 pt-4">
        {/* Step 1: Amount selection */}
        {stage === "amount" && (
          <AmountSelector
            selectedAmount={selectedAmount}
            customAmount={customAmount}
            onSelectAmount={handleSelectAmount}
            onCustomAmountChange={handleCustomAmount}
          />
        )}

        {/* Step 2: Donor details only */}
        {stage === "details" && (
          <DonorDetailsForm
            donorName={donorName}
            setDonorName={setDonorName}
            donorEmail={donorEmail}
            setDonorEmail={setDonorEmail}
            donorMobile={donorMobile}
            setDonorMobile={setDonorMobile}
            turnstileSiteKey={turnstileSiteKey}
            onVerifyCaptcha={(token) => {
              setCaptchaToken(token);
              setError(null);
            }}
            onExpireCaptcha={() => {
              setCaptchaToken(null);
              setError("Captcha expired. Please verify again.");
            }}
            onErrorCaptcha={() => {
              setCaptchaToken(null);
              setError("Captcha error. Please reload or try again.");
            }}
          />
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handlePrimaryAction}
          disabled={
            loading ||
            (stage === "details" && (!captchaToken || !turnstileSiteKey))
          }
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-lg transition-colors duration-200"
        >
          {loading
            ? "PROCESSING..."
            : stage === "amount"
            ? `DONATE ${selectedAmount > 0 ? `₹${selectedAmount}` : ""}`
            : "CONFIRM"}
        </button>

        <SecurePaymentFooter />
      </div>
    </div>
  );
}
