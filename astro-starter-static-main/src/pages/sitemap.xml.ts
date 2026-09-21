/**
 * /sitemap.xml — build-time generated sitemap.
 * No lastmod: stamping build time tells Google every page changed when only the build did.
 */
import type { APIRoute } from 'astro';
import { indexablePages } from '~/lib/pages';
import { site } from '~/data/site';

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async () => {
  const urls = (await indexablePages())
    .map((page) => `  <url>\n    <loc>${escapeXml(new URL(page.route, site.url).href)}</loc>\n  </url>`)
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
