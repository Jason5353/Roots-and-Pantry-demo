# Roots & Pantry – demo site

A public demo of **Roots & Pantry**: a private family recipe book, with exclusive discount codes from independent local food producers.
Built from the same design as the Lewis family recipe site (Astro, static).

**Everything here is fictional:** the Hartley family, their recipes, the producers and the discount codes.

## What it shows
- Family recipe book: home page, recipe pages with a servings scaler, category and "added by" filters.
- **Favourites** for each person.
- **Shared shopping list**, grouped by recipe, with matching local deals.
- **Local deals**: green deal tags on matching ingredients, deal cards with a code, Copy and Shop now buttons, and a county / neighbouring-counties filter.
- **Family settings**: family name, colour, categories, profile photos, invites, child accounts.
- **Roles**: switch person with the avatar button (top right). Admins (Nana Mags, Dave) can change settings. Lily (under 13) sees no deals or adverts and can't delete.
- **For producers** page with a demo dashboard (sample numbers plus taps made in your browser).

Changes made in the demo are saved only in the visitor's own browser (localStorage). "Reset the demo" is on the Family page.

## Hosting (Cloudflare Pages)
Workers & Pages → Create → Pages → Connect to Git → `Roots-and-Pantry-demo` → Framework preset **Astro** (build `npm run build`, output `dist`) → Save and Deploy.
No Cloudflare Access/Zero Trust rule: the demo is meant to be shared by link. `noindex` headers keep it out of search engines.

## Photos
Placeholders live in `public/photos`, `public/recipe-images` and `public/people` (SVG). To swap in real/AI photos:
```
python3 tools/add-photos.py path/to/demo-photos.zip
```
It resizes, strips metadata (EXIF/GPS), saves WebP and updates the references. File names must match the prompt pack (e.g. `bbq-dave-sam`, `roast-beef-yorkshires`, `ref-dave`).

## Run locally
```
npm install
npm run dev
```
