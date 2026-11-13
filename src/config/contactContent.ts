import { business } from './business.ts';
/** Client-editable demonstration copy. Keep claims and demo notices truthful. */
const demoContactContent = {
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
const demoFormContent = {
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
const demoFormMessages = {
  requiredMessage: 'Enter a message about your cleaning needs.',
  offlineSuccess:
    'Demo check complete. Your entries pass validation, but nothing has been sent or saved. A submission service must be connected before inquiries can be delivered.',
  sendingStatus: 'Sending your test inquiry…',
  acceptedStatus:
    'Formspree accepted your test inquiry for processing. This is not a booking confirmation or proof of email delivery.',
  acceptedLabel: 'Inquiry accepted',
} as const;

/** Approved client copy belongs here. A live form is not a booking or delivery guarantee. */
const productionContactContent = {
  ...demoContactContent,
  informationLabel: 'Business information',
  configuredDescription:
    'Send your inquiry using the form below. We can discuss your priorities and confirm the proposed scope before scheduling.',
  offlineDescription:
    'Online submission is unavailable. Use the business contact details below; checking this form will not send an inquiry.',
  detailsTitle: 'Contact details',
  detailsNotice: 'Use these details to contact the business directly.',
  hoursTitle: 'Business hours',
  areasTitle: 'Service areas',
  areasNotice: 'Contact the business to confirm coverage for your address.',
};
const productionFormContent = {
  ...demoFormContent,
  configuredNotice:
    'Your inquiry is submitted through Formspree. Cloudflare Turnstile provides spam protection. Submitting this form does not confirm a booking.',
  offlineNotice:
    'Online submission is unavailable. This form only checks entries in your browser; nothing is sent or saved. Contact the business directly using the details on this page.',
  legend: 'Inquiry details',
  configuredSubmit: 'Send inquiry',
  offlineSubmit: 'Check form entries',
};
const productionFormMessages = {
  ...demoFormMessages,
  offlineSuccess:
    'Your entries pass validation, but nothing has been sent or saved. Contact the business directly while online submission is unavailable.',
  sendingStatus: 'Sending your inquiry…',
  acceptedStatus:
    'Formspree accepted your inquiry for processing. This is not a booking confirmation or proof of email delivery.',
};

export function getContactCopy(isDemo: boolean) {
  return isDemo
    ? {
        contactContent: demoContactContent,
        formContent: demoFormContent,
        formMessages: demoFormMessages,
      }
    : {
        contactContent: productionContactContent,
        formContent: productionFormContent,
        formMessages: productionFormMessages,
      };
}
export const { contactContent, formContent, formMessages } = getContactCopy(
  business.isDemo,
);
