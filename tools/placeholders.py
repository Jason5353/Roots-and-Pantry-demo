#!/usr/bin/env python3
"""Writes illustrated SVG placeholders for the demo photos, recipe photos and people.
They are swapped for the AI-generated photos later (see README)."""
import pathlib, json

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'

def photo_svg(emoji, c1, c2, w=1200, h=900, label='Photo coming soon'):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs>
<rect width="{w}" height="{h}" fill="url(#g)"/>
<circle cx="{w*.82:.0f}" cy="{h*.2:.0f}" r="{h*.3:.0f}" fill="#fff" opacity=".18"/>
<circle cx="{w*.15:.0f}" cy="{h*.88:.0f}" r="{h*.36:.0f}" fill="#fff" opacity=".12"/>
<text x="{w/2:.0f}" y="{h*.58:.0f}" font-size="{h*.38:.0f}" text-anchor="middle">{emoji}</text>
<text x="{w/2:.0f}" y="{h*.92:.0f}" font-family="Arial,sans-serif" font-size="{h*.04:.0f}" fill="#fff" opacity=".85" text-anchor="middle">{label}</text>
</svg>"""

PHOTOS = {
 'bbq-dave-sam': ('🔥', '#FFD6A5', '#E76F51'), 'jam-tarts-nana-lily': ('🍓', '#FBD3DC', '#EC8BA0'),
 'lilys-birthday': ('🎂', '#F9D0E0', '#D978A3'), 'sunday-roast': ('🍽️', '#F6D7B0', '#E39A63'),
 'priya-curry-night': ('🍛', '#FFE1B0', '#D9822B'), 'sams-midnight-toastie': ('🥪', '#3B3F5C', '#1E2A4A'),
 'pancake-day': ('🥞', '#FFF0C9', '#E9B44C'), 'christmas-eve-ham': ('🎄', '#D5EBD7', '#5D9C6B'),
 'gingerbread-day': ('🍪', '#FFE7B3', '#E7A93B'), 'nana-at-the-hob': ('🥄', '#F3E6F7', '#B98BD6'),
 'pizza-night': ('🍕', '#FFD9A8', '#F08A5D'), 'hillside-picnic': ('🧺', '#DDEBD5', '#6A994E'),
 'farmers-market': ('🧀', '#FFF0C2', '#F2C14E'), 'washing-up': ('🫧', '#DCEBFA', '#7FA7D9'),
 'scones-out-the-oven': ('🧁', '#FFF0C2', '#E9C27A'), 'marshmallow-campfire': ('🔥', '#3D2C4F', '#E07A3F'),
}
FOOD = {
 'roast-beef-yorkshires': ('🥩', '#F6D7B0', '#E39A63'), 'honey-mustard-sausage-traybake': ('🌭', '#FAD9C9', '#E58E6B'),
 'christmas-cheese-scones': ('🧀', '#FFF0C2', '#F2C14E'), 'lilys-jam-tarts': ('🍓', '#FBD3DC', '#EC8BA0'),
 'sams-midnight-cheese-toastie': ('🥪', '#FFE6A6', '#E8B33E'), 'bread-butter-pudding': ('🍮', '#F5E2CB', '#D9A26C'),
 'leek-potato-soup': ('🥣', '#DCEFD3', '#8DBF78'), 'honey-glazed-christmas-ham': ('🍖', '#F8D3C8', '#D97C66'),
 'victoria-sponge': ('🍰', '#FCE4EC', '#F2A7BD'),
}
PEOPLE = {
 'nana-mags': dict(bg='#F3E6F7', skin='#F1C9A5', hair='#D9D9D9', style='curly', shirt='#8A4FBF', glasses=True),
 'dave': dict(bg='#DDE7F7', skin='#E8B98F', hair='#5A3B25', style='short', shirt='#1E2A4A'),
 'priya': dict(bg='#E2F2E8', skin='#B47B57', hair='#1E1612', style='long', shirt='#1F7A4D'),
 'sam': dict(bg='#E3ECFF', skin='#C99470', hair='#2C1E15', style='short', shirt='#2F6FDB'),
 'lily': dict(bg='#FFF0C2', skin='#C99470', hair='#2C1E15', style='pigtails', shirt='#E0301E'),
}

def face(a):
    hair, s = a['hair'], a['style']
    top = f'<path d="M15 33 C15 18 49 18 49 33 C45 26 38 23 32 23 C26 23 19 26 15 33Z" fill="{hair}"/>'
    hs = {'short': top,
          'long': f'<rect x="13" y="28" width="8" height="24" rx="4" fill="{hair}"/><rect x="43" y="28" width="8" height="24" rx="4" fill="{hair}"/>' + top,
          'pigtails': top + f'<circle cx="13" cy="38" r="5.5" fill="{hair}"/><circle cx="51" cy="38" r="5.5" fill="{hair}"/>',
          'curly': ''.join(f'<circle cx="{x}" cy="{y}" r="6" fill="{hair}"/>' for x, y in [(18,28),(24,22),(32,20),(40,22),(46,28),(16,35),(48,35)])}[s]
    gl = '<g fill="none" stroke="#3b3b3b" stroke-width="1.5"><circle cx="26" cy="35" r="4.2"/><circle cx="38" cy="35" r="4.2"/><path d="M30.2 35h3.6"/></g>' if a.get('glasses') else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="400" height="400"><rect width="64" height="64" fill="{a["bg"]}"/>'
            f'<ellipse cx="32" cy="66" rx="24" ry="16" fill="{a["shirt"]}"/><rect x="28" y="44" width="8" height="8" fill="{a["skin"]}"/>'
            f'<circle cx="32" cy="35" r="15" fill="{a["skin"]}"/>{hs}<circle cx="26" cy="35" r="1.8" fill="#2b2b2b"/><circle cx="38" cy="35" r="1.8" fill="#2b2b2b"/>{gl}'
            f'<path d="M26.5 41 Q32 45.5 37.5 41" stroke="#7a3b2e" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>')

snaps = {s['file'].split('/')[-1].rsplit('.', 1)[0]: s for s in json.loads((ROOT / 'src/data/snapshots.json').read_text())}
for k, (e, c1, c2) in PHOTOS.items():
    s = snaps.get(k, {'w': 1200, 'h': 900})
    (PUB / 'photos' / f'{k}.svg').write_text(photo_svg(e, c1, c2, s['w'], s['h']))
for k, (e, c1, c2) in FOOD.items():
    (PUB / 'recipe-images' / f'{k}.svg').write_text(photo_svg(e, c1, c2))
for k, a in PEOPLE.items():
    (PUB / 'people' / f'{k}.svg').write_text(face(a))
print('placeholders written')
