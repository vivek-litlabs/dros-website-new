/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Public reCAPTCHA v2 site key for the demo-call checkbox. Baked in at build
  // time, so it has to be present in the environment before `vite build` runs.
  readonly VITE_RECAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  // Public reCAPTCHA v2 site key for the demo-call checkbox. Baked in at build
  // time, so it has to be present in the environment before `vite build` runs.
  readonly VITE_RECAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
