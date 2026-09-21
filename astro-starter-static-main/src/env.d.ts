/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly COOKIEYES_SITE_KEY?: string;
  readonly GTM_CONTAINER_ID?: string;
  readonly GA4_MEASUREMENT_ID?: string;
  readonly META_PIXEL_ID?: string;
  readonly MS_CLARITY_PROJECT_ID?: string;
  readonly CALLRAIL_ACCOUNT_ID?: string;
  readonly CALLRAIL_SWAP_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
