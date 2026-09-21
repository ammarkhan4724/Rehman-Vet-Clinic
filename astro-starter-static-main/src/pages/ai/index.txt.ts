import type { APIRoute } from 'astro';
import { indexPage, machineDocs, plainTextResponse } from '~/lib/machine';

export const GET: APIRoute = async () => plainTextResponse(indexPage(await machineDocs()));
