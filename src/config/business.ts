/** Fictional sample data. Replace and verify every value before launch. */
export const business = {
  name: 'North Texas Home Cleaning',
  isDemo: true,
  description: 'A fictional small-business website template for a home cleaning service.',
  phone: { display: '(214) 555-0100', href: 'tel:+12145550100' },
  email: 'hello@example.com',
  serviceAreas: ['Dallas', 'Plano', 'Frisco'],
  hours: [
    { days: 'Monday–Friday', hours: '9:00 AM–5:00 PM' },
    { days: 'Saturday–Sunday', hours: 'Closed' },
  ],
  branding: {
    tagline: 'A fresh start for your space.',
    colors: { primary: '#466653', background: '#fafbf8', text: '#292e2b', accent: '#e7eee6' },
  },
} as const;
