import type { BrandColors } from '../../../src/config/business';

/** Public, owner-approved information only. Empty contact values render as text,
 * never as broken mailto/tel/social links. Do not put credentials here. */
export interface InstructorConfig {
  name: string;
  businessName: string;
  area: string;
  isPreview: boolean;
  contentApproved: boolean;
  displayName: string;
  hours: { display: string; days: string };
  contact: {
    email: string;
    phoneDisplay: string;
    phoneHref: string;
    instagram: string;
    facebook: string;
  };
  colors: BrandColors;
}

export const instructor: InstructorConfig = {
  name: 'María Fernanda Delgado García',
  businessName: 'Fernanda Delgado Tango',
  area: 'Dallas–Fort Worth',
  isPreview: true,
  contentApproved: false,
  displayName: 'Fernanda Delgado',
  hours: { display: '9 AM–8 PM', days: '' },
  contact: {
    email: 'fernanda.fd93@gmail.com',
    phoneDisplay: '+1 (214) 899-7168',
    phoneHref: 'tel:+12148997168',
    instagram: '',
    facebook: '',
  },
  colors: {
    primary: '#584334',
    primaryHover: '#3e2e25',
    background: '#f8f4ed',
    text: '#302825',
    accent: '#eee5da',
    surface: '#fffdf8',
    muted: '#685c54',
    border: '#d9cec1',
    onPrimary: '#fffaf1',
    captionSurface: '#eee5da',
    imagePlaceholder: '#372c28',
  },
};

export interface Lesson {
  id: string;
  title: string;
  description: string;
  format: string;
  price: string;
  duration: string;
}

/** Services follow the completed questionnaire. Editorial descriptions need Fernanda’s approval.
 * Leave prices/durations empty until agreed; do not invent a booking policy. */
export const lessons: readonly Lesson[] = [
  {
    id: 'private',
    title: 'Private lessons',
    description:
      'Individual attention for your tango. Explore technique, musicality and connection, whether you’re beginning or developing your dance. Couples and beginner formats can be discussed directly.',
    format: 'Clases privadas',
    price: '',
    duration: '',
  },
  {
    id: 'groups',
    title: 'Group lessons',
    description:
      'Learn and practise alongside other dancers. Ask about current group formats, levels and partner arrangements before booking.',
    format: 'Clases grupales',
    price: '',
    duration: '',
  },
  {
    id: 'milongas',
    title: 'Milonga organization',
    description:
      'Planning a social tango gathering? Discuss event organization, venue arrangements and the experience you have in mind.',
    format: 'Social tango events',
    price: '',
    duration: '',
  },
  {
    id: 'dj',
    title: 'Tango DJ',
    description:
      'Music for your tango event. Get in touch to discuss the occasion, musical direction, schedule and equipment arrangements.',
    format: 'Music for the dance floor',
    price: '',
    duration: '',
  },
  {
    id: 'salon',
    title: 'Salon tango performances',
    description:
      'Bring a salon tango performance to your event. Discuss the setting, performance format and practical requirements with Fernanda.',
    format: 'Shows de Tango Salón',
    price: '',
    duration: '',
  },
  {
    id: 'stage',
    title: 'Stage tango performances',
    description:
      'A tango performance for the stage. Ask about the artistic format, space, timing and production arrangements for your event.',
    format: 'Shows de Tango Escenario',
    price: '',
    duration: '',
  },
  {
    id: 'assistance',
    title: 'Class assistance',
    description:
      'Contact Fernanda about assistance with a tango class. Confirm the role, class format and teaching arrangements together.',
    format: 'Assisting classes',
    price: '',
    duration: '',
  },
  {
    id: 'partnering',
    title: 'Social dance partnering',
    description:
      'Arrange tango dance partnering for a milonga or social dance event. Confirm availability, duration and arrangements directly.',
    format: 'Taxi dancer',
    price: '',
    duration: '',
  },
];

