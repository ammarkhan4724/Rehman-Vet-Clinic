/**
 * /robots.txt — build-time generated crawl directives.
 * Astro pre-renders this GET handler, so dist/robots.txt is a flat static file.
 */
import type { APIRoute } from 'astro';
import { site } from '~/data/site';

export const GET: APIRoute = () => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Lead API — private, not content.',
    'Disallow: /api/',
    '',
    '# Plain-text mirror of this site, for AI agents and crawlers.',
    `# Index:      ${new URL('/ai/index.txt', site.url).href}`,
    `# Per page:   ${new URL('/ai/', site.url).href}<page>.txt`,
    `# Guidance:   ${new URL('/agents.md', site.url).href}`,
    `# Summary:    ${new URL('/llms.txt', site.url).href}`,
    `# Sitemap:    ${new URL('/sitemap.md', site.url).href}`,
    '',
    `Sitemap: ${new URL('/sitemap.xml', site.url).href}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
