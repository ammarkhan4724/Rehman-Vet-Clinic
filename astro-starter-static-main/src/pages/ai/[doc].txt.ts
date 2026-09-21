import type { APIRoute } from 'astro';
import { machineDocs, plainTextResponse } from '~/lib/machine';

export async function getStaticPaths() {
  const docs = await machineDocs();
  return docs.map((doc) => ({
    params: { doc: doc.slug },
    props: { body: doc.body },
  }));
}

export const GET: APIRoute = ({ props }) => plainTextResponse(props.body);
