import type { ContactFormConfig } from '../../../src/config/contactForm';

// This site deliberately uses its own public identifiers. Never copy the
// cleaning demo's form destination, recipient or private Turnstile secret.
const formId = (import.meta.env.PUBLIC_TANGO_FORMSPREE_FORM_ID ?? '').trim();
const siteKey = (import.meta.env.PUBLIC_TANGO_TURNSTILE_SITE_KEY ?? '').trim();
if (Boolean(formId) !== Boolean(siteKey))
  throw new Error(
    'Set both PUBLIC_TANGO_FORMSPREE_FORM_ID and PUBLIC_TANGO_TURNSTILE_SITE_KEY, or leave both blank for demo mode.',
  );
if (
  formId &&
  (!/^[a-zA-Z0-9]{6,64}$/.test(formId) ||
    !/^[a-zA-Z0-9_-]{10,128}$/.test(siteKey))
)
  throw new Error(
    'Invalid tango form configuration. Check the public Formspree ID and Turnstile site key.',
  );
export const contactForm: ContactFormConfig = {
  configured: Boolean(formId && siteKey),
  endpoint: formId ? `https://formspree.io/f/${formId}` : '',
  siteKey,
};
export const formContent = {
  title: 'Tell Fernanda what you have in mind.',
  configuredNotice:
    'Your inquiry is sent through Formspree, with Cloudflare Turnstile spam protection. Sending a message does not confirm a booking. Please review the privacy information before submitting.',
  offlineNotice:
    'Demo form only: entries are checked in your browser, but nothing is sent or saved. Please use sample details. To make a real inquiry, email or call Fernanda using the details above.',
  legend: 'Tango inquiry details',
  messageHint:
    'Share your lesson interests, event plans or preferred timing. Do not include payment details or sensitive personal information. Maximum 2,000 characters.',
  configuredSubmit: 'Send inquiry',
  offlineSubmit: 'Check demo form',
  newInquiry: 'Start a new inquiry',
};
export const formMessages = {
  requiredMessage: 'Tell Fernanda about your lesson or event inquiry.',
  offlineSuccess:
    'Demo check complete. Nothing has been sent or saved. Email or call Fernanda to make a real inquiry.',
  sendingStatus: 'Sending your inquiry…',
  acceptedStatus:
    'Formspree accepted your inquiry for processing. This is not a booking confirmation or proof of email delivery.',
  acceptedLabel: 'Inquiry accepted',
};
