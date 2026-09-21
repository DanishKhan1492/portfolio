# Muhammad Danish Khan · Portfolio

A hand-built, single-page portfolio site. No framework, no build step, plain HTML, CSS and
vanilla JavaScript, deployed statically with GitHub Pages.

**Live site:** https://danishkhan1492.github.io/portfolio/

---

## What's here

```
index.html                     the whole page
css/style.css                  design tokens, light/dark themes, layout, motion
js/main.js                     theme toggle, scroll progress, reveal + nav-spy, mobile menu
assets/resume-danish-khan.pdf  résumé (linked from the nav, hero and contact sections)
assets/favicon.svg             monogram favicon
assets/og.jpg                    social sharing card
404.html                       styled not-found page
.nojekyll                      tells Pages to skip Jekyll processing
robots.txt
.github/workflows/pages.yml    build + deploy pipeline
```

## Design notes

- **Type pairing**: Fraunces (variable serif) for display, Inter for body, JetBrains Mono for
  labels and metadata. All fall back to system serif/sans/mono if the webfonts don't load.
- **Palette**: warm paper and deep ink, with an emerald accent taken from the résumé heading
  and a brass secondary. Both light and dark themes are defined as CSS custom properties on
  `[data-theme]`; the toggle persists to `localStorage` and respects `prefers-color-scheme`
  on first visit.
- **Motion**: `IntersectionObserver` scroll reveals with per-sibling stagger, an animated
  hero gradient mesh plus film grain, a skills marquee that pauses on hover, and a scroll
  progress bar. Everything collapses under `prefers-reduced-motion: reduce`.
- **GitHub Pages safe**: every internal asset link is *relative* (`./css/...`, `./assets/...`),
  so the site works correctly under the `/portfolio/` project-page subpath as well as at a
  domain root.
- **Accessibility**: skip link, landmark regions, keyboard-operable menu, visible focus
  rings, `aria-current`-style active nav state, semantic `<time>` elements, and JSON-LD
  `Person` structured data. A print stylesheet turns the page into a clean résumé.

## Running it locally

There is nothing to install or compile. Either open `index.html` directly, or serve it:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploying with GitHub Pages

The pipeline is already committed at `.github/workflows/pages.yml`. It runs on every push to
`main` and on manual dispatch, uploads the repository root as the Pages artifact, and deploys
through the official `actions/deploy-pages` action.

Enable it once:

1. **Settings → Pages → Build and deployment → Source:** select **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the **Actions** tab).
3. The deployed URL appears in the workflow log and on the Pages settings page.

From the command line, step 1 is:

```bash
gh api -X POST repos/DanishKhan1492/portfolio/pages -f source=github_actions
```

To use a custom domain instead, add a `CNAME` file at the repository root and point DNS at it.
No other change is needed because all asset paths are relative.

## Editing content

All copy lives in `index.html`. Sections are numbered in order: hero, ticker, `#about`,
`#experience`, `#highlights`, `#expertise`, `#credentials`, `#contact`. Visual tuning is at the
top of `css/style.css` in the `:root` block.
