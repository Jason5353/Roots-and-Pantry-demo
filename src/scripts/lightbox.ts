// Click-to-zoom "lightbox": a photo grows out of where it sits to the middle of the screen,
// the page dims, and any click (or Esc) sends it back to its place.
// Works on every polaroid (.snap) and the big photo on recipe pages (.rhead .big).

const SELECTOR = '.snap, .rhead .big';
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
let open: null | { orig: HTMLElement; clone: HTMLElement; back: HTMLElement; start: string } = null;

function zoom(orig: HTMLElement) {
  const rect = orig.getBoundingClientRect(); // includes any tilt
  const w = orig.offsetWidth, h = orig.offsetHeight; // untilted size
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  const start = getComputedStyle(orig).transform === 'none' ? '' : getComputedStyle(orig).transform;

  const back = document.createElement('div');
  back.className = 'lb-back';
  const clone = orig.cloneNode(true) as HTMLElement;
  clone.classList.add('lb-photo');
  clone.removeAttribute('aria-hidden');
  Object.assign(clone.style, { left: `${cx - w / 2}px`, top: `${cy - h / 2}px`, width: `${w}px`, height: `${h}px`, transform: start, translate: 'none', animation: 'none', margin: '0' });
  clone.querySelectorAll('img').forEach((i) => (i.loading = 'eager'));
  document.body.append(back, clone);
  orig.style.visibility = 'hidden';
  document.body.classList.add('lb-open');

  // Target: centred, as big as fits in ~88% of the screen, straightened.
  const s = Math.min((innerWidth * 0.88) / w, (innerHeight * 0.88) / h, 4);
  const dx = innerWidth / 2 - cx, dy = innerHeight / 2 - cy;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    back.classList.add('on');
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
  }));
  open = { orig, clone, back, start };
}

function close() {
  if (!open) return;
  const { orig, clone, back, start } = open;
  open = null;
  back.classList.remove('on');
  clone.style.transform = start || 'none';
  const done = () => { clone.remove(); back.remove(); orig.style.visibility = ''; document.body.classList.remove('lb-open'); };
  if (calm) done(); else { clone.addEventListener('transitionend', done, { once: true }); setTimeout(done, 600); }
}

document.addEventListener('click', (e) => {
  if (open) { e.preventDefault(); e.stopPropagation(); close(); return; }
  const el = (e.target as HTMLElement).closest<HTMLElement>(SELECTOR);
  if (!el || el.closest('a, button, label')) return; // photos inside links keep working as links
  e.preventDefault();
  zoom(el);
}, true);
document.addEventListener('keydown', (e) => { if (open && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); close(); } });
addEventListener('resize', close);
addEventListener('scroll', () => { if (open) close(); }, { passive: true });
