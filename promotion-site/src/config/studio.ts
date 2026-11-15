/** Replace these two values before publishing. No private credentials belong here. */
export const studio = {
  name: '[Your Business Name]',
  email: '',
  demoUrl: 'https://website-demo-6vj.pages.dev/',
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
    pages: 'Up to 3 website pages',
    pageList: 'Home, Services, Contact',
    description:
      'A focused website that introduces your business, explains your services and makes it easy to get in touch.',
    revisions: '1 round of revisions from your combined feedback',
    features: [
      'Your brand colors and supplied logo',
      'Responsive layouts for phones, tablets and desktops',
      'Contact form with spam protection',
      'Page titles, descriptions and technical SEO setup',
      'Website launch, source files and handoff instructions',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 999,
    deposit: '499.50',
    pages: 'Up to 5 website pages',
    pageList: 'Home, Services, About, Gallery, Contact',
    description:
      'A more detailed website for your services, business story and a gallery of approved images.',
    revisions: '2 rounds of revisions from your combined feedback',
    features: [
      'All Starter features included',
      'About page to introduce your business',
      'Gallery with approved images and descriptive captions',
      'Up to five pages with clear navigation',
      'Client-owned domain and provider accounts',
    ],
  },
] as const;

export const steps = [
  {
    title: 'Start with your business.',
    description:
      'Share what you do, who you serve, your content and approved images. We agree on the package and scope before work begins.',
    note: '50% of the build price to begin',
  },
  {
    title: 'Make it feel like you.',
    description:
      'Your branding and content are brought into a focused, reusable design. Review the site and send your included consolidated revisions.',
    note: 'A clear review, with a clear finish line',
  },
  {
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
    question: 'Is there one care plan for both website packages?',
    answer:
      'Yes. Optional Website Care is $59 per month for either Starter or Business. It includes scheduled maintenance review, website and form checks, support, and up to 30 minutes of updates to existing content each month. Unused editing time does not roll over. New pages, redesigns and additional features are quoted separately.',
  },
  {
    question: 'What do I need to provide?',
    answer:
      'Your approved business name, public contact details, hours, service areas, usable website copy, logo if you have one, and images you have permission to use. You also supply or approve privacy-policy text. Light editing is included; full copywriting and logo design are separate.',
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

/** One optional care service, available with either website package. */
export const carePlan = {
  name: 'Website Care',
  price: 59,
  editMinutes: 30,
  description:
    'The same ongoing support, whichever website package you choose.',
  includes: [
    'Scheduled dependency and maintenance review',
    'Website and contact-form checks',
    'Up to 30 minutes of updates to existing content each month',
    'Support for your existing website',
  ],
} as const;

/** Keep the overview short; package, ownership, care and FAQ sections explain scope. */
export const benefits = [
  {
    title: 'Clear, one-time pricing',
    description:
      'Choose a $599 or $999 build with an agreed scope. Monthly care is optional.',
  },
  {
    title: 'Built for your customers',
    description:
      'Your branding, a mobile-friendly layout and a clear way for visitors to contact your business.',
  },
  {
    title: 'Your website to keep',
    description:
      'Keep the finished site and source files after final payment, with accounts in your name.',
  },
] as const;
