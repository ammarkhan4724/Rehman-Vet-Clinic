import type { APIRoute } from 'astro';
import { indexablePages } from '~/lib/pages';
import { plainTextResponse, sitemapMarkdown } from '~/lib/machine';

export const GET: APIRoute = async () => plainTextResponse(sitemapMarkdown(await indexablePages()));
