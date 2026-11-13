# Roots & Pantry demo – context for Claude

Public demo of "Roots & Pantry" (working name): private family recipe books + exclusive codes from independent local food producers.
Owner: Jason (GitHub `Jason5353`). Separate from the private Lewis family site and from BMS Cyber Defence.

- Astro 7 static site, design copied from `Jason5353/lewis-family-recipes` (`src/styles/global.css` unchanged; additions in `src/styles/extra.css`).
- All content fictional: Hartley family (`src/data/family.js`), producers + codes (`src/data/producers.js`), recipes (`src/content/recipes/*.md`), snapshots (`src/data/snapshots.json`).
- No backend. Demo state (who's signed in, favourites, shopping list, taps, family settings) is in localStorage via `src/scripts/store.ts`; `src/scripts/demo.ts` runs on every page.
- Deal matching: producer `kw` words matched as whole words against ingredient lines (`dealFor` in producers.js and store.ts – keep the two in step).
- Free for families and producers for now. Producers can leave a voluntary one-off £5 thank-you (Revolut link + `public/tip-qr.png`, producers page `#tip`).
- Sponsored spotlight is shelved (13 Nov 2026) until the concept is proven: `src/components/Spotlight.astro` + `spotlight` lines in producers.js are kept but not used on any page.
- Under-13 accounts: `body[data-age=child]` hides everything with class `deal-only`. Non-admins: `.admin-only` is disabled.
- Photos: AI-generated (first 19 in 13 Nov 2026; remaining snapshots still SVG placeholders). Strips/collage use only real photos once ≥8 exist (`pool` in lib.ts); food photos double as snapshots. `tools/add-photos.py <zip>` converts to WebP, strips EXIF, rewrites references.
- Hosted on Cloudflare Pages (Git-connected, branch `main`, public, noindex). Push to `main` deploys in ~1 minute.
- Add/Edit page (`src/pages/add.astro`) is the family site's form (with `importer/manual.js` and `/recipes/<id>.json`); saving is replaced by a demo message.
- Run `npm run build` before pushing. Footer must keep the "Photos are AI-generated and the family is fictional" notice.
