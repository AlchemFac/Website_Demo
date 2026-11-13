/** Optional local logo, rendered alongside the visible business name. */
export interface BusinessLogo {
  src: string;
  width: number;
  height: number;
}

/** Keep all color tokens; customizing their values is optional. */
export interface BrandColors {
  primary: string;
  primaryHover: string;
  background: string;
  text: string;
  /** Secondary accent surface, used with the normal text color. */
  accent: string;
  surface: string;
  muted: string;
  border: string;
  onPrimary: string;
  captionSurface: string;
  imagePlaceholder: string;
}

/** Public business information only. See CLIENT_SETUP.md for client examples. */
export interface BusinessConfig {
  name: string;
  isDemo: boolean;
  description: string;
  // Only an approved public business number/address belongs here.
  phone: { display: string; href: string };
  email: string;
  serviceAreas: readonly string[];
  hours: readonly { days: string; hours: string }[];
  branding: {
    tagline: string;
    // The property is required; null means no logo image.
    logo: BusinessLogo | null;
    colors: BrandColors;
  };
}

/** Fictional defaults. Edit this existing object; do not create a second client config.
 * Public contacts, hours, and areas must be verified before a real client launch.
 */
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
    // Optional image: keep null, or supply src, width, and height.
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
} as const satisfies BusinessConfig;
