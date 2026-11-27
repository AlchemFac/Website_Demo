import type { PrivacyConfig } from '../../../src/config/privacy';

/** Owner review is required. Do not change clientApproved until each bracketed
 * field describes actual practices. No real address needs to be published here. */
export const privacy: PrivacyConfig = {
  enabled: true,
  clientApproved: false,
  linkLabel: 'Privacy policy',
  title: 'Privacy policy — draft | Fernanda Delgado Tango',
  description:
    'Draft privacy information for Fernanda Delgado Tango. Owner review and completion are required before publication.',
  heading: 'A note on your privacy.',
  introduction:
    'DRAFT FOR OWNER REVIEW — This is a working privacy-policy draft, not a finalized statement of María Fernanda Delgado García’s practices. Complete the marked items and obtain appropriate review before publishing it as an approved policy.',
  sections: [
    {
      id: 'operator',
      title: 'Who is responsible for your information',
      paragraphs: [
        'Fernanda Delgado Tango is presented by María Fernanda Delgado García, serving Dallas–Fort Worth. Public contact: fernanda.fd93@gmail.com and +1 (214) 899-7168. [Confirm the legal operator and any applicable disclosure requirements. No home or fixed business address has been supplied.]',
      ],
    },
    {
      id: 'information',
      title: 'Information you choose to share',
      paragraphs: [
        'The website publishes Fernanda’s email and phone and includes an inquiry form. Unless a submission service is configured, the form is a clearly labeled browser-only demo that does not send or save entries. There is no account registration, online payment collection or automated booking on this site.',
        'If you email or call Fernanda, or submit a future connected form, the information may include your name, email, optional phone, chosen service and message. Contact services handle the information according to their own practices. Please avoid sending payment-card details or sensitive personal information in an initial inquiry.',
        '[Confirm whether booking, payments, student records, information about minors or accommodation requests are handled, and describe those practices accurately. Do not add new collection without updating this notice.]',
      ],
    },
    {
      id: 'purposes',
      title: 'How information is used',
      paragraphs: [
        '[Owner approval required] Describe how inquiries are used to respond to questions, discuss suitable lessons and arrange bookings. Confirm any additional administrative uses and any legal basis or consent information required for the actual business. Do not treat an inquiry as permission for marketing without an appropriate basis.',
      ],
    },
    {
      id: 'providers',
      title: 'Hosting, contact services and external links',
      paragraphs: [
        'Images, fonts, styles and application scripts load from the site itself. The current short practice video is served from the same site and its media source is loaded only after you choose Play. Additional videos may use YouTube or Vimeo players, also loaded only after you choose Play; no external player loads merely from opening the page. Social links, when configured, open the relevant service under its own privacy practices. There are no embedded maps or booking widgets.',
        '[Before launch, identify the actual hosting/CDN, email, booking and payment providers, explain their roles and link their privacy notices. Hosting providers may process technical data such as IP addresses and request details; verify their actual logging and settings.]',
        '[Confirm any international processing or disclosures and describe them where required. Formspree and Cloudflare Turnstile are prepared as optional form/spam-protection providers, but do not receive form entries in demo mode. Connect only Fernanda’s own accounts, disclose them and test delivery before enabling the form. A service configured for the cleaning template is not automatically used by this site.]',
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and website measurements',
      paragraphs: [
        'The current application does not set cookies, use browser local/session storage, or include analytics or advertising scripts. [Verify the final hosting platform and any services added before launch. If analytics, embeds or booking tools are added, update this section and assess any consent requirements.]',
      ],
    },
    {
      id: 'retention',
      title: 'How long information is kept',
      paragraphs: [
        '[Owner approval required] Specify the real retention periods or criteria for inquiries, booking records and any payment/administrative records. Identify how deletion requests are handled, which provider settings apply and any records that must be retained. No retention period has been chosen by this template.',
      ],
    },
    {
      id: 'choices',
      title: 'Questions and privacy requests',
      paragraphs: [
        'Privacy questions can be sent to fernanda.fd93@gmail.com. [Owner approval required] Confirm this as the privacy contact and explain the process for access/correction/deletion requests and any choices or rights that apply to the actual audience and jurisdiction. Do not guarantee universal rights or outcomes without review.',
      ],
    },
    {
      id: 'updates',
      title: 'Keeping this policy accurate',
      paragraphs: [
        'Effective date: [set when the completed policy is approved]. Review this notice when contact channels, hosting, booking, payment, tracking or information-handling practices change. This draft is not a certification of legal compliance.',
      ],
    },
  ],
};
