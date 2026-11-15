/** Replace these two values before publishing. No private credentials belong here. */
export const studio = {
  name: '[Your Business Name]',
  email: '',
  demoUrl: 'https://website-demo-6vj.pages.dev/',
  tagline: 'A proper website. A simple price.',
  audience: 'Small-business websites, delivered remotely',
  isPreview: true,
} as const;

/** One-time build prices. Monthly care is a separate, optional service. */
export const packages = [
  {
    id: 'starter',
    name: 'Starter',
    price: 599,
    deposit: '299.50',
    suppliedWords: 1000,
    imageLimit: 6,
    galleryImageLimit: 0,
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
    suppliedWords: 1800,
    imageLimit: 12,
    galleryImageLimit: 8,
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
      'Yes. After full payment, you keep the completed website and source files, with permission to operate, modify and move the finished site, including using another developer. Your accounts stay in your name. Canceling optional care does not remove your site, but future maintenance and provider charges become your responsibility. The project agreement identifies client-specific work, reusable template rights and third-party licenses; the base template is not sold exclusively.',
  },
  {
    question: 'Is there a required monthly subscription or 12-month term?',
    answer:
      'No. The build is a one-time purchase. Care is optional, starts at launch if selected, and renews month to month. There is no required 12-month care commitment.',
  },
  {
    question: 'Is there one care plan for both website packages?',
    answer:
      'Yes. Optional Website Care is $59 per month for either Starter or Business. It includes one monthly website health check, plus 30 combined minutes each month for existing-content edits, minor fixes and technical help. The check is separate from that allowance. Ordinary billing questions and correcting our delivery mistakes do not use it. Unused time does not roll over. New pages, redesigns and additional features are quoted separately.',
  },
  {
    question: 'When are care checks and support available?',
    answer:
      'The monthly check normally takes place within the first five business days after renewal. We review key pages and links, visible form behavior, dependency notices and obvious loading or deployment problems, then send a short completion note. It is not continuous monitoring or a comprehensive security audit. Email requests are processed Monday–Friday, 9 AM–5 PM U.S. Central Time, excluding U.S. federal holidays. We acknowledge within two business days and aim to complete routine agreed edits within five business days after complete instructions and access; external dependencies may affect timing. Hands-on work uses the combined 30-minute allowance; the check, ordinary billing questions and corrections to our delivery mistakes do not. Real form tests require your authorization, after form changes and quarterly if authorized; provider acceptance is not proof of email delivery. Source history supports code rollback, not backups of inboxes, form submissions or provider data. Major upgrades, account recovery and complex incidents need a separate approved quote.',
  },
  {
    question: 'What do I need to provide?',
    answer:
      'Supply your approved business name, public contacts, hours, service areas, usable copy, an optional logo and images you have permission to use. Starter includes up to 1,000 supplied marketing words and 6 images; Business includes 1,800 words and 12 images, with up to 8 in its gallery. Image limits exclude the logo. Both include up to six service entries within the Services page. Light editing improves supplied text; research, full rewrites and original copywriting are separate.',
  },
  {
    question: 'What does basic SEO include?',
    answer:
      'Page titles and descriptions, semantic page structure, optimized images, and appropriate sitemap and indexing setup. It does not include ongoing SEO campaigns, Google Business Profile management, guaranteed rankings, or guaranteed leads.',
  },
  {
    question: 'What is a revision round?',
    answer:
      'Starter includes one round and Business includes two. Each is one combined list of up to 10 minor, in-scope changes or 60 minutes of implementation, whichever comes first. Examples include adjustments to existing copy, colors, images and spacing. A new layout direction, extra page, substantial rewrite or integration needs a quote. Corrections to our delivery mistakes do not use a revision round. Please provide feedback within five business days.',
  },
  {
    question: 'Are domains, email and paid tools included?',
    answer:
      'No. Domain registration, business email, paid form-provider plans, and other paid third-party services are separate. Accounts are held in your name, and any required costs are discussed before approval.',
  },
  {
    question: 'What if something is wrong after launch?',
    answer:
      'Report defects in the agreed delivery within 30 calendar days after launch. We acknowledge reports within two business days and provide a plan after reproducing the problem. Correcting our implementation mistakes is included, whether or not you choose care, and does not use your care or revision allowance. The 30 days is a reporting period, not a guaranteed repair deadline. New preferences, changed content, third-party changes and new features are separately assessed.',
  },
  {
    question: 'How long will the website take?',
    answer:
      'We agree on the schedule after reviewing your scope, content, images and account requirements. Work is scheduled after the initial payment and complete required materials. There is no blanket same-day promise. If required materials or feedback are missing for 10 business days, we send notice and may pause the schedule. After 60 calendar days of inactivity, a project may be archived after notice; restarting requires a new schedule and scope review, not an automatic restart fee.',
  },
  {
    question: 'Are you limited to a particular location?',
    answer:
      'No. Projects are delivered remotely and are not limited to a specific region. We confirm project fit, provider availability and payment requirements before accepting work. Standard delivery is in English, prices are in USD, and support is coordinated in U.S. Central Time.',
  },
  {
    question: 'What privacy content and image work are included?',
    answer:
      'Formatting one client-approved Privacy page of up to 2,000 supplied words is included outside the marketing-page and marketing-word limits. Standard headings and links are included; legal drafting and compliance review are not. Standard image cropping, resizing, compression, alt text and supplied captions are included. Extensive editing, image generation, paid licenses and extended image searches are separate.',
  },
  {
    question: 'Can I edit the website myself?',
    answer:
      'You receive a static Astro website and its source files, not a visual editing dashboard or CMS. You can work with the source if you have the technical skills, appoint another developer, or choose optional care. Adding a visual editing system requires a separate scope.',
  },
  {
    question: 'How do payments and extra work work?',
    answer:
      'Pay 50% to begin: $299.50 for Starter or $499.50 for Business. The matching final balance is due within seven calendar days of written approval and before launch. Extra work requires an approved estimate: $75/hour, billed in 15-minute increments with a 30-minute minimum ($37.50 per separate approved job), or a separate fixed quote. We do not start charging automatically when an allowance is used up, and our delivery mistakes are not paid extras.',
  },
  {
    question: 'What happens if I cancel a website build?',
    answer:
      'The initial payment is an advance toward the work, not automatically non-refundable. Before work begins, unearned funds are refunded less only explicitly approved, nonrecoverable third-party costs where permitted. After work begins, documented completed base work is settled at $75/hour, capped at the agreed build price. Separately approved change orders and third-party costs are settled under their written terms. Any unearned advance is refunded. The written project agreement governs the settlement and delivery of paid-for work.',
  },
  {
    question: 'How do I cancel care, and what if a payment fails?',
    answer:
      'Care requires explicit opt-in and bills $59 monthly in advance on your launch or enrollment anniversary. Email a cancellation before the next renewal to stop at the end of your paid period; receipt time counts, not when we read it. There is no required 12-month term or site buyout fee. An ordinary mid-cycle cancellation is not prorated, subject to applicable requirements and failure to provide agreed service. An erroneous charge after timely cancellation is refunded. A failed payment receives notice and seven calendar days to resolve before care pauses. Pausing care does not disable your paid-for site or withhold your accounts/files. Current files and access handoff are provided within five business days after care ends, or sooner by agreement; complex migration is separate.',
  },
] as const;

/** One optional care service, available with either website package. */
export const carePlan = {
  name: 'Website Care',
  price: 59,
  requestMinutes: 30,
  description:
    'The same ongoing support, whichever website package you choose.',
  includes: [
    'One monthly website health check, separate from your request time',
    '30 combined minutes for content edits, minor fixes and technical help',
    'Email acknowledgment within two business days',
    'No automatic charges for work beyond the allowance',
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
