import type { APIRoute } from 'astro';
import { indexablePages } from '~/lib/pages';
import { llmsText, plainTextResponse } from '~/lib/machine';

export const GET: APIRoute = async () => plainTextResponse(llmsText(await indexablePages()));
