import type { APIRoute } from 'astro';
import { indexablePages } from '~/lib/pages';
import { agentsMarkdown, plainTextResponse } from '~/lib/machine';

export const GET: APIRoute = async () => plainTextResponse(agentsMarkdown(await indexablePages()));
