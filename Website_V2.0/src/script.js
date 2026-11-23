(() => {
  'use strict';
  const root = document.documentElement;
  const menu = document.querySelector('.menu-button');
  const navigation = document.getElementById('navigation');
  const motionAllowed = window.matchMedia?.('(prefers-reduced-motion: no-preference)').matches;
  if (motionAllowed) root.classList.add('motion');

  if (menu && navigation) {
    root.classList.add('js');
    const menuOpen = () => menu.getAttribute('aria-expanded') === 'true';
    const setMenu = (open, focusMenu = false) => {
      menu.setAttribute('aria-expanded', String(open));
      navigation.dataset.open = String(open);
      if (focusMenu) menu.focus();
    };
    menu.addEventListener('click', () => setMenu(!menuOpen()));
    navigation.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link || !menuOpen()) return;
      setMenu(false);
      if (link.hash) document.getElementById(link.hash.slice(1))?.focus({ preventScroll: true });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuOpen()) setMenu(false, true);
    });
    document.addEventListener('click', event => {
      if (menuOpen() && !event.target.closest('.site-header')) setMenu(false);
    });
    window.matchMedia?.('(min-width: 761px)').addEventListener?.('change', event => {
      if (event.matches && menuOpen()) setMenu(false);
    });
  }

  if (!('IntersectionObserver' in window)) return;
  const links = [...document.querySelectorAll('.navigation a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  const visible = new Map();
  const revealed = new WeakSet();
  // One observer serves the reading indicator and one-time section entrances.
  // Sections stay visible before JavaScript, before intersection, and on failure.
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      visible.set(entry.target, entry.isIntersecting);
      if (entry.isIntersecting && motionAllowed && !revealed.has(entry.target)) {
        entry.target.classList.add('has-entered');
        revealed.add(entry.target);
      }
    }
    const active = sections.find(section => visible.get(section));
    for (const link of links) {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, { rootMargin: '-10% 0px -18% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
})();
