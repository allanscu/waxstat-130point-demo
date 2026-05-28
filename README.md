# waxstat-130point-demo

A small Next.js demo site that drops the **[Waxstat Releases Widget](https://github.com/allanscu/waxstat-web-widget)** into a sports-card sales lookup layout. Built to show, end-to-end, how easy it is to embed the widget on a third-party site with one `<script>` tag.

Live: **[waxstat-130point-demo.waxstat.com](https://waxstat-130point-demo.waxstat.com)**

## What's here

- An original sports-card lookup page (search bar, source pills, featured-auctions carousel) styled with the Waxstat brand kit — purely illustrative. Not affiliated with 130point.com.
- The Waxstat releases widget embedded mid-page via a single `<script>` tag in [`app/layout.tsx`](app/layout.tsx) plus a `<div id="waxstat-releases-widget" data-format="responsive">` placeholder.
- An opt-in on-page debug overlay (network + console mirror) that activates only with `?debug=1` in the URL.

## The embed in 7 lines

```html
<script>
  (function () {
    var s = document.createElement('script');
    s.src = 'https://waxstat-web-widget.vercel.app/widget.js';
    s.async = true;
    document.head.appendChild(s);
  })();
</script>
<div id="waxstat-releases-widget" data-format="responsive"></div>
```

That's it — the widget self-initialises, fetches releases through the widget host's `/api/*` proxy (no CORS, no API keys on the embedder), and renders.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

To point at a *local* build of the widget instead of production, create `.env.local`:

```
NEXT_PUBLIC_WAXSTAT_WIDGET_URL=http://localhost:3141/widget.js
```

…then in the widget repo run `npm run build && node scripts/serve-local.js`.

## Deploy

Vercel auto-deploys on every push to `main`. The custom domain `waxstat-130point-demo.waxstat.com` is attached on the Vercel project.

## Debugging an embed

Append `?debug=1` to the URL. A dark overlay docks at the bottom-right and mirrors:

- every `console.log/warn/error`
- every `fetch` and `XMLHttpRequest` (method, URL, status)
- unhandled errors / promise rejections

It includes **copy** and **clear** buttons. Once enabled, it persists via `localStorage` until you clear it.

## Layout

```
app/
  layout.tsx       widget loader + DebugPanel mount
  page.tsx         demo page (hero, widget callout, featured auctions)
  globals.css     brand tokens + UI primitives
components/
  WaxstatWidget.tsx   re-init-safe container for <div id="waxstat-releases-widget">
  DebugPanel.tsx      on-page browser console (opt-in via ?debug=1)
public/
  brand/        Waxstat logo + icons
  fonts/        Apotek Extended + Roc Grotesk
```

## Versioning

Version is sourced from `package.json` and displayed in the footer.
