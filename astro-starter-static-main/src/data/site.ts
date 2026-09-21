/**
 * Site-wide facts. One source of truth for schema, the footer, contact
 * links, and share metadata.
 *
 * TEMPLATE PLACEHOLDER — every value below is demo copy for the starter.
 * Replace it with facts the client has actually approved. If something is
 * unknown, leave it out rather than guessing (same rule as jirarpar / ADR-013).
 */
export const site = {
  /** Set true until a client repo has replaced the demo identity. */
  isPlaceholder: true,
  name: 'Cedar & Pine Studio',
  shortName: 'Cedar & Pine',
  url: 'https://example.com',
  logo: '/assets/logo.svg',
  ogImage: '/assets/og.svg',
  description:
    'TEMPLATE PLACEHOLDER — a neighborhood studio for strategy, design, and community programs. Replace this copy when you create a client site from this template.',
  foundingDate: '2024',
  telephone: '+15555550100',
  telephoneDisplay: '(555) 555-0100',
  email: 'hello@example.com',
  /** schema.org type for SchemaOrganization. Organization | NGO | Corporation … */
  organizationType: 'Organization',
  /** schema.org LocalBusiness subtype for home / contact. */
  localBusinessType: 'ProfessionalService',
  priceRange: '$$',
  address: {
    streetAddress: '100 Example Street',
    addressLocality: 'Anytown',
    addressRegion: 'CA',
    postalCode: '00000',
    addressCountry: 'US',
  },
  sameAs: [
    'https://www.linkedin.com/company/example',
    'https://www.instagram.com/example',
  ],
  areaServed: ['Anytown', 'Harbor District'],
} as const;

export type Site = typeof site;
