/**
 * POST /api/lead — lead capture (Cloudflare Pages Function).
 *
 * Order:
 *   1. Parse body
 *   2. Honeypot — silently accept + drop
 *   3. Cloudflare Turnstile siteverify (required in production)
 *   4. Validate against FORMS
 *   5. D1 write FIRST — source of truth
 *   6. Best-effort email / webhook — never lose a lead if these fail
 *
 * Runtime secrets (Cloudflare Pages → Settings → Environment variables):
 *   TURNSTILE_SECRET_KEY  required — fails closed when unset
 *   CF_EMAIL_TOKEN        optional
 *   CRM_WEBHOOK_URL       optional
 *   MASTER_GHL_WEBHOOK_URL optional
 */

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

/**
 * The form keys the server accepts. Exported so LeadForm.astro and the
 * lead-capture test share this contract instead of restating it.
 */
export const FORMS = {
  newsletter: { fields: ['email'], required: ['email'] },
  contact: { fields: ['name', 'email', 'phone', 'message'], required: ['name', 'email', 'message'] },
};

const LABELS = {
  name: 'Full name',
  email: 'Email',
  phone: 'Phone',
  message: 'Message',
};
const FORM_TITLES = {
  newsletter: 'newsletter signup',
  contact: 'contact',
};

const MAX_LEN = { default: 500, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...CORS, ...extra },
  });
}

function id() {
  return (crypto.randomUUID && crypto.randomUUID()) || `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  let raw = {};
  const ct = request.headers.get('content-type') || '';
  try {
    if (ct.includes('application/json')) {
      raw = await request.json();
    } else {
      const fd = await request.formData();
      for (const [k, v] of fd.entries()) raw[k] = typeof v === 'string' ? v : '';
    }
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }
  if (!raw || typeof raw !== 'object') return json({ ok: false, error: 'invalid_body' }, 400);

  if (typeof raw._hp === 'string' && raw._hp.trim() !== '') {
    return json({ ok: true, message: 'Thanks' });
  }

  const turnstile = await verifyTurnstile(raw['cf-turnstile-response'], env, request);
  if (!turnstile.ok) return json({ ok: false, error: turnstile.error }, turnstile.status);

  const form = String(raw._form || '').trim();
  const def = FORMS[form];
  if (!def) return json({ ok: false, error: 'unknown_form' }, 400);

  const fields = {};
  const errors = {};
  for (const name of def.fields) {
    let value = typeof raw[name] === 'string' ? raw[name].trim() : '';
    const cap = MAX_LEN[name] || MAX_LEN.default;
    if (value.length > cap) value = value.slice(0, cap);
    if (def.required.includes(name) && value === '') {
      errors[name] = 'required';
      continue;
    }
    if (name === 'email' && value !== '' && !EMAIL_RE.test(value)) {
      errors[name] = 'invalid_email';
      continue;
    }
    if (value !== '') fields[name] = value;
  }
  if (Object.keys(errors).length) return json({ ok: false, errors }, 400);

  const now = new Date().toISOString();
  const leadId = id();
  const pagePath = typeof raw._path === 'string' ? raw._path.slice(0, 256) : null;
  const ip = request.headers.get('cf-connecting-ip') || null;
  const ua = (request.headers.get('user-agent') || '').slice(0, 512) || null;

  if (!env.DB) return json({ ok: false, error: 'storage_unavailable' }, 503);
  try {
    await env.DB.prepare(
      `INSERT INTO leads (id, form, name, email, phone, subject, message, fields_json, page_path, ip, user_agent, email_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        leadId,
        form,
        fields.name || null,
        fields.email || null,
        fields.phone || null,
        null,
        fields.message || null,
        JSON.stringify(fields),
        pagePath,
        ip,
        ua,
        env.CF_EMAIL_TOKEN ? 'pending' : 'skipped',
        now,
      )
      .run();
  } catch {
    return json({ ok: false, error: 'storage_failed' }, 503);
  }

  await Promise.allSettled([
    notifyEmail(env, { form, fields, pagePath, leadId, now }),
    env.CRM_WEBHOOK_URL ? postJson(env.CRM_WEBHOOK_URL, { form, fields, pagePath, leadId }) : null,
    env.MASTER_GHL_WEBHOOK_URL
      ? postJson(env.MASTER_GHL_WEBHOOK_URL, { form, fields, pagePath, leadId })
      : null,
  ]);

  return json({ ok: true, message: "Thank you — we've received your message." });
}

async function verifyTurnstile(token, env, request) {
  if (!env.TURNSTILE_SECRET_KEY) {
    return {
      ok: false,
      status: 503,
      error: 'Form is not properly configured. Please contact the site owner.',
    };
  }
  if (typeof token !== 'string' || !token) {
    return {
      ok: false,
      status: 400,
      error: 'Spam protection challenge missing. Please refresh and try again.',
    };
  }

  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (ip) body.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const out = await res.json();
    if (!out.success) {
      return {
        ok: false,
        status: 403,
        error: 'Spam protection challenge failed. Please refresh and try again.',
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      status: 503,
      error: 'Spam protection could not be verified. Please try again.',
    };
  }
}

async function notifyEmail(env, { form, fields, pagePath, leadId, now }) {
  if (!env.CF_EMAIL_TOKEN || !env.CF_ACCOUNT_ID || !env.NOTIFY_TO || !env.NOTIFY_FROM) return;
  const formTitle = FORM_TITLES[form] || form;
  const text = [
    `New ${formTitle} submission`,
    '',
    ...Object.entries(fields).map(([k, v]) => `${LABELS[k] || k}: ${v}`),
    '',
    `Page: ${pagePath || '-'}`,
    `Received: ${now}`,
    `Lead ID: ${leadId}`,
  ].join('\n');

  let status = 'failed';
  let errMsg = null;
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/email/sending/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CF_EMAIL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: env.NOTIFY_TO.split(',').map((s) => s.trim()).filter(Boolean),
          from: env.NOTIFY_FROM,
          ...(fields.email ? { reply_to: fields.email } : {}),
          subject: `New ${formTitle} submission`,
          text,
        }),
      },
    );
    const out = await res.json().catch(() => ({}));
    if (!res.ok || !out.success) {
      status = 'failed';
      errMsg = JSON.stringify(out.errors || out).slice(0, 300);
    } else {
      const r = out.result || {};
      const bounced = Array.isArray(r.permanent_bounces) ? r.permanent_bounces : [];
      const queued = Array.isArray(r.queued) ? r.queued : [];
      const delivered = Array.isArray(r.delivered) ? r.delivered : [];
      if (bounced.length) {
        status = 'bounced';
        errMsg = `permanent bounce: ${JSON.stringify(bounced)}`.slice(0, 300);
      } else if (queued.length || !delivered.length) {
        status = 'pending';
      } else {
        status = 'delivered';
      }
    }
  } catch (e) {
    errMsg = (e && e.message ? e.message : String(e)).slice(0, 300);
  }

  try {
    await env.DB.prepare(`UPDATE leads SET email_status = ?, email_error = ? WHERE id = ?`)
      .bind(status, errMsg, leadId)
      .run();
  } catch {
    /* status update failure never affects the saved lead */
  }
}

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
}

export { verifyTurnstile };
