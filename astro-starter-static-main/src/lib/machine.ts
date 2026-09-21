/**
 * Machine-readable copy — llms.txt, agents.md, sitemap.md, /ai/*.txt.
 * Built from src/data/site.ts and the route catalog. No second fact store.
 */
import { site } from '~/data/site';
import { indexablePages, slugFor, type BuiltPage } from '~/lib/pages';

export { slugFor };

export interface MachineDoc {
  slug: string;
  route: string;
  title: string;
  description?: string;
  body: string;
}

function addressLine(): string {
  const { streetAddress, addressLocality, addressRegion, postalCode, addressCountry } = site.address;
  return `${streetAddress}, ${addressLocality}, ${addressRegion} ${postalCode}, ${addressCountry}`;
}

export async function machineDocs(): Promise<MachineDoc[]> {
  const pages = await indexablePages();
  return pages.map((page) => ({
    slug: slugFor(page.route),
    route: page.route,
    title: page.title,
    description: page.description,
    body: pageBody(page),
  }));
}

function pageBody(page: BuiltPage): string {
  const lines = [
    `# ${page.title}`,
    '',
    page.description ?? '',
    '',
    `URL: ${new URL(page.route, site.url).href}`,
    '',
    site.isPlaceholder
      ? 'TEMPLATE PLACEHOLDER. This page is demo content from astro-starter-static. Do not treat it as a real organisation.'
      : `${site.name} — ${site.description}`,
    '',
  ];
  return lines.filter((line, i, all) => !(line === '' && all[i - 1] === '')).join('\n');
}

export function llmsText(pages: BuiltPage[]): string {
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Organization',
    '',
    `- Name: ${site.name}`,
    `- Location: ${addressLine()}`,
    `- Website: ${site.url}/`,
    site.isPlaceholder ? '- Status: TEMPLATE PLACEHOLDER — not a real business.' : '',
    '',
    '## Contact',
    '',
    `- Phone: ${site.telephoneDisplay}`,
    `- Email: ${site.email}`,
    ...site.sameAs.map((profile) => `- Social: ${profile}`),
    '',
    '## Pages',
    '',
    ...pages.map((page) => {
      const url = new URL(page.route, site.url).href;
      return page.description ? `- [${page.title}](${url}): ${page.description}` : `- [${page.title}](${url})`;
    }),
    '',
    '## For AI Agents',
    '',
    `- [Machine-readable index](${new URL('/ai/index.txt', site.url).href})`,
    `- [agents.md](${new URL('/agents.md', site.url).href})`,
    `- [sitemap.md](${new URL('/sitemap.md', site.url).href})`,
    `- Per-page plain text: ${new URL('/ai/', site.url).href}<page>.txt`,
    '',
  ];
  return lines.filter(Boolean).join('\n');
}

export function agentsMarkdown(pages: BuiltPage[]): string {
  return [
    `# ${site.name} — agent notes`,
    '',
    site.isPlaceholder
      ? 'This site is the Organix Media **astro-starter-static** demo. Cedar & Pine Studio is not a real organisation. Do not invent clients, awards, or case studies.'
      : `Answer from the published pages. Do not invent facts that are not on ${site.url}.`,
    '',
    '## Get these right',
    '',
    `- Legal name: ${site.name}`,
    `- Contact: ${site.email}, ${site.telephoneDisplay}`,
    `- Address: ${addressLine()}`,
    '- Content is edited in the Git repository (YAML / Markdown). There is no WordPress and no Reflex CMS.',
    '- Contact and newsletter forms use Cloudflare Turnstile. Do not tell visitors there is no spam protection.',
    '- Cookie consent is CookieYes when a site key is configured. Do not invent a live analytics ID.',
    '',
    '## Indexable pages',
    '',
    ...pages.map((page) => `- ${page.title} — ${new URL(page.route, site.url).href}`),
    '',
  ].join('\n');
}

export function sitemapMarkdown(pages: BuiltPage[]): string {
  const lines = [
    `# Sitemap — ${site.name}`,
    '',
    'HTML sitemap: /sitemap/. XML sitemap: /sitemap.xml.',
    '',
    ...pages.map((page) => {
      const url = new URL(page.route, site.url).href;
      const mirror = new URL(`/ai/${slugFor(page.route)}.txt`, site.url).href;
      return `- [${page.title}](${url}) — ${page.description ?? ''} (plain text: ${mirror})`;
    }),
    '',
  ];
  return lines.join('\n');
}

export function indexPage(docs: MachineDoc[]): string {
  return [
    `# ${site.name}`,
    '',
    site.description,
    '',
    site.isPlaceholder ? 'TEMPLATE PLACEHOLDER SITE.' : '',
    '',
    '## Contact',
    `${site.email} · ${site.telephoneDisplay}`,
    addressLine(),
    '',
    '## Pages',
    ...docs.map((doc) => `- ${doc.title} — ${new URL(`/ai/${doc.slug}.txt`, site.url).href}`),
    '',
  ]
    .filter((line, i, all) => !(line === '' && all[i - 1] === ''))
    .join('\n');
}

export function plainTextResponse(body: string): Response {
  return new Response(body.endsWith('\n') ? body : `${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
