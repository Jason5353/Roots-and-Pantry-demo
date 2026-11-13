// Fictional local producers and dummy discount codes, for the demo only.
// In the real service these are independent producers who have agreed their offer and code.
// `kw` = ingredient words that trigger the deal tag (matched as whole words, plurals allowed).
export const producers = [
  { id: 'little-wren', name: 'Little Wren Apiary', county: 'Shropshire', where: 'Near the Wrekin, Shropshire',
    what: 'Raw local honey and honeycomb', offer: '10% off all honey', code: 'FAMILY10', icon: '🍯', colour: '#FFE9A8',
    kw: ['honey', 'honeycomb'], base: [412, 63, 41],
    spotlight: 'New season honey from hives on the slopes of the Wrekin. Lovely on toast, even better in a honey-mustard glaze.' },
  { id: 'hollybrook', name: 'Hollybrook Farm Dairy', county: 'Shropshire', where: 'North Shropshire',
    what: 'Farmhouse cheese, butter and cream', offer: '15% off dairy boxes', code: 'HOLLY15', icon: '🧀', colour: '#FFF4D1',
    kw: ['cheese', 'cheddar', 'butter', 'cream', 'milk'], base: [388, 52, 37] },
  { id: 'oakmere', name: 'Oakmere Family Butchers', county: 'Shropshire', where: 'South Shropshire',
    what: 'Free-range pork, beef, gammon and sausages', offer: 'Free delivery over £30', code: 'OAKMERE', icon: '🥩', colour: '#FBD9D3',
    kw: ['sausage', 'beef', 'gammon', 'pork', 'bacon', 'lamb'], base: [350, 47, 30],
    spotlight: 'Christmas gammons and free-range turkeys are now taking orders. Reserve yours and collect from the shop or have it delivered.' },
  { id: 'millstone', name: 'Millstone Bakehouse & Mill', county: 'Shropshire', where: 'East Shropshire',
    what: 'Stoneground flour and sourdough', offer: '£3 off flour bundles', code: 'MILL3', icon: '🌾', colour: '#F1E7D6',
    kw: ['flour', 'sourdough', 'bread'], base: [290, 31, 22] },
  { id: 'bramblewood', name: 'Bramblewood Preserves', county: 'Shropshire', where: 'Shropshire Hills',
    what: 'Jams, marmalade and chutney', offer: '3 jars for the price of 2', code: 'BRAMBLE3', icon: '🫙', colour: '#F8D7E0',
    kw: ['jam', 'marmalade', 'chutney'], base: [275, 38, 26],
    spotlight: 'Small-batch jams and chutneys made in the Shropshire Hills. The spiced plum chutney is made for a Christmas cheeseboard.' },
  { id: 'greenacre', name: 'Greenacre Cold-Pressed', county: 'Shropshire', where: 'Near Bridgnorth',
    what: 'Cold-pressed rapeseed oil', offer: '10% off your first order', code: 'GREEN10', icon: '🌼', colour: '#FFF3B0',
    kw: ['rapeseed oil'], base: [198, 19, 12] },
  { id: 'valley-orchard', name: 'Valley Orchard Co.', county: 'Herefordshire', where: 'Golden Valley, Herefordshire',
    what: 'Apples, apple juice and cider vinegar', offer: '10% off juice cases', code: 'ORCHARD10', icon: '🍎', colour: '#E2F2D5',
    kw: ['apple', 'cider vinegar'], base: [120, 14, 9] },
  { id: 'moorland', name: 'Moorland Oatcake Co.', county: 'Staffordshire', where: 'Staffordshire Moorlands',
    what: 'Oatcakes and porridge oats', offer: '6 oatcakes free with any order', code: 'MOOR6', icon: '🥞', colour: '#EFE6D6',
    kw: ['oats', 'oatcake'], base: [96, 9, 5] },
];

export const neighbours = {
  Shropshire: ['Herefordshire', 'Staffordshire', 'Cheshire', 'Worcestershire', 'Powys'],
  Herefordshire: ['Shropshire', 'Worcestershire', 'Gloucestershire', 'Powys'],
  Staffordshire: ['Shropshire', 'Cheshire', 'Derbyshire', 'West Midlands'],
};
export const counties = ['Shropshire', 'Herefordshire', 'Staffordshire', 'Cheshire', 'Worcestershire', 'Powys', 'Derbyshire', 'Gloucestershire', 'West Midlands'];

/** Producers a family in `county` can see (optionally including neighbouring counties). */
export function producersFor(county = 'Shropshire', nearby = false) {
  const ok = [county, ...(nearby ? neighbours[county] ?? [] : [])];
  return producers.filter((p) => ok.includes(p.county));
}

/** The first producer whose keywords appear in an ingredient line, or null. */
export function dealFor(text, list = producersFor()) {
  if (!text || text.startsWith('# ')) return null;
  for (const p of list) {
    for (const k of p.kw) {
      if (new RegExp(`\\b${k.replace(/ /g, '\\s+')}(e?s)?\\b`, 'i').test(text)) return p;
    }
  }
  return null;
}
