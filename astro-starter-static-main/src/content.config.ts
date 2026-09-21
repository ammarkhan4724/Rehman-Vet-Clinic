import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Content collections.
 *
 * Hard rule: prose never lives in a .astro file. If a writer would ever
 * change it, it is content. A missing required field fails the build.
 */

const seo = z.object({
  title: z.string(),
  description: z.string(),
});

const onePage = (dir: string) => glob({ pattern: '*.yaml', base: `./src/content/${dir}` });

const home = defineCollection({
  loader: onePage('home'),
  schema: z.object({
    seo,
    navActive: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      lede: z.string(),
      image: z.object({ src: z.string(), alt: z.string() }),
      primaryCta: z.object({ label: z.string(), href: z.string() }),
      secondaryCta: z.object({ label: z.string(), href: z.string() }),
    }),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
    intro: z.object({
      heading: z.string(),
      body: z.string(),
    }),
    servicesTeaser: z.object({
      heading: z.string(),
      body: z.string(),
    }),
  }),
});

const about = defineCollection({
  loader: onePage('about'),
  schema: z.object({
    seo,
    navActive: z.string(),
    heading: z.string(),
    lede: z.string(),
    paragraphs: z.array(z.string()).min(1),
  }),
});

const contact = defineCollection({
  loader: onePage('contact'),
  schema: z.object({
    seo,
    navActive: z.string(),
    heading: z.string(),
    lede: z.string(),
    submitLabel: z.string(),
  }),
});

const faq = defineCollection({
  loader: onePage('faq'),
  schema: z.object({
    seo,
    navActive: z.string(),
    heading: z.string(),
    lede: z.string(),
    items: z.array(z.object({ question: z.string(), answer: z.string() })).min(1),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/services' }),
  schema: z.object({
    order: z.number().int(),
    name: z.string(),
    summary: z.string(),
    body: z.string(),
    seo,
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    image: z.object({ src: z.string(), alt: z.string() }).optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({
    seo,
    heading: z.string(),
    lastUpdated: z.string(),
  }),
});

export const collections = {
  home,
  about,
  contact,
  faq,
  services,
  posts,
  legal,
};
