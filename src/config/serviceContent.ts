/** One public offering, shared by Home, Services, and the Contact select. */
export interface Service {
  /** Unique stable anchor/form value, such as standard-cleaning. */
  id: string;
  number: string;
  title: string;
  homepage: { description: string; details: string };
  summary: string;
  description: string;
  includes: readonly string[];
  excludes: readonly string[];
}

/** Demonstration copy only. Customize and verify scope before use by a real business. */
export const services = [
  {
    id: 'standard-cleaning',
    number: '01',
    title: 'Standard Cleaning',
    homepage: {
      description:
        'A fresh reset for the rooms you live in every day. Keep everyday dust and mess from taking over your week.',
      details:
        'Sample scope: floors, accessible surfaces, kitchens & bathrooms.',
    },
    summary: 'An everyday reset for the spaces you use most.',
    description:
      'Designed as a routine refresh, standard cleaning focuses on accessible surfaces, floors, kitchens, and bathrooms. It could suit a home that is already maintained and needs help with the recurring cleaning list.',
    includes: [
      'Dust accessible furniture and open surfaces',
      'Vacuum rugs and carpets; sweep and mop suitable hard floors',
      'Wipe kitchen counters, sinks, and appliance exteriors',
      'Clean bathroom sinks, toilets, tubs, showers, and mirrors',
    ],
    excludes: [
      'Heavy buildup or detailed grout restoration',
      'Inside ovens, refrigerators, or cabinets',
      'Laundry, dishes, and organizing personal belongings',
    ],
  },
  {
    id: 'deep-cleaning',
    number: '02',
    title: 'Deep Cleaning',
    homepage: {
      description:
        'Give the details a little extra attention. A more thorough refresh for spaces that need more than the usual tidy-up.',
      details:
        'Sample scope: standard tasks plus baseboards, fixtures & buildup.',
    },
    summary: 'Extra attention for the details that are easy to put off.',
    description:
      'A more detailed refresh for a first visit, a seasonal reset, or a home with accumulated dust and everyday buildup. This example builds on standard cleaning, with more time for accessible edges, fixtures, and frequently touched areas.',
    includes: [
      'All example Standard Cleaning tasks',
      'Wipe accessible baseboards, door frames, and light switches',
      'Detail accessible fixtures and cabinet fronts',
      'Give extra attention to ordinary soap residue and kitchen buildup',
    ],
    excludes: [
      'Mold remediation or hazardous waste removal',
      'Permanent stain removal, repairs, or surface restoration',
      'Moving heavy furniture or cleaning areas requiring high ladders',
    ],
  },
  {
    id: 'move-cleaning',
    number: '03',
    title: 'Move-In/Move-Out Cleaning',
    homepage: {
      description:
        'Make room for your next chapter. Plan a cleaning for an empty home before you settle in or hand over the keys.',
      details:
        'Sample scope: empty rooms, cabinets & accessible interior surfaces.',
    },
    summary: 'A clean slate for an empty home and a new chapter.',
    description:
      'Intended for a vacant home before move-in or after belongings have been removed. The example scope concentrates on empty rooms, kitchen and bathroom surfaces, and accessible storage areas. It does not guarantee a deposit return or that a landlord’s checklist will be met.',
    includes: [
      'Clean accessible surfaces and floors in empty rooms',
      'Wipe inside empty cabinets and drawers',
      'Clean bathroom fixtures, mirrors, and kitchen counters',
      'Wipe accessible baseboards, doors, and appliance exteriors',
    ],
    excludes: [
      'Packing, moving, or disposing of furniture and belongings',
      'Post-construction dust, debris, or hazardous materials',
      'Inside appliances unless separately discussed and agreed',
    ],
  },
] as const satisfies readonly Service[];

export const philosophy = [
  {
    title: 'Start by listening',
    description:
      'The intended approach begins with the home, the household’s routine, and the spaces that need attention. A useful cleaning plan should reflect those priorities.',
  },
  {
    title: 'Make the scope clear',
    description:
      'Discuss tasks, exclusions, access, and pricing before scheduling. Clear expectations help people decide whether a proposed service is right for them.',
  },
  {
    title: 'Treat the home thoughtfully',
    description:
      'An ideal visit would respect personal belongings, surface care instructions, and agreed access arrangements. Special materials and delicate items should be discussed in advance.',
  },
] as const;

/** Client-editable demonstration copy. Keep claims and demo notices truthful. */
export const servicesPageContent = {
  eyebrow: 'A clean for every chapter',
  title: 'Find the right fresh start.',
  description:
    'A routine reset, a closer look at the details, or a clean slate for a move. Explore three example ways to care for your home.',
  planningEyebrow: 'Before scheduling',
  planningTitle: 'Good expectations make a good starting point.',
  planningDescription:
    'These inclusions and exclusions illustrate possible service scopes. A real provider would confirm the details for each home before any work begins.',
  ctaTitle: 'Not sure which clean fits?',
  ctaDescription:
    'Start with your priorities and the kind of refresh you have in mind.',
  notice: 'Fictional services · Sample scopes only · No real bookings',
  planningTips: [
    {
      title: 'Share what matters',
      description:
        'Describe your home’s size, condition, preferred timing, and priority rooms. Mention pets, delicate surfaces, and access needs.',
    },
    {
      title: 'Confirm the details',
      description:
        'Review tasks, exclusions, product preferences, pricing, and any optional extras. Interior windows and inside appliances should never be assumed included.',
    },
    {
      title: 'Prepare the space',
      description:
        'Agree on access and clear the surfaces to be cleaned. For a move-related visit, discuss when the home will be empty and whether utilities will be available.',
    },
  ],
} as const;

/** Editable copy; preserve accurate validation and provider-acceptance language. */
export const serviceLabels = {
  explore: 'Explore service',
  exploreAccessiblePrefix: 'Explore service:',
  service: 'Service',
  scope: 'Example scope',
  includes: 'Example inclusions',
  excludes: 'Outside this example scope',
  quoteAccessiblePrefix: 'Request a free quote for',
} as const;
