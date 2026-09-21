/**
 * Header / drawer behaviour. Imported once from BaseLayout.
 */
function initChrome(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const drawer = document.querySelector<HTMLElement>('#mobile-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    drawer.hidden = open;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChrome);
} else {
  initChrome();
}
