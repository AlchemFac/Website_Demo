/** Replace these two values before publishing. No private credentials belong here. */
export const studio = {
  name: '[Your Business Name]',
  email: '',
  tagline: 'A proper website. A simple price.',
  audience: 'Small businesses in Dallas–Fort Worth',
  isPreview: true,
} as const;

/** One-time build prices. Monthly care is a separate, optional service. */
export const packages = [
  {
    id: 'starter',
    name: 'Starter',
    price: 599,
    deposit: '299.50',
    care: 59,
    pages: 'Up to 3 marketing pages',
    pageList: 'Home, Services, Contact',
    description: 'A clear, focused home for a business getting online.',
    revisions: '1 consolidated revision round',
    careMinutes: 15,
    features: [
      'Your branding, colors & supplied logo',
      'Mobile-friendly layouts',
      'One contact form with spam protection',
      'Basic technical & on-page SEO',
      'Launch, source files & handoff',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 999,
    deposit: '499.50',
    care: 99,
    pages: 'Up to 5 marketing pages',
    pageList: 'Home, Services, About, Gallery, Contact',
    description: 'More room to explain your services and show your work.',
    revisions: '2 consolidated revision rounds',
    careMinutes: 30,
    features: [
      'Everything in Starter',
      'About page for your business story',
      'Gallery with approved images & captions',
      'More space for services and useful detail',
      'The same straightforward ownership',
    ],
  },
] as const;

export const steps = [
  {
    number: '01',
    title: 'Start with your business.',
    description:
      'Share what you do, who you serve, your content and approved images. We agree on the package and scope before work begins.',
    note: '50% of the build price to begin',
  },
  {
    number: '02',
    title: 'Make it feel like you.',
    description:
      'Your branding and content are brought into a focused, reusable design. Review the site and send your included consolidated revisions.',
    note: 'A clear review, with a clear finish line',
  },
  {
    number: '03',
    title: 'Launch it. Keep it.',
    description:
      'After approval and final payment, your site is launched into client-owned accounts. You receive the source files and handoff instructions.',
    note: 'Care is your choice, not a condition',
  },
] as const;

export const faqs = [
  {
    question: 'Do I keep my website if I don’t choose monthly care?',
    answer:
      'Yes. After the build invoice is fully paid, you keep the completed website and its source files. Canceling optional care does not remove your site. You become responsible for future maintenance and provider costs. The reusable template remains available for other projects, and third-party assets retain their licensing terms.',
  },
  {
    question: 'Is there a required monthly subscription or 12-month term?',
    answer:
      'No. The build is a one-time purchase. Care is optional, starts at launch if selected, and renews month to month. There is no required 12-month care commitment.',
  },
  {
    question: 'What do I need to provide?',
    answer:
      'Your approved business information, usable website copy, logo if you have one, and images you have permission to use. You also supply or approve privacy-policy text. Light editing is included; full copywriting and logo design are separate.',
  },
  {
    question: 'What does basic SEO include?',
    answer:
      'Page titles and descriptions, semantic page structure, optimized images, and appropriate sitemap and indexing setup. It does not include ongoing SEO campaigns, Google Business Profile management, guaranteed rankings, or guaranteed leads.',
  },
  {
    question: 'What is a revision round?',
    answer:
      'One consolidated list of changes to the agreed design and content. Starter includes one round and Business includes two. New pages, redesigns, and added functionality are quoted separately before work starts.',
  },
  {
    question: 'Are domains, email and paid tools included?',
    answer:
      'No. Domain registration, business email, paid form-provider plans, and other paid third-party services are separate. Accounts are held in your name, and any required costs are discussed before approval.',
  },
  {
    question: 'What if something is wrong after launch?',
    answer:
      'The build includes 30 days of corrections for defects in the agreed delivery. New content, third-party changes, and additional features are outside that correction period’s scope. Ongoing care is available separately.',
  },
  {
    question: 'How long will the website take?',
    answer:
      'The schedule is agreed after the content, images, scope and account setup are reviewed. Work depends on receiving those materials and your feedback; there is no blanket same-day or fixed-date promise.',
  },
] as const;
