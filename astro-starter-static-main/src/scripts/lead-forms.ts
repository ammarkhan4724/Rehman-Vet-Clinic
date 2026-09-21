/*
 * Lead form capture + Turnstile.
 *
 * Intercepts any <form data-lead-form>, POSTs to /api/lead, and shows inline
 * success/error without navigating away. Imported once from BaseLayout so a
 * page cannot acquire a lead form without also acquiring the handler.
 *
 * Turnstile: wait for the widget token before posting. An early click with an
 * empty token is rejected server-side as "challenge missing".
 */

function setMsg(form: HTMLFormElement, text: string, ok: boolean): void {
  let el = form.querySelector<HTMLElement>('[data-lead-msg]');
  if (!el) {
    el = document.createElement('p');
    el.setAttribute('data-lead-msg', '');
    el.className = 'form-msg';
    form.appendChild(el);
  }
  el.textContent = text;
  el.dataset.ok = ok ? 'true' : 'false';
}

function waitForTurnstileToken(form: HTMLFormElement, timeoutMs: number): Promise<string> {
  const read = () =>
    form.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value ?? '';
  const existing = read();
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve) => {
    let elapsed = 0;
    const step = 200;
    const iv = window.setInterval(() => {
      const value = read();
      if (value) {
        window.clearInterval(iv);
        resolve(value);
        return;
      }
      elapsed += step;
      if (elapsed >= timeoutMs) {
        window.clearInterval(iv);
        resolve('');
      }
    }, step);
  });
}

async function submit(form: HTMLFormElement, event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"], button:not([type])');
  const original = btn ? btn.textContent : null;
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending…';
  }

  if (form.querySelector('.cf-turnstile')) {
    if (btn) btn.textContent = 'Verifying…';
    const token = await waitForTurnstileToken(form, 15000);
    if (!token) {
      setMsg(form, "We couldn't complete the spam check. Please refresh and try again.", false);
      if (btn) {
        btn.disabled = false;
        btn.textContent = original || 'Send';
      }
      return;
    }
    if (btn) btn.textContent = 'Sending…';
  }

  const data = new FormData(form);
  data.set('_form', form.getAttribute('data-lead-form') ?? '');
  data.set('_path', location.pathname);

  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
    });
    let out: { ok?: boolean; message?: string; error?: string; errors?: Record<string, string> } = {};
    try {
      out = await res.json();
    } catch {
      /* non-JSON body is a generic failure below */
    }

    if (res.ok && out.ok) {
      form.reset();
      const turnstile = (window as unknown as { turnstile?: { reset: () => void } }).turnstile;
      if (turnstile?.reset) turnstile.reset();
      if (btn) btn.textContent = 'Sent ✓';
      setMsg(form, out.message || "Thank you — we've received your message.", true);
      return;
    }
    if (out.errors) {
      setMsg(form, 'Please check the highlighted fields and try again.', false);
    } else {
      setMsg(form, out.error || 'Sorry, something went wrong. Please try again.', false);
    }
  } catch {
    setMsg(form, 'Network error. Please try again or email us directly.', false);
  }

  if (btn) {
    btn.disabled = false;
    btn.textContent = original || 'Send';
  }
}

function initLeadForms(): void {
  for (const form of document.querySelectorAll<HTMLFormElement>('form[data-lead-form]')) {
    form.addEventListener('submit', (event) => submit(form, event as SubmitEvent));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLeadForms);
} else {
  initLeadForms();
}
