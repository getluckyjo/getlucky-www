# PGA Golf Show print pieces

The A5 poster and A7 lanyard card for the Get Lucky stand at the PGA Golf &
Lifestyle Show, 18–20 September 2026. Each carries a QR code to
`/pga-golf-show` with a `ref` query so scans from the two pieces can be told
apart in analytics (`?ref=a5`, `?ref=lanyard`); the page ignores it otherwise.

`build.mjs` renders both from HTML in Chromium, using the site's palette,
fonts and the logos in `public/`, and then decodes the QR out of each render
to prove it scans. It writes PDFs at trim size and with 3mm bleed, preview
PNGs, and the bare QR codes as SVG and PNG. The previews and SVGs are checked
in; the PDFs are not (they are large and a minute to regenerate).

```
npm i --no-save playwright-core qrcode jsqr pngjs
node docs/pga-golf-show-print/build.mjs
```

It expects Chromium at `/opt/pw-browsers/chromium`; change `executablePath`
for another machine. Output lands in `docs/pga-golf-show-print/out/`.
