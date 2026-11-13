// Runs on every page: who's signed in, favourites, shopping-list count, deal pop-ups, codes and taps.
import { load, update, save, me, allPeople, producers, tap, avatarHTML, dealCardHTML, toast, esc } from './store';

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s);
const $$ = <T extends HTMLElement = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

function applyAll() {
  const s = load();
  const u = me(s);
  document.body.dataset.age = u.age;
  document.body.dataset.role = u.role;
  const av = $('#whoav'); if (av) av.innerHTML = avatarHTML(u, s);
  const nm = $('#whoname'); if (nm) nm.textContent = u.name;
  // Family name + colour chosen on the Family page.
  if (s.familyName) $$('[data-family-name]').forEach((el) => (el.textContent = s.familyName!));
  if (s.colour) document.documentElement.style.setProperty('--pepper', s.colour);
  // Photos uploaded on the Family page replace everyone's avatars.
  Object.entries(s.photos).forEach(([name, src]) => {
    $$(`.av[data-person="${CSS.escape(name)}"]`).forEach((el) => {
      el.classList.add('ph'); el.innerHTML = `<img src="${src}" alt="">`;
    });
  });
  // Favourites for this person.
  const favs = s.favs[u.name] ?? [];
  $$('[data-fav]').forEach((b) => { const on = favs.includes(b.dataset.fav!); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '❤️' : '🤍'; });
  $$('[data-favbtn]').forEach((b) => { const on = favs.includes(b.dataset.favbtn!); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? '❤️ In your favourites' : '🤍 Add to favourites'; });
  // Shopping-list count.
  const n = s.list.filter((i) => !i.done).length;
  $$('[data-list-count]').forEach((el) => { el.textContent = n ? String(n) : ''; el.dataset.n = String(n); });
  $$('[data-login]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.login === u.name)));
}

function openDeal(id: string) {
  const p = producers.find((x) => x.id === id); if (!p) return;
  tap(p.id, 0);
  $('#dealtitle')!.textContent = 'Local deal';
  $('#dealbody')!.innerHTML = dealCardHTML(p) + `<p style="font-size:14px;margin-top:14px">Use the code on ${esc(p.name)}'s own online shop. We never share your family's details with producers.</p>`;
  $<HTMLDialogElement>('#dealdlg')!.showModal();
}
function openShop(id: string) {
  const p = producers.find((x) => x.id === id); if (!p) return;
  tap(p.id, 1);
  $('#dealtitle')!.textContent = `${p.icon} ${p.name}`;
  $('#dealbody')!.innerHTML = `<p>In the live service this opens <b>${esc(p.name)}'s own online shop</b> in a new tab, ready for you to use the code <span class="code">${esc(p.code)}</span> at checkout.</p>
    <p style="font-size:14px">${esc(p.name)} is a fictional producer for this demo, so there's no shop to visit. Your tap has been counted on the <a href="/producers/#dash">producer dashboard</a>.</p>
    <p><button type="button" class="btn btn-green sm" data-copy="${p.id}">Copy code</button></p>`;
  const d = $<HTMLDialogElement>('#dealdlg')!; if (!d.open) d.showModal();
}
async function copyCode(id: string) {
  const p = producers.find((x) => x.id === id); if (!p) return;
  tap(p.id, 2);
  try { await navigator.clipboard.writeText(p.code); toast(`Code ${p.code} copied`); } catch { toast(`Your code is ${p.code}`); }
}

document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const el = t.closest<HTMLElement>('[data-fav],[data-favbtn],[data-deal],[data-shop],[data-copy],[data-login],[data-close],#whobtn,[data-addlist],[data-reset]');
  if (!el) {
    if (t instanceof HTMLDialogElement) t.close(); // click on the backdrop
    return;
  }
  if (el.id === 'whobtn') { $<HTMLDialogElement>('#whodlg')!.showModal(); return; }
  if (el.dataset.close !== undefined) { el.closest('dialog')?.close(); return; }
  if (el.dataset.login) {
    update((s) => { s.who = el.dataset.login!; });
    el.closest('dialog')?.close();
    const u = me(); toast(`You're now ${u.name}${u.age === 'child' ? ' (child account: no deals or adverts)' : ''}`);
    return;
  }
  const favId = el.dataset.fav ?? el.dataset.favbtn;
  if (favId) {
    let added = false;
    update((s) => { const l = (s.favs[s.who] ??= []); const i = l.indexOf(favId); if (i >= 0) l.splice(i, 1); else { l.push(favId); added = true; } });
    toast(added ? 'Added to your favourites' : 'Removed from your favourites');
    return;
  }
  if (el.dataset.deal) { openDeal(el.dataset.deal); return; }
  if (el.dataset.shop) { openShop(el.dataset.shop); return; }
  if (el.dataset.copy) { copyCode(el.dataset.copy); return; }
  if (el.dataset.addlist) {
    const lines = $$('[data-ing]').map((x) => x.textContent!.trim()).filter((x) => x && !/to taste|to serve/i.test(x));
    update((s) => {
      lines.forEach((text, i) => s.list.push({ id: `${Date.now().toString(36)}${i}`, text, by: s.who, from: el.dataset.addlist, fromTitle: el.dataset.title, done: false }));
    });
    toast(`${lines.length} items added to the shopping list`);
    setTimeout(() => location.assign('/list/'), 900);
    return;
  }
  if (el.dataset.reset !== undefined) {
    try { localStorage.removeItem('rp-demo-v1'); } catch {}
    toast('Demo reset'); setTimeout(() => location.reload(), 700);
  }
});

// Sponsored spotlight: show one booked producer per visit (rotation), and count it as shown.
document.querySelectorAll<HTMLElement>('[data-spotlights]').forEach((box) => {
  const spots = [...box.querySelectorAll<HTMLElement>('[data-spot]')];
  if (!spots.length) return;
  const pick = Math.floor(Math.random() * spots.length);
  spots.forEach((s, i) => (s.hidden = i !== pick));
  if (box.classList.contains('ad-only') && getComputedStyle(box).display !== 'none') tap(spots[pick].dataset.spot!, 0);
});

// Shrink the header once the page is scrolled a little.
const hdr = document.querySelector('header.site');
const onScroll = () => hdr?.classList.toggle('shrunk', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

document.addEventListener('demo:change', applyAll);
applyAll();
// Re-apply avatars when a page draws new ones (list, favourites, family).
new MutationObserver(() => {
  const s = load();
  if (!Object.keys(s.photos).length) return;
  Object.entries(s.photos).forEach(([name, src]) => {
    $$(`.av[data-person="${CSS.escape(name)}"]:not(.ph)`).forEach((el) => { el.classList.add('ph'); el.innerHTML = `<img src="${src}" alt="">`; });
    $$(`.av[data-person="${CSS.escape(name)}"] img`).forEach((img) => { if ((img as HTMLImageElement).getAttribute('src') !== src) (img as HTMLImageElement).src = src; });
  });
}).observe(document.body, { childList: true, subtree: true });
export { allPeople, save };
