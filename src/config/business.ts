/** Optional local logo, rendered alongside the visible business name. */
export interface BusinessLogo {
  src: string;
  width: number;
  height: number;
}

/** Fictional sample data. Replace and verify every value before launch. */
export const business = {
  name: 'North Texas Home Cleaning',
  isDemo: true,
  description:
    'A fictional small-business website template for a home cleaning service.',
  phone: { display: '(214) 555-0100', href: 'tel:+12145550100' },
  email: 'hello@example.com',
  serviceAreas: ['Dallas', 'Plano', 'Frisco'],
  hours: [
    { days: 'Monday–Friday', hours: '9:00 AM–5:00 PM' },
    { days: 'Saturday–Sunday', hours: 'Closed' },
  ],
  branding: {
    tagline: 'A fresh start for your space.',
    logo: null as BusinessLogo | null,
    colors: {
      primary: '#466653',
      primaryHover: '#344d3e',
      background: '#fafbf8',
      text: '#292e2b',
      accent: '#e7eee6',
      surface: '#ffffff',
      muted: '#58615b',
      border: '#dce3dc',
      onPrimary: '#ffffff',
      captionSurface: '#fffaf0',
      imagePlaceholder: '#eee5d3',
    },
  },
} as const;