export const content = {
  metadata: {
    title: 'Fernanda Delgado Tango | Lessons, performances & events in DFW',
    description:
      'Explore private and group tango lessons, salon and stage performances, milonga organization and tango DJ services with Fernanda Delgado in Dallas–Fort Worth.',
  },
  hero: {
    eyebrow: 'Dance · Music · Connection · DFW',
    heading: 'Tango with',
    emphasis: 'Fernanda Delgado.',
    description:
      'A little music. A shared moment. A new way to move. Discover tango through lessons, performances and social dance events in Dallas–Fort Worth.',
    primaryLabel: 'Explore the services',
    secondaryLabel: 'Meet Fernanda',
  },
  about: {
    eyebrow: 'Meet the person behind the dance',
    heading: 'A dance is personal.\nSo is choosing a teacher.',
    introduction:
      'I’m María Fernanda Delgado García, the instructor and dancer behind Fernanda Delgado Tango in Dallas–Fort Worth.',
    paragraphs: [
      'Whether you’re taking your first steps, learning with a partner or looking for individual attention, the starting point is a conversation about what you want from your lessons.',
      'My work brings together private and group classes, salon and stage performances, tango DJ work and milonga organization. At the heart of it is something simple: I love to dance.',
    ],
    approvalNote:
      'Based on Fernanda’s questionnaire. Her expanded biography, teaching approach and portrait are still awaiting review.',
  },
  lessonIntro: {
    eyebrow: 'Make room for the dance',
    heading: 'More than a lesson.\nA world of tango.',
    description:
      'From your first steps to the atmosphere of a milonga, find the service that fits your plans. Ask Fernanda about availability, pricing and arrangements.',
    note: 'Contact Fernanda for pricing, lesson lengths and booking arrangements. No prices or cancellation rules have been published yet.',
  },
  contact: {
    eyebrow: 'Let’s start a conversation',
    heading: 'Your next step\nstarts here.',
    description:
      'Tell Fernanda about your dance experience, the service you’re interested in, or the event you’re planning.',
    locationHeading: 'Based in Dallas–Fort Worth',
    locationText:
      'Ask about available lesson locations when you get in touch. There is no fixed public studio address listed on this site.',
    pending:
      'Use email or phone to contact Fernanda directly. The demo form checks entries only; it does not send an inquiry.',
    socialHeading: 'Keep in step',
  },
  faqs: [
    {
      question: 'I’m new to tango. Where should I start?',
      answer:
        'Beginner lessons are available. Tell Fernanda that you’re starting from the beginning and ask which lesson format would suit you.',
    },
    {
      question: 'Do I need to bring a partner?',
      answer:
        'Ask Fernanda about the partner arrangements for your chosen lesson. Private, couples and group options are available; the requirements will be confirmed before booking.',
    },
    {
      question: 'Where do lessons take place?',
      answer:
        'Fernanda teaches in the Dallas–Fort Worth area. Confirm the specific venue, travel arrangements and any venue costs directly before booking.',
    },
    {
      question: 'What should I wear, and how do I book?',
      answer:
        'Ask Fernanda to confirm suitable clothes and shoes, lesson length, price, availability and cancellation terms before making a booking. Those details have not been published yet.',
    },
  ],
} as const;

/** Shared by header and footer; a separate legal page is not a marketing page. */
export const navigation = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#lessons' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Events', href: '/#events' },
  { label: 'Get in touch', href: '/#contact' },
] as const;

export function socialHref(value: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password)
      return url.href;
  } catch {
    /* Empty or invalid values stay inactive. */
  }
  return undefined;
}

export function emailHref(value: string): string | undefined {
  return /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)
    ? `mailto:${value}`
    : undefined;
}

export function telephoneHref(value: string): string | undefined {
  return /^tel:\+?[\d ()-]{7,}$/.test(value) ? value : undefined;
}
