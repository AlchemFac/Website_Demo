export interface PrivacySection {
  id: string;
  title: string;
  paragraphs: readonly string[];
}
export interface PrivacyConfig {
  enabled: boolean;
  clientApproved: boolean;
  linkLabel: string;
  title: string;
  description: string;
  heading: string;
  introduction: string;
  sections: readonly PrivacySection[];
}

/** Draft instructions, not legal advice or a description of verified practices.
 * Replace every placeholder with client-approved facts before setting clientApproved.
 */
export const privacy: PrivacyConfig = {
  enabled: false,
  clientApproved: false,
  linkLabel: 'Privacy information',
  title: 'Privacy information — draft template',
  description:
    'Unapproved privacy template. Client review and replacement are required before launch.',
  heading: 'Privacy information',
  introduction:
    'DRAFT PLACEHOLDER — This is not a finalized privacy policy. The client must provide and approve accurate information for every section before publication as a policy.',
  sections: [
    {
      id: 'information',
      title: 'Information collected',
      paragraphs: [
        '[Client approval required] Describe the contact fields actually collected, any technical data processed by the site/providers, and any other collection that applies. Do not imply collection that has not been verified.',
      ],
    },
    {
      id: 'purpose',
      title: 'Purpose and use',
      paragraphs: [
        '[Client approval required] Explain the purposes for collecting and using information, how inquiries are handled, and any other approved uses.',
      ],
    },
    {
      id: 'providers',
      title: 'Service providers',
      paragraphs: [
        '[Client approval required] Identify the actual hosting, form, and spam-protection providers and describe their roles and relevant privacy information. Review Cloudflare Pages, Formspree, and Turnstile if used.',
      ],
    },
    {
      id: 'retention',
      title: 'Retention',
      paragraphs: [
        '[Client approval required] Supply the actual retention criteria or periods and deletion process for the business and applicable providers. This template does not choose a retention period.',
      ],
    },
    {
      id: 'contact',
      title: 'Privacy contact',
      paragraphs: [
        '[Client approval required] Provide an approved public privacy contact and the process for privacy questions or requests. Do not use private customer information.',
      ],
    },
  ],
};
