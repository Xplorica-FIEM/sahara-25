import { Lock } from "lucide-react";

export default function SecurePaymentFooter() {
  return (
    <div className="flex items-center justify-center gap-1 text-[10px] text-gray-600 pt-2 text-center">
      <Lock className="h-full" />
      <span>
        Secure Payment · This site is protected by reCAPTCHA and the Google
        <a href="#" className="underline hover:text-gray-800">
          {" "}
          Privacy Policy
        </a>{" "}
        and
        <a href="#" className="underline hover:text-gray-800">
          {" "}
          Terms of Service
        </a>{" "}
        apply.
      </span>
    </div>
  );
}
