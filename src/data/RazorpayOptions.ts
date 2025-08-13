export type RazorpayCheckoutOptions = {
    key: string;
    amount: number; // in subunits
    currency: string;
    order_id: string;
    name?: string;
    description?: string;
    prefill?: Record<string, string>;
    theme?: Record<string, string>;
};

// Placeholder; real options are constructed in PaymentForm at runtime.
const RazorpayOptions: RazorpayCheckoutOptions = {
    key: "",
    amount: 0,
    currency: "INR",
    order_id: "",
};

export default RazorpayOptions;
