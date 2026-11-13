import family from './data/family.js';
import snapshots from './data/snapshots.json';

export type Snapshot = (typeof snapshots)[number];
export type Person = (typeof family.people)[number];
export { family, snapshots };

export function person(name: string): Person {
  const p = family.people.find((x) => x.name.toLowerCase() === name.toLowerCase());
  return p ?? ({ name, full: name, initials: name.slice(0, 2), colour: '#56607A', role: 'member', age: 'adult', photo: '' } as Person);
}

// Stable pseudo-random pick so each page shows different snapshots but the same ones every build.
function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
// Real photos only, once there are enough of them; the SVG placeholders fill in until then.
const real = snapshots.filter((s) => !s.file.endsWith('.svg'));
export const pool = real.length >= 8 ? real : snapshots;
export function pickSnapshots(seed: string, n: number): Snapshot[] {
  const start = hash(seed) % pool.length;
  // Step must share no factor with the pool size, or the picks loop round a few photos.
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const step = [7, 5, 3, 11, 13, 1].find((k) => gcd(k, pool.length) === 1)!;
  const out: Snapshot[] = [];
  for (let i = 0; out.length < Math.min(n, pool.length) && i < pool.length * 2; i++) {
    const s = pool[(start + i * step) % pool.length];
    if (!out.includes(s)) out.push(s);
  }
  return out;
}
export const snapshot = (slug: string) => snapshots.find((s) => s.file.includes(slug))!;

export function mins(m?: number) {
  if (!m) return '';
  const h = Math.floor(m / 60), r = m % 60;
  return h ? `${h} hr${r ? ` ${r} min` : ''}` : `${r} min`;
}
