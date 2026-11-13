import { business } from './business';
/** Client-editable demonstration copy. Keep claims and demo notices truthful. */
export const homeContent = {
  benefits: [
    {
      title: 'More time for your life',
      description:
        'Spend less of your weekend catching up on chores and more of it doing what matters to you.',
    },
    {
      title: 'A space that feels settled',
      description:
        'A clean kitchen, refreshed bathroom, and dusted living spaces can make everyday routines feel easier.',
    },
    {
      title: 'A plan for your priorities',
      description:
        'Discuss the rooms and tasks that need attention so the proposed cleaning fits your home.',
    },
  ],
  heroEyebrow: 'A little less on your to-do list',
  heroTitle: 'A cleaner home.',
  heroEmphasis: 'A little more life.',
  heroDescription:
    'Make space for slow mornings and weekends well spent. Explore thoughtful home cleaning for everyday living in the Dallas–Fort Worth area.',
  findServicesLabel: 'Find your clean',
  heroNotice: 'Fictional business · Demo inquiries only. No real bookings.',
  heroCaption: business.branding.tagline,
  heroImageLabel: 'Original demonstration illustration',
  allServicesLabel: 'All services',
  scopeNote:
    'Illustrative services only. A real quote would confirm tasks, home size, pricing, and any exclusions before scheduling.',
  benefitsDescription:
    'Life gets full. Professional cleaning can help take a recurring chore off your plate, whether you need an occasional refresh or a regular routine.',
  prioritiesLabel: 'Talk through your priorities',
  areaLabel: 'Ask about your area',
  areaMark: 'N TX',
  areaNoteTitle: 'Your home. Your priorities.',
  areaNoteDescription:
    'Start with your location and the kind of clean you have in mind. The details can come together from there.',
  areaNotice: 'Sample locations · Fictional service',
  ctaEyebrow: 'Make room for what matters',
  ctaTitle: 'Your fresh start begins here.',
  ctaDescription: 'Tell us what a cleaner home would look like for you.',
  ctaNotice:
    'Visit the Contact page for demo information. No real quotes or bookings are available.',
  heroImageSrc: '/images/calm-home.svg',
  heroImageAlt:
    'Illustration of a sunlit living room with a cream sofa, houseplants, and a wooden coffee table.',
  servicesEyebrow: 'A clean for every chapter',
  servicesTitle: 'What does your home need?',
  servicesDescription:
    'From a regular reset to a fresh beginning, explore three ways to lighten your list.',
  benefitsEyebrow: 'Less upkeep. More breathing room.',
  benefitsTitle: 'Let home feel like a place to unwind.',
  processEyebrow: 'From your list to a fresh start',
  processTitle: 'A simpler way to a cleaner home.',
  processDescription: 'Here’s how a typical cleaning inquiry could work.',
  areaEyebrow: 'Around the neighborhood',
  areaTitle: 'At home in North Texas.',
  areaDescription:
    'Example service areas in the Dallas–Fort Worth metroplex. These locations illustrate a possible service footprint, not confirmed coverage.',
  citiesLabel: 'Example service cities',
  heroImageWidth: 840,
  heroImageHeight: 920,
  steps: [
    {
      title: 'Request Quote',
      description:
        'Share your home’s size, the service you’re interested in, and your cleaning priorities.',
    },
    {
      title: 'Schedule Cleaning',
      description:
        'Review the proposed scope and price, then discuss a date that fits your routine.',
    },
    {
      title: 'Enjoy Your Home',
      description:
        'With the agreed cleaning taken care of, settle back into your space.',
    },
  ],
} as const;

/** Client-editable demonstration copy. Keep claims and demo notices truthful. */
export const aboutContent = {
  eyebrow: 'The idea behind the clean',
  title: 'More room for everyday life.',
  description: `A home is where life happens. The idea behind ${business.name} is simple: thoughtful cleaning that helps make daily routines feel a little lighter.`,
  introductionEyebrow: 'A thoughtful starting point',
  introductionTitle: 'Home care with a clear purpose.',
  philosophyEyebrow: 'How we would approach the work',
  philosophyTitle: 'Simple principles. Clear expectations.',
  philosophyDescription:
    'These principles describe the company’s intended service philosophy, not verified performance claims.',
  areaEyebrow: 'Around North Texas',
  areaTitle: 'A neighborhood-minded idea.',
  areaDescription:
    'Dallas, Plano, and Frisco illustrate the proposed Dallas–Fort Worth service area. Actual coverage would need to be confirmed by a real provider.',
  citiesLabel: 'Example service areas',
  ctaTitle: 'What would a fresh start look like for you?',
  ctaDescription:
    'Explore the Contact page to see the sample details for this fictional business.',
  notice:
    'A fictional company, presented as a demonstration. No real services or bookings.',
  introduction: `${business.name} is a fictional residential cleaning company imagined for households in North Texas. Its proposed services cover everyday upkeep, more detailed refreshes, and cleaning around a move.`,
  purpose:
    'The intended focus is practical: understand what the household needs, agree on the work, and approach each space with care. This site describes that service concept, rather than an operating company’s history or credentials.',
  servicesLabel: 'Explore the example services',
  areaNoteTitle: 'Every home has its own routine.',
  areaNoteDescription:
    'Location is only the starting point. Home size, preferred timing, and cleaning priorities would help shape a proposed visit.',
  areaLabel: 'Ask about your area',
  areaNotice: 'Example locations only. Coverage is not confirmed.',
} as const;
