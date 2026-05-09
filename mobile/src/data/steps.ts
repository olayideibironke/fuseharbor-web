export type Step = {
  number: string;
  title: string;
  description: string;
};

export const steps: Step[] = [
  {
    number: '01',
    title: 'Tell us about your home',
    description:
      'Share your project goals, property type, and what kind of upgrade you are considering.',
  },
  {
    number: '02',
    title: 'Get matched with vetted pros',
    description:
      'FuseHarbor is designed to connect homeowners with qualified professionals aligned with the work needed.',
  },
  {
    number: '03',
    title: 'Review next steps clearly',
    description:
      'Compare direction, scope, and timing in a cleaner homeowner-centered flow.',
  },
  {
    number: '04',
    title: 'Move forward with confidence',
    description:
      'Book your project through a warmer, more premium electrification experience.',
  },
];
