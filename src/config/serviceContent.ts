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
] as const;

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
