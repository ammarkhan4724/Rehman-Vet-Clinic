/**
 * Navigation — one source of truth for the header, the mobile drawer,
 * and the footer. A link can never appear in one and not the others by accident.
 */
export interface NavLink {
  /** Matches BaseLayout's `navActive` prop. */
  key: string;
  label: string;
  href: string;
}

export const primaryLinks: NavLink[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about/' },
  { key: 'services', label: 'Services', href: '/services/' },
  { key: 'blog', label: 'Journal', href: '/blog/' },
  { key: 'faq', label: 'FAQ', href: '/faq/' },
  { key: 'contact', label: 'Contact', href: '/contact/' },
];

export const drawerLinks: NavLink[] = primaryLinks;

export const footerExplore: NavLink[] = [
  { key: '', label: 'About', href: '/about/' },
  { key: '', label: 'Services', href: '/services/' },
  { key: '', label: 'Journal', href: '/blog/' },
  { key: '', label: 'FAQ', href: '/faq/' },
  { key: '', label: 'Contact', href: '/contact/' },
];

export const footerLegal: NavLink[] = [
  { key: '', label: 'Sitemap', href: '/sitemap/' },
  { key: '', label: 'Privacy', href: '/privacy/' },
  { key: '', label: 'Terms', href: '/terms/' },
];
