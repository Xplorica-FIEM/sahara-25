"use client";

import { useState } from "react";
import { loadRazorpayScript } from "../lib/razorpay";
import AmountSelector from "./AmountSelector";
import DonorDetailsForm from "./DonorDetailsForm";
import SecurePaymentFooter from "./SecurePaymentFooter";
import PaymentSuccessCard from "./PaymentForm/PaymentSuccessCard";
import PaymentErrorCard from "./PaymentForm/PaymentErrorCard";

export default function PaymentForm() {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMobile, setDonorMobile] = useState("");
  // New: two-step flow
  const [stage, setStage] = useState<
    "amount" | "details" | "success" | "error"
  >("amount");
  // New: captcha state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // New: success payload to show on page
  const [successInfo, setSuccessInfo] = useState<null | {
    amount: number;
    currency: string;
    paymentId: string;
    orderId: string;
    status: string;
    method?: string;
  }>(null);
  // New: error payload to show on page
  const [errorInfo, setErrorInfo] = useState<null | {
    title: string;
    message: string;
    code?: string;
    paymentId?: string;
    orderId?: string;
  }>(null);

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
    if (stage === "details") {
      await startPayment();
      return;
    }
    // Optional: if success screen has a primary action in future
    // if (stage === "success") { /* e.g., reset state */ }
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
          } catch {
            // Silently handle parsing errors
          }
        }
        throw new Error(errMsg);
      }

      const order = await orderRes.json();

      interface RazorpayOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        prefill: {
          name?: string;
          email?: string;
          contact?: string;
        };
        handler: (response: RazorpayResponse) => Promise<void>;
        modal: {
          ondismiss: () => void;
        };
        theme: {
          color: string;
        };
      }

      interface RazorpayResponse {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }

      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: order.amount, // in subunits from backend
        currency: order.currency,
        name: "Sahara",
        description: "Sahara 2025 Donation",
        order_id: order.id,
        prefill: {
          name: donorName || undefined,
          email: donorEmail || undefined,
          contact: mobileDigits,
        },
        handler: async function (response: RazorpayResponse) {
          try {
            // 3) Verify on backend (server-side check for 'captured' status)
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
              // Show in-page success screen instead of alerts
              const p = verifyJson.payment;
              setSuccessInfo({
                amount: typeof p?.amount === "number" ? p.amount : order.amount,
                currency: p?.currency || order.currency || "INR",
                paymentId: p?.id || response.razorpay_payment_id,
                orderId: p?.order_id || response.razorpay_order_id,
                status: p?.status || "captured",
                method: p?.method,
              });
              setStage("success");
              setError(null);
            } else {
              // Show inline error stage for server verification failure
              setErrorInfo({
                title: "Verification failed",
                message:
                  verifyJson?.message ||
                  "Payment was not confirmed by the server.",
                paymentId: response?.razorpay_payment_id,
                orderId: response?.razorpay_order_id,
              });
              setStage("error");
            }
          } catch (e) {
            console.error(e);
            setErrorInfo({
              title: "Verification error",
              message: "Server verification failed. Please try again.",
              paymentId: response?.razorpay_payment_id,
              orderId: response?.razorpay_order_id,
            });
            setStage("error");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          // Treat closing the checkout as a user-cancelled payment
          ondismiss: () => {
            setLoading(false);
            setErrorInfo({
              title: "Payment cancelled",
              message: "You closed the checkout before completing the payment.",
              orderId: order?.id,
            });
            setStage("error");
          },
        },
        theme: { color: "#14b8a6" },
      };

      interface RazorpayInstance {
        open: () => void;
        on: (event: string, callback: (response: PaymentFailureResponse) => void) => void;
      }

      interface PaymentFailureResponse {
        error?: {
          code?: string;
          description?: string;
          metadata?: {
            payment_id?: string;
            order_id?: string;
          };
        };
      }

      const rzp = new (window as typeof window & { Razorpay: new (options: RazorpayOptions) => RazorpayInstance }).Razorpay(options);

      // New: listen for payment failure emitted by Razorpay
      rzp.on("payment.failed", (resp: PaymentFailureResponse) => {
        const err = resp?.error || {};
        setErrorInfo({
          title: "Payment failed",
          message: err?.description || "The payment could not be completed.",
          code: err?.code,
          paymentId: err?.metadata?.payment_id,
          orderId: err?.metadata?.order_id,
        });
        setStage("error");
        setLoading(false);
      });

      rzp.open();
    } catch (e: unknown) {
      const error = e as Error;
      console.error(error);
      // Keep pre-checkout errors in-place; do not switch to error stage here
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          <>
            {selectedAmount > 0 && (
              <div className="flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
                <div className="flex items-baseline gap-2">
                  <span>You're donating</span>
                  <span className="font-semibold">
                    ₹{selectedAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStage("amount");
                    setError(null);
                  }}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                  aria-label="Change donation amount"
                >
                  Change amount
                </button>
              </div>
            )}
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
          </>
        )}

        {/* Step 3: Success screen */}
        {stage === "success" && successInfo && (
          <PaymentSuccessCard
            title="Thank you! Your donation has been received."
            amount={successInfo.amount / 100}
            currency={successInfo.currency}
            reference={successInfo.paymentId}
            date={new Date()}
            status={successInfo.status}
            method={successInfo.method}
            primaryActionLabel="Donate Again"
            onPrimaryAction={() => {
              // Reset entire flow to first step
              setStage("amount");
              setSuccessInfo(null);
              setError(null);
              setErrorInfo(null);
              setSelectedAmount(0);
              setCustomAmount("");
              setDonorName("");
              setDonorEmail("");
              setDonorMobile("");
              setCaptchaToken(null);
            }}
          />
        )}

        {/* Error screen replaced with component */}
        {stage === "error" && errorInfo && (
          <PaymentErrorCard
            title={errorInfo.title}
            message={errorInfo.message}
            code={errorInfo.code}
            paymentId={errorInfo.paymentId}
            orderId={errorInfo.orderId}
            primaryActionLabel="Try again"
            onPrimaryAction={() => {
              setStage("details");
              setError(null);
              setErrorInfo(null);
            }}
            secondaryActionLabel="Donate Again"
            onSecondaryAction={() => {
              setStage("amount");
              setError(null);
              setErrorInfo(null);
              setSuccessInfo(null);
              setSelectedAmount(0);
              setCustomAmount("");
              setDonorName("");
              setDonorEmail("");
              setDonorMobile("");
              setCaptchaToken(null);
            }}
          />
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Hide primary button on success and error screens */}
        {stage !== "success" && stage !== "error" && (
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
        )}

        <SecurePaymentFooter />
      </div>
    </div>
  );
}
