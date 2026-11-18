import type { BrandColors } from '../../../src/config/business';

/** Public, owner-approved information only. Empty contact values render as text,
 * never as broken mailto/tel/social links. Do not put credentials here. */
export interface InstructorConfig {
  name: string;
  businessName: string;
  area: string;
  isPreview: boolean;
  contentApproved: boolean;
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
  name: 'Maria Fernanda',
  businessName: 'Tango with Maria Fernanda',
  area: 'Dallas–Fort Worth',
  isPreview: true,
  contentApproved: false,
  contact: {
    email: '',
    phoneDisplay: '',
    phoneHref: '',
    instagram: '',
    facebook: '',
  },
  colors: {
    primary: '#793a36',
    primaryHover: '#622b28',
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

/** The four lesson types are confirmed. Descriptions need Maria's approval.
 * Leave prices/durations empty until agreed; do not invent a booking policy. */
export const lessons: readonly Lesson[] = [
  {
    id: 'private',
    title: 'Private lessons',
    description:
      'Time to focus on your own dancing. Explore the questions, movements and musical moments you want to work on in an individual lesson.',
    format: 'Individual attention',
    price: '',
    duration: '',
  },
  {
    id: 'beginner',
    title: 'Your first steps',
    description:
      'An introduction for beginners. Explore the walk, rhythm and connection at the heart of tango, and begin building a foundation for the dance.',
    format: 'Beginner lessons',
    price: '',
    duration: '',
  },
  {
    id: 'couples',
    title: 'Learn together',
    description:
      'Share the experience with a partner. Make space for listening, moving together and discovering a new way to connect through dance.',
    format: 'Couples lessons',
    price: '',
    duration: '',
  },
  {
    id: 'groups',
    title: 'Find your community',
    description:
      'Explore tango in a group setting. Learn alongside other dancers and share the experience of music, movement and practice.',
    format: 'Group lessons',
    price: '',
    duration: '',
  },
];

export const content = {
  metadata: {
    title: 'Tango lessons with Maria Fernanda | Dallas–Fort Worth',
    description:
      'Meet Maria Fernanda and explore private, beginner, couples and group tango lessons in the Dallas–Fort Worth area. Contact details are being finalized.',
  },
  hero: {
    eyebrow: 'Tango lessons · Dallas–Fort Worth',
    heading: 'Tango with',
    emphasis: 'Maria Fernanda.',
    description:
      'A little music. A shared moment. A new way to move. Explore tango through private, beginner, couples and group lessons.',
    primaryLabel: 'Find your lesson',
    secondaryLabel: 'Meet Maria Fernanda',
  },
  about: {
    eyebrow: 'Meet your instructor',
    heading: 'A dance is personal.\nSo is choosing a teacher.',
    introduction:
      'I’m Maria Fernanda, an independent tango instructor in the Dallas–Fort Worth area.',
    paragraphs: [
      'Whether you’re taking your first steps, learning with a partner or looking for individual attention, the starting point is a conversation about what you want from your lessons.',
      'Get to know the person behind the teaching, explore the lesson options below, and ask about the format that feels right for you.',
    ],
    approvalNote:
      'Introduction draft — Maria’s teaching story, approach and portrait will be added after her review.',
  },
  lessonIntro: {
    eyebrow: 'Make room for the dance',
    heading: 'Your way into tango.',
    description:
      'Start with the kind of lesson that suits you. Ask Maria about the format, availability and location before making a booking.',
    note: 'Prices, lesson lengths and booking details are being finalized.',
  },
  contact: {
    eyebrow: 'Let’s start a conversation',
    heading: 'Your next step\nstarts here.',
    description:
      'Tell Maria a little about your experience, the lesson you’re interested in and what you’d like to learn.',
    locationHeading: 'Teaching in Dallas–Fort Worth',
    locationText:
      'Ask about available lesson locations when you get in touch. There is no fixed public studio address listed on this site.',
    pending:
      'Contact details are being finalized. Online inquiries are not available yet.',
    socialHeading: 'Keep in step',
  },
  faqs: [
    {
      question: 'I’m new to tango. Where should I start?',
      answer:
        'Beginner lessons are available. Tell Maria that you’re starting from the beginning and ask which lesson format would suit you.',
    },
    {
      question: 'Do I need to bring a partner?',
      answer:
        'Ask Maria about the partner arrangements for your chosen lesson. Private, couples and group options are available; the requirements will be confirmed before booking.',
    },
    {
      question: 'Where do lessons take place?',
      answer:
        'Maria teaches in the Dallas–Fort Worth area. Confirm the specific venue, travel arrangements and any venue costs directly before booking.',
    },
    {
      question: 'What should I wear, and how do I book?',
      answer:
        'Ask Maria to confirm suitable clothes and shoes, lesson length, price, availability and cancellation terms before making a booking. Those details have not been published yet.',
    },
  ],
} as const;

/** Shared by header and footer; a separate legal page is not a marketing page. */
export const navigation = [
  { label: 'About Maria', href: '/#about' },
  { label: 'Lessons', href: '/#lessons' },
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
