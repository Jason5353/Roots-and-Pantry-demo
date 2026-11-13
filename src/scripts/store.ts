// Demo state, kept in this browser only (localStorage). In the real service this lives in the database.
export type Item = { id: string; text: string; by: string; from?: string; fromTitle?: string; done: boolean };
export type Producer = { id: string; name: string; county: string; offer: string; code: string; icon: string; colour: string; where: string; kw: string[]; base: number[] };
export type Person = { name: string; full: string; initials: string; colour: string; role: string; age: string; photo: string; managedBy?: string; creator?: boolean };
export type State = {
  who: string;
  favs: Record<string, string[]>;
  list: Item[];
  taps: Record<string, number[]>; // [shown, shop taps, code copies]
  familyName?: string;
  colour?: string;
  county?: string;
  nearby?: boolean;
  categories?: string[];
  photos: Record<string, string>;
  extraPeople: Person[];
};

const KEY = 'rp-demo-v1';
const data = JSON.parse(document.getElementById('demo-data')?.textContent || '{}');
export const people: Person[] = data.people ?? [];
export const producers: Producer[] = data.producers ?? [];
export const homeCounty: string = data.county ?? 'Shropshire';

const seed = (): State => ({
  who: 'Dave',
  favs: { 'Nana Mags': ['bread-butter-pudding'], Dave: ['honey-mustard-sausage-traybake', 'honey-glazed-christmas-ham'], Priya: ['christmas-cheese-scones'], Sam: ['sams-midnight-cheese-toastie'], Lily: ['lilys-jam-tarts'] },
  list: [
    { id: 'a1', text: '8 pork sausages', by: 'Dave', from: 'honey-mustard-sausage-traybake', fromTitle: 'Honey & Mustard Sausage Traybake', done: false },
    { id: 'a2', text: '2 tbsp runny honey', by: 'Dave', from: 'honey-mustard-sausage-traybake', fromTitle: 'Honey & Mustard Sausage Traybake', done: false },
    { id: 'a3', text: '1 tbsp wholegrain mustard', by: 'Dave', from: 'honey-mustard-sausage-traybake', fromTitle: 'Honey & Mustard Sausage Traybake', done: false },
    { id: 'a4', text: '100 g mature cheddar cheese', by: 'Priya', from: 'christmas-cheese-scones', fromTitle: 'Christmas Cheese Scones', done: false },
    { id: 'a5', text: '225 g self-raising flour', by: 'Priya', from: 'christmas-cheese-scones', fromTitle: 'Christmas Cheese Scones', done: false },
    { id: 'a6', text: 'Milk (2 pints)', by: 'Nana Mags', done: true },
    { id: 'a7', text: 'Tea bags', by: 'Nana Mags', done: false },
  ],
  taps: {},
  photos: {},
  extraPeople: [],
});

export function load(): State {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && s.list) return { ...seed(), ...s };
  } catch {}
  return seed();
}
export function save(s: State) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  document.dispatchEvent(new CustomEvent('demo:change'));
}
export function update(fn: (s: State) => void) { const s = load(); fn(s); save(s); return s; }
export function reset() { try { localStorage.removeItem(KEY); } catch {} document.dispatchEvent(new CustomEvent('demo:change')); }

export const allPeople = (s = load()) => people.concat(s.extraPeople ?? []);
export const me = (s = load()) => allPeople(s).find((p) => p.name === s.who) ?? people[1];

const NEIGHBOURS: Record<string, string[]> = {
  Shropshire: ['Herefordshire', 'Staffordshire', 'Cheshire', 'Worcestershire', 'Powys'],
  Herefordshire: ['Shropshire', 'Worcestershire', 'Gloucestershire', 'Powys'],
  Staffordshire: ['Shropshire', 'Cheshire', 'Derbyshire', 'West Midlands'],
};
export function visibleProducers(s = load()) {
  const c = s.county ?? homeCounty;
  const ok = [c, ...(s.nearby ? NEIGHBOURS[c] ?? [] : [])];
  return producers.filter((p) => ok.includes(p.county));
}
export function dealFor(text: string, list = visibleProducers()) {
  if (!text || text.startsWith('# ')) return null;
  for (const p of list) for (const k of p.kw) {
    if (new RegExp(`\\b${k.replace(/ /g, '\\s+')}(e?s)?\\b`, 'i').test(text)) return p;
  }
  return null;
}
// Counts for the producer dashboard. Saved quietly (no redraw) so drawing a page can count views.
export function tap(id: string, i: 0 | 1 | 2) {
  const s = load(); const t = (s.taps[id] ??= [0, 0, 0]); t[i]++;
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export const esc = (s: string) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export function avatarHTML(p: Person, s = load()) {
  const photo = s.photos[p.name] || p.photo;
  return photo
    ? `<span class="av ph" style="background:${p.colour}" data-person="${esc(p.name)}"><img src="${esc(photo)}" alt=""></span>`
    : `<span class="av" style="background:${p.colour}" data-person="${esc(p.name)}">${esc(p.initials)}</span>`;
}
export function dealTagHTML(p: Producer | null) {
  return p ? `<button type="button" class="dealtag deal-only" data-deal="${p.id}">🏷️ ${esc(p.offer)} · ${esc(p.name)}</button>` : '';
}
export function dealCardHTML(p: Producer, uses = '') {
  return `<div class="deal deal-only"><div class="top"><span class="logo2" style="background:${p.colour}">${p.icon}</span><div><h3>${esc(p.name)}</h3><div class="where">${esc(p.where)}</div></div></div>
  <div class="offer">${esc(p.offer)}</div>
  <div class="codebox"><span class="code">${esc(p.code)}</span><button type="button" class="btn btn-ghost sm" data-copy="${p.id}">Copy</button><button type="button" class="btn btn-green sm" data-shop="${p.id}">Shop now ↗</button></div>
  ${uses ? `<div class="uses">${uses}</div>` : ''}</div>`;
}
export function toast(msg: string) {
  const t = document.getElementById('toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout((toast as any)._t); (toast as any)._t = setTimeout(() => t.classList.remove('show'), 2400);
}
