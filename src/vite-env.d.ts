/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_RAZORPAY_KEY_ID?: string;
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_TURNSTILE_SITE_KEY?: string;
	readonly VITE_RAZORPAY_BUTTON_ID?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
