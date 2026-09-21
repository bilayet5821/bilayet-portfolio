const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const links = [...nav.querySelectorAll('a')];
const sections = links.map(link => document.querySelector(link.hash));
const mobile = window.matchMedia('(max-width: 720px)');

function closeMenu(returnFocus = false) {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) toggle.focus();
}

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
links.forEach(link => link.addEventListener('click', () => {
  if (mobile.matches) {
    const section = document.querySelector(link.hash);
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
    section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
  }
  closeMenu();
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
});
mobile.addEventListener('change', () => {
  if (!mobile.matches && document.activeElement === toggle) links[0].focus();
  closeMenu(mobile.matches && nav.contains(document.activeElement));
});
document.documentElement.classList.add('nav-ready');

// Maintain the current section even in the whitespace between entries.
let scheduled = false;
function updateActiveLink() {
  const threshold = document.querySelector('.site-header').getBoundingClientRect().height + 28;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) current = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = sections.at(-1);
  links.forEach(link => {
    const active = link.hash === `#${current.id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
function scheduleUpdate() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateActiveLink);
  }
}
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('load', scheduleUpdate);
updateActiveLink();
