import Turnstile from "react-turnstile";

interface DonorDetailsFormProps {
  donorName: string;
  setDonorName: (name: string) => void;
  donorEmail: string;
  setDonorEmail: (email: string) => void;
  donorMobile: string;
  setDonorMobile: (mobile: string) => void;
  turnstileSiteKey: string | undefined;
  onVerifyCaptcha: (token: string) => void;
  onExpireCaptcha: () => void;
  onErrorCaptcha: () => void;
}

export default function DonorDetailsForm({
  donorName,
  setDonorName,
  donorEmail,
  setDonorEmail,
  donorMobile,
  setDonorMobile,
  turnstileSiteKey,
  onVerifyCaptcha,
  onExpireCaptcha,
  onErrorCaptcha,
}: DonorDetailsFormProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-700" htmlFor="donorName">
          Name<span className="text-red-500"> *</span>
        </label>
        <input
          id="donorName"
          type="text"
          placeholder="Your full name"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className="w-full py-2 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          autoComplete="name"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600" htmlFor="donorEmail">
          Email <span className="text-gray-400 text-[10px]">(optional)</span>
        </label>
        <input
          id="donorEmail"
          type="email"
          placeholder="you@example.com"
          value={donorEmail}
          onChange={(e) => setDonorEmail(e.target.value)}
          className="w-full py-2 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          autoComplete="email"
        />
        <p className="text-xs text-gray-500">
          Provide email to receive donation certificate and updates.
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-700" htmlFor="donorMobile">
          Mobile number<span className="text-red-500"> *</span>
        </label>
        <input
          id="donorMobile"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          placeholder="10-digit mobile number"
          value={donorMobile}
          onChange={(e) => setDonorMobile(e.target.value.replace(/\D/g, ""))}
          autoComplete="mobile tel"
          className="w-full py-2 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          required
        />

        <p className="text-xs text-gray-500">
          In India mobile number is mandatory for KYC and Verification.
        </p>
      </div>

      <div className="pt-2">
        {turnstileSiteKey ? (
          <Turnstile
            theme="light"
            sitekey={turnstileSiteKey}
            onVerify={onVerifyCaptcha}
            onExpire={onExpireCaptcha}
            onError={onErrorCaptcha}
          />
        ) : (
          <p className="text-xs text-red-600">
            Missing Turnstile site key (VITE_TURNSTILE_SITE_KEY).
          </p>
        )}
      </div>
    </div>
  );
}
