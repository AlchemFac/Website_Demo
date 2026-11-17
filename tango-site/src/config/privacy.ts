import type { PrivacyConfig } from '../../../src/config/privacy';

/** Owner review is required. Do not change clientApproved until each bracketed
 * field describes actual practices. No real address needs to be published here. */
export const privacy: PrivacyConfig = {
  enabled: true,
  clientApproved: false,
  linkLabel: 'Privacy policy',
  title: 'Privacy policy — draft | Tango with Maria Fernanda',
  description:
    'Draft privacy information for Tango with Maria Fernanda. Owner review and completion are required before publication.',
  heading: 'A note on your privacy.',
  introduction:
    'DRAFT FOR OWNER REVIEW — This is a working privacy-policy draft, not a finalized statement of Maria Fernanda’s practices. Complete the marked items and obtain appropriate review before publishing it as an approved policy.',
  sections: [
    {
      id: 'operator',
      title: 'Who is responsible for your information',
      paragraphs: [
        'This site introduces Maria Fernanda, an independent tango instructor serving Dallas–Fort Worth. [Confirm the operator’s full legal or trading name and the contact details for privacy questions. A home address should not be published merely to fill a template; confirm any applicable disclosure requirements.]',
      ],
    },
    {
      id: 'information',
      title: 'Information you choose to share',
      paragraphs: [
        'The current website has no inquiry form, account registration or online payment collection. Its email, phone and social contact details are not yet connected.',
        '[Before launch, confirm which contact channels will be used.] If you contact Maria through those channels, your message may include your name, contact details, lesson interests and information you choose to provide. Please avoid sending payment-card details or sensitive personal information in an initial inquiry.',
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
        'This draft loads its images, fonts, styles and scripts from the site itself. It does not embed social feeds, maps, videos or third-party booking widgets. Social links, when configured, open the relevant service; that service has its own privacy practices.',
        '[Before launch, identify the actual hosting/CDN, email, messaging, booking and payment providers, explain their roles and link their privacy notices. Hosting providers may process technical data such as IP addresses and request details; verify their actual logging and settings.]',
        '[Confirm any international processing or disclosures and describe them where required. A service used by another template, such as Formspree, is not automatically used by this site.]',
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
        '[Add an approved public privacy email or another suitable contact method.] Explain the process for questions, access/correction/deletion requests and any choices or rights that apply to the actual audience and jurisdiction. Do not guarantee universal rights or outcomes without review.',
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
