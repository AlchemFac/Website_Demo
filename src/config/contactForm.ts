/** Resolved public build configuration; not a place to store account secrets. */
export interface ContactFormConfig {
  configured: boolean;
  endpoint: string;
  siteKey: string;
}

/** Public identifiers only. Recipient email and Turnstile secret stay in Formspree. */
// Both identifiers are optional together: leave both blank for offline demo mode.
const formId = (import.meta.env.PUBLIC_FORMSPREE_FORM_ID ?? '').trim();
const siteKey = (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '').trim();
if (Boolean(formId) !== Boolean(siteKey)) {
  throw new Error(
    'Configure both PUBLIC_FORMSPREE_FORM_ID and PUBLIC_TURNSTILE_SITE_KEY, or leave both blank for demo mode.',
  );
}
if (
  formId &&
  (!/^[a-zA-Z0-9]{6,64}$/.test(formId) ||
    !/^[a-zA-Z0-9_-]{10,128}$/.test(siteKey))
) {
  throw new Error(
    'Invalid public contact form configuration. Check the Formspree ID and Turnstile site key.',
  );
}
// The destination is derived from the public form ID. Recipient setup is in Formspree.
export const contactForm = {
  configured: Boolean(formId && siteKey),
  endpoint: formId ? `https://formspree.io/f/${formId}` : '',
  siteKey,
} satisfies ContactFormConfig;
