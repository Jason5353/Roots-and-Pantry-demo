#!/usr/bin/env python3
"""Swap the SVG placeholders for real photos.
Usage: python3 tools/add-photos.py demo-photos.zip   (or a folder)
Needs Pillow:  pip install pillow
- Snapshots  -> public/photos/<name>.webp        (max 1200 px wide/tall)
- Food       -> public/recipe-images/<name>.webp (1600 x 1200, cropped 4:3)
- ref-<name> -> public/people/<name>.webp        (400 x 400, cropped square)
Metadata (EXIF/GPS) is dropped because only the pixels are re-saved.
"""
import sys, json, re, zipfile, tempfile, pathlib
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = pathlib.Path(sys.argv[1])
tmp = pathlib.Path(tempfile.mkdtemp())
if src.suffix == '.zip':
    zipfile.ZipFile(src).extractall(tmp); src = tmp
files = [p for p in src.rglob('*') if p.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp') and not p.name.startswith('.')]
snaps = json.loads((ROOT / 'src/data/snapshots.json').read_text())
snap_names = {s['file'].split('/')[-1].rsplit('.', 1)[0] for s in snaps}
food_names = {p.stem for p in (ROOT / 'src/content/recipes').glob('*.md')}

def crop(img, ratio, top=0.5):
    """Crop to ratio. `top` = where to cut vertically (0 = keep the top, 0.5 = centre)."""
    w, h = img.size
    if w / h > ratio: nw = int(h * ratio); return img.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    nh = int(w / ratio); y = int((h - nh) * top); return img.crop((0, y, w, y + nh))

done = []
for f in files:
    name = re.sub(r'[^a-z0-9-]', '', f.stem.lower().replace(' ', '-').replace('_', '-'))
    img = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
    if name.startswith('ref-'):
        who = name[4:]; out = ROOT / f'public/people/{who}.webp'
        crop(img, 1).resize((400, 400), Image.LANCZOS).save(out, 'WEBP', quality=82)
        fam = ROOT / 'src/data/family.js'; fam.write_text(fam.read_text().replace(f'/people/{who}.svg', f'/people/{who}.webp'))
    elif name in food_names:
        out = ROOT / f'public/recipe-images/{name}.webp'
        crop(img, 4 / 3).resize((1600, 1200), Image.LANCZOS).save(out, 'WEBP', quality=80)
        md = ROOT / f'src/content/recipes/{name}.md'; md.write_text(md.read_text().replace(f'/recipe-images/{name}.svg', f'/recipe-images/{name}.webp'))
    elif name in snap_names:
        s = next(x for x in snaps if f'/{name}.' in x['file'])
        ratio = s['w'] / s['h']; img = crop(img, ratio, top=0.3)  # people: keep heads in
        k = min(1, 1200 / max(img.size)); img = img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
        out = ROOT / f'public/photos/{name}.webp'; img.save(out, 'WEBP', quality=80)
        s['file'] = f'/photos/{name}.webp'; s['w'], s['h'] = img.size
    else:
        print('skipped (name not recognised):', f.name); continue
    done.append(out.relative_to(ROOT))
(ROOT / 'src/data/snapshots.json').write_text(json.dumps(snaps, indent=2, ensure_ascii=False) + '\n')
print(f'{len(done)} photos added'); [print(' ', d) for d in done]
