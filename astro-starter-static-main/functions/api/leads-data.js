/**
 * GET /api/leads-data — admin read of captured leads.
 * Requires ADMIN_PASS, compared in constant time. Ships no data without it.
 */
function timingSafeEqual(a, b) {
  const left = new TextEncoder().encode(String(a));
  const right = new TextEncoder().encode(String(b));
  if (left.byteLength !== right.byteLength) return false;
  let out = 0;
  for (let i = 0; i < left.byteLength; i += 1) out |= left[i] ^ right[i];
  return out === 0;
}

export async function onRequestGet({ request, env }) {
  const supplied = request.headers.get('authorization') || '';
  const token = supplied.toLowerCase().startsWith('bearer ')
    ? supplied.slice(7)
    : new URL(request.url).searchParams.get('pass') || '';

  if (!env.ADMIN_PASS || !token || !timingSafeEqual(token, env.ADMIN_PASS)) {
    return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'storage_unavailable' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }

  const { results } = await env.DB.prepare(
    'SELECT id, form, name, email, phone, message, page_path, email_status, created_at FROM leads ORDER BY created_at DESC LIMIT 200',
  ).all();

  return new Response(JSON.stringify({ ok: true, leads: results || [] }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
