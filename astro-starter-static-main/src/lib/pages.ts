/**
 * pages — the list of routes this build actually produces.
 *
 * Sitemap, llms.txt and the AI mirrors all ask "what does this site publish?"
 * A hand-kept list falls behind. This assembles the answer from:
 *   - every static .astro file under src/pages
 *   - every entry of a content collection behind a dynamic route
 *
 * A dynamic route this file does not know how to enumerate fails the build.
 */
import { getCollection } from 'astro:content';
import { parse as parseYaml } from 'yaml';

const sources = import.meta.glob<string>('../pages/**/*.astro', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const DYNAMIC_ROUTES: Record<string, string> = {
  '../pages/services/[slug].astro': 'the services collection (src/content/services/*.yaml)',
  '../pages/blog/[slug].astro': 'the posts collection (src/content/posts/*.md)',
};

const contentEntries = import.meta.glob<string>('../content/**/*.{yaml,yml,md,mdx}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const CONTENT_EXTENSIONS = ['yaml', 'yml', 'md', 'mdx'];
const NOT_A_ROUTE = new Set(['../pages/404.astro']);

export interface BuiltPage {
  route: string;
  title: string;
  description?: string;
  noindex: boolean;
}

function routeFor(key: string): string {
  const rel = key.replace('../pages/', '').replace(/\.astro$/, '');
  if (rel === 'index') return '/';
  return `/${rel.replace(/\/index$/, '')}/`;
}

function openingTag(source: string): string | null {
  const start = source.indexOf('<BaseLayout');
  if (start === -1) return null;

  let quote: string | null = null;
  let braces = 0;

  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') braces += 1;
    else if (char === '}') braces -= 1;
    else if (char === '>' && braces === 0) return source.slice(start, i + 1);
  }
  return null;
}

const NAMED = new Map([
  ['amp', '&'],
  ['lt', '<'],
  ['gt', '>'],
  ['quot', '"'],
  ['apos', "'"],
  ['nbsp', ' '],
]);

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body: string) => {
    if (body.startsWith('#')) {
      const code = body[1]?.toLowerCase() === 'x'
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED.get(body.toLowerCase()) ?? match;
  });
}

function stringAttr(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return match ? decodeEntities(match[1]!) : undefined;
}

function noindexAttr(tag: string): boolean {
  const braced = tag.match(/\bnoindex\s*=\s*\{([^}]*)\}/);
  if (braced) return braced[1]!.trim() !== 'false';
  const quoted = tag.match(/\bnoindex\s*=\s*"([^"]*)"/);
  if (quoted) return quoted[1] !== 'false';
  return /\bnoindex(?=[\s/>])/.test(tag);
}

function frontmatterOf(raw: string, path: string): string {
  if (!/\.mdx?$/.test(path)) return raw;
  const fenced = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return fenced ? fenced[1]! : '';
}

function contentSeoFor(
  key: string,
  source: string,
): { title?: string; description?: string } | null {
  const calls = [...source.matchAll(/getEntry\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w./-]+)['"]\s*\)/g)];
  if (calls.length === 0) return null;
  if (calls.length > 1) {
    throw new Error(
      `${key} makes ${calls.length} getEntry() calls, so which one holds the page SEO is ambiguous.`,
    );
  }

  const [, collection, id] = calls[0]!;
  const path = CONTENT_EXTENSIONS.map((ext) => `../content/${collection}/${id}.${ext}`).find(
    (candidate) => candidate in contentEntries,
  );
  if (!path) {
    throw new Error(
      `${key} reads getEntry('${collection}', '${id}') but that content file does not exist.`,
    );
  }

  const parsed = parseYaml(frontmatterOf(contentEntries[path]!, path)) as {
    seo?: { title?: string; description?: string };
    title?: string;
    description?: string;
    heading?: string;
  };

  return {
    title: parsed.seo?.title ?? parsed.title ?? parsed.heading,
    description: parsed.seo?.description ?? parsed.description,
  };
}

function staticPages(): BuiltPage[] {
  return Object.entries(sources)
    .filter(([key]) => !(key in DYNAMIC_ROUTES) && !NOT_A_ROUTE.has(key))
    .map(([key, source]) => {
      if (key.includes('[')) {
        throw new Error(
          `${key} is a dynamic route with no entry in DYNAMIC_ROUTES (src/lib/pages.ts).`,
        );
      }

      const tag = openingTag(source);
      if (!tag) {
        throw new Error(`${key} does not use <BaseLayout>. Every page must, so SEOHead is always present.`);
      }

      const literalTitle = stringAttr(tag, 'title');
      const seo = literalTitle ? null : contentSeoFor(key, source);
      const title = literalTitle ?? seo?.title;
      if (!title) {
        throw new Error(
          `${key} passes no title to <BaseLayout> that can be read from the source.`,
        );
      }

      return {
        route: routeFor(key),
        title,
        description: stringAttr(tag, 'description') ?? seo?.description,
        noindex: noindexAttr(tag),
      };
    });
}

async function dynamicPages(): Promise<BuiltPage[]> {
  const services = await getCollection('services');
  const posts = await getCollection('posts');

  return [
    ...services.map((entry) => ({
      route: `/services/${entry.id}/`,
      title: entry.data.seo.title,
      description: entry.data.seo.description,
      noindex: false,
    })),
    ...posts.map((entry) => ({
      route: `/blog/${entry.id}/`,
      title: entry.data.title,
      description: entry.data.description,
      noindex: false,
    })),
  ];
}

export async function builtPages(): Promise<BuiltPage[]> {
  const pages = [...staticPages(), ...(await dynamicPages())];

  for (const page of pages) {
    if (page.route.includes('[') || page.route.includes(']')) {
      throw new Error(`Route "${page.route}" is a pattern, not a URL.`);
    }
  }

  return pages.sort((a, b) => {
    if (a.route === '/') return -1;
    if (b.route === '/') return 1;
    return a.route.localeCompare(b.route);
  });
}

export async function indexablePages(): Promise<BuiltPage[]> {
  return (await builtPages()).filter((page) => !page.noindex);
}

export function slugFor(route: string): string {
  if (route === '/') return 'home';
  return route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}
