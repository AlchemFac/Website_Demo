import { business } from './business';
/** Client-editable demonstration copy. Keep claims and demo notices truthful. */
export const contactContent = {
  eyebrow: 'A fresh start begins with a conversation',
  title: 'Let’s talk about your space.',
  informationLabel: 'Sample business information',
  configuredDescription: `Send a test inquiry to the site owner using the form below. ${business.name} remains fictional; no real cleaning bookings are available.`,
  offlineDescription: `Explore the sample contact details or try the demo form below. ${business.name} is fictional; no real inquiries or bookings are accepted.`,
  detailsTitle: 'Sample contact details',
  detailsNotice:
    'Demonstration details only. These do not reach a real cleaning company.',
  hoursTitle: 'Sample business hours',
  areasTitle: 'Example service areas',
  areasNotice: 'Illustrative DFW locations, not confirmed coverage.',
} as const;

/** Editable copy; preserve accurate validation and provider-acceptance language. */
export const formContent = {
  title: 'Tell us about your home',
  configuredNotice:
    'This is a fictional business. This form sends a test inquiry through Formspree to the site owner; it does not book a cleaning. Please use sample details. Your entries are shared with Formspree, and Cloudflare provides spam protection.',
  offlineNotice:
    'Demo form only. This form checks your entries in your browser. It does not send or save them, request a quote, or book a cleaning. Please use sample details.',
  legend: 'Demo inquiry details',
  messageHint:
    'For example: home size, priority rooms, and preferred timing. Maximum 2,000 characters.',
  configuredSubmit: 'Send test inquiry',
  offlineSubmit: 'Check demo form',
  newInquiry: 'Start a new inquiry',
} as const;

/** Editable copy; preserve accurate validation and provider-acceptance language. */
export const formMessages = {
  requiredMessage: 'Enter a message about your cleaning needs.',
  offlineSuccess:
    'Demo check complete. Your entries pass validation, but nothing has been sent or saved. A submission service must be connected before inquiries can be delivered.',
  sendingStatus: 'Sending your test inquiry…',
  acceptedStatus:
    'Formspree accepted your test inquiry for processing. This is not a booking confirmation or proof of email delivery.',
  acceptedLabel: 'Inquiry accepted',
} as const;
