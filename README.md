# Ajay Makwana — Portfolio

3D portfolio for **Ajay Makwana**: After Effects video editor, motion designer, content creator and developer.

## What's inside

| Path | What it is |
|---|---|
| `index.html` | Portfolio. Three.js 3D hero (a phone playing my reel, orbiting timeline clips, neon rings, stars), showreel with 3D tilt cards and a video player, live store mockups, 3D skills sphere, journey timeline, contact. |
| `store/` | **Voltix**, a Shopify-style demo store for mobiles and laptops: collections, filters, sorting, search, quick view with colour + variant pricing, cart drawer with free-delivery meter, deal countdown and a demo checkout. |
| `assets/video/` | My After Effects edits (web-compressed). |
| `assets/js/vendor/` | Three.js r160 (bundled locally, no CDN needed). |

No build step: it is plain HTML, CSS and JavaScript.

## Put it online (GitHub Pages, free)

1. Open the repo on GitHub → **Settings** → **Pages**.
2. Under *Build and deployment*, choose **Deploy from a branch**.
3. Pick the branch (`main` after merging) and the `/ (root)` folder, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/portfolio-/`, and the store at `…/portfolio-/store/`.

## Run it on your computer

The 3D scene uses ES modules, so open it through a local server, not by double-clicking the file:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Edit things

- **Videos:** replace files in `assets/video/` (vertical 9:16 MP4) and posters in `assets/img/`.
- **Hero phone video:** change `reel-transition.mp4` in `assets/js/main.js`.
- **Store products:** edit the `products` list in `store/store.js` (name, price, colours, variants, specs).
