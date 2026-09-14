// Print pieces for the PGA Golf & Lifestyle Show stand: an A5 poster and an
// A7 lanyard card, each with a QR code to /pga-golf-show. Rendered from HTML
// with Chromium so they match the page's palette and use the real logos.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright-core";
import QRCode from "qrcode";

const WWW = new URL("../../public/", import.meta.url).pathname;
const OUT = new URL("./out/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const NAVY = "#193262", GREEN = "#418441", CREAM = "#f6f4db";
const URL_A5 = "https://www.getluckygolf.co.za/pga-golf-show?ref=a5";
const URL_LANYARD = "https://www.getluckygolf.co.za/pga-golf-show?ref=lanyard";
const URL_SHOWN = "getluckygolf.co.za/pga-golf-show";

const data = (path, type) => `data:${type};base64,${readFileSync(path).toString("base64")}`;
const png = (p) => data(p, "image/png");
const logos = {
  pga: png(`${WWW}/logos/sponsors/pga-golf-show.png`),
  challenge: png(`${WWW}/logos/challenge-bordered.png`),
  move: png(`${WWW}/logos/sponsors/move-golf.png`),
  takomo: png(`${WWW}/logos/sponsors/takomo.png`),
  badi: png(`${WWW}/logos/sponsors/badi-golf.png`),
  indwe: png(`${WWW}/images/indwe-sponsor-banner.png`),
};
const headingFont = data(`${WWW}/fonts/PosterGothicRoundATF-Heavy.woff2`, "font/woff2");

async function qrSvg(url) {
  // Navy modules on white, medium error correction, no margin (the layout
  // provides the quiet zone with white padding).
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 0,
    color: { dark: NAVY, light: "#ffffff" },
  });
}

const css = `
  @font-face { font-family: "Poster"; src: url(${headingFont}) format("woff2"); font-weight: 800; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${CREAM}; }
  body { font-family: "Liberation Sans", Arial, Helvetica, sans-serif; color: ${NAVY}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { position: relative; overflow: hidden; background: ${CREAM}; display: flex; flex-direction: column; }
  .mast { background: ${NAVY}; color: ${CREAM}; border-bottom: 1.2mm solid ${GREEN}; display: flex; justify-content: space-between; align-items: center; text-transform: uppercase; font-weight: 700; letter-spacing: 0.18em; }
  .heading { font-family: "Poster", Impact, sans-serif; text-transform: uppercase; line-height: 0.92; letter-spacing: 0.02em; }
  .eyebrow { color: ${GREEN}; text-transform: uppercase; font-weight: 700; letter-spacing: 0.2em; }
  .card { background: #fff; border-radius: 3mm; border: 0.25mm solid rgba(25,50,98,0.12); }
  .qr svg { display: block; width: 100%; height: 100%; }
  .lockups { display: flex; align-items: center; justify-content: center; }
  .divider { width: 0.3mm; background: rgba(25,50,98,0.25); }
  .muted { color: rgba(25,50,98,0.7); }
  .bleed { position: relative; }
`;

function a5({ qr, bleed }) {
  // Trim 148 x 210. Bleed adds 3mm each side; content stays on the trim box.
  const b = bleed ? 3 : 0;
  const W = 148 + 2 * b, H = 210 + 2 * b;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
    @page { size: ${W}mm ${H}mm; margin: 0; }
    html, body { width: ${W}mm; height: ${H}mm; }
    .page { width: ${W}mm; height: ${H}mm; padding: ${b}mm; }
    .mast { justify-content: center; font-size: 8pt; letter-spacing: 0.22em; margin: -${b}mm -${b}mm 0; padding-top: ${b}mm; height: ${8 + b}mm; }
  </style></head><body><div class="page">
    <div class="mast"><span>18–20 September 2026</span></div>

    <div class="lockups" style="gap:6mm;margin-top:9mm">
      <img src="${logos.pga}" style="height:19mm">
      <div class="divider" style="height:15mm"></div>
      <img src="${logos.challenge}" style="height:21mm">
    </div>

    <div style="text-align:center;margin-top:7mm;padding:0 10mm">
      <div class="eyebrow" style="font-size:8.5pt">Simulator Hole-in-One · Free Entry</div>
      <div class="heading" style="font-size:44pt;margin-top:3mm">One Shot<br>at R25,000</div>
      <div class="muted" style="font-size:10.5pt;line-height:1.35;margin-top:4mm">Scan, enter your name and number, and swing.</div>
    </div>

    <div class="card" style="margin:6mm auto 0;width:68mm;padding:4mm 4mm 3.5mm;text-align:center;border-top:1.4mm solid ${GREEN}">
      <div class="eyebrow" style="font-size:8pt;margin-bottom:3mm">Scan to enter</div>
      <div class="qr" style="width:46mm;height:46mm;margin:0 auto">${qr}</div>
      <div style="font-size:8pt;font-weight:700;margin-top:3mm;letter-spacing:0.02em">${URL_SHOWN}</div>
    </div>

    <!-- Partners sit centred in whatever room is left above the sponsor band,
         so the breathing space above and below them is equal. -->
    <div style="flex:1;display:flex;justify-content:center;align-items:center;gap:12mm;padding:0 14mm">
      <img src="${logos.takomo}" style="height:5.1mm">
      <img src="${logos.move}" style="height:7mm">
      <img src="${logos.badi}" style="height:6.8mm">
    </div>

    <!-- Headline sponsor: a white band across the full width, into the bleed,
         under a navy rule that answers the masthead at the top. -->
    <div style="background:#fff;margin:0 -${b}mm -${b}mm;padding:4mm ${10 + b}mm ${4 + b}mm;display:flex;justify-content:center;border-top:1.2mm solid ${NAVY}">
      <img src="${logos.indwe}" style="width:80%;height:auto">
    </div>
  </div></body></html>`;
}

function lanyard({ qr, bleed }) {
  // A7 portrait, 74 x 105. The top 10mm is kept clear for the clip and hole.
  const b = bleed ? 3 : 0;
  const W = 74 + 2 * b, H = 105 + 2 * b;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
    @page { size: ${W}mm ${H}mm; margin: 0; }
    html, body { width: ${W}mm; height: ${H}mm; }
    .page { width: ${W}mm; height: ${H}mm; padding: ${b}mm; }
    .mast { height: ${10 + b}mm; margin: -${b}mm -${b}mm 0; padding-top: ${b}mm; justify-content: center; font-size: 7pt; letter-spacing: 0.2em; }
  </style></head><body><div class="page">
    <div class="mast"><span>18–20 Sep 2026</span></div>

    <div class="lockups" style="gap:3mm;margin-top:3mm">
      <img src="${logos.pga}" style="height:9mm">
      <div class="divider" style="height:7.5mm"></div>
      <img src="${logos.challenge}" style="height:10mm">
    </div>

    <div style="text-align:center;margin-top:2.5mm;padding:0 5mm">
      <div class="eyebrow" style="font-size:5.5pt">Simulator Hole-in-One · Free Entry</div>
      <div class="heading" style="font-size:16pt;margin-top:1mm">One Shot at R25,000</div>
    </div>

    <div class="card" style="margin:2mm auto 0;width:42mm;padding:2.2mm 2.2mm 2.2mm;text-align:center;border-top:1mm solid ${GREEN}">
      <div class="eyebrow" style="font-size:5.5pt;margin-bottom:1.5mm">Scan to enter</div>
      <div class="qr" style="width:34mm;height:34mm;margin:0 auto">${qr}</div>
    </div>

    <div style="flex:1;display:flex;justify-content:center;align-items:center;gap:6mm">
      <img src="${logos.takomo}" style="height:2.8mm">
      <img src="${logos.move}" style="height:3.8mm">
      <img src="${logos.badi}" style="height:3.7mm">
    </div>
    <div style="background:#fff;margin:0 -${b}mm -${b}mm;padding:2.2mm ${5 + b}mm ${2.2 + b}mm;display:flex;justify-content:center;border-top:1mm solid ${NAVY}">
      <img src="${logos.indwe}" style="width:82%;height:auto">
    </div>
  </div></body></html>`;
}

function lanyardBack({ bleed }) {
  // The reverse: a card that flips on the lanyard still points people the
  // right way. Same top band as the front so the clip zone matches.
  const b = bleed ? 3 : 0;
  const W = 74 + 2 * b, H = 105 + 2 * b;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}
    @page { size: ${W}mm ${H}mm; margin: 0; }
    html, body { width: ${W}mm; height: ${H}mm; }
    .page { width: ${W}mm; height: ${H}mm; padding: ${b}mm; }
    .mast { height: ${10 + b}mm; margin: -${b}mm -${b}mm 0; padding-top: ${b}mm; justify-content: center; font-size: 7pt; letter-spacing: 0.2em; }
  </style></head><body><div class="page">
    <div class="mast"><span>18–20 Sep 2026</span></div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:0 7mm;gap:5mm">
      <img src="${logos.challenge}" style="height:26mm">
      <div>
        <div class="eyebrow" style="font-size:5.5pt">Simulator Hole-in-One · Free Entry</div>
        <div class="heading" style="font-size:16pt;margin-top:1mm">One Shot at R25,000</div>
      </div>
      <div class="muted" style="font-size:8pt;line-height:1.35">Scan the front to enter.</div>
      <img src="${logos.pga}" style="height:12mm;margin-top:1mm">
    </div>
    <div style="background:#fff;margin:0 -${b}mm -${b}mm;padding:2.2mm ${5 + b}mm ${2.2 + b}mm;display:flex;justify-content:center;border-top:1mm solid ${NAVY}">
      <img src="${logos.indwe}" style="width:82%;height:auto">
    </div>
  </div></body></html>`;
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const jobs = [
  ["pga-show-a5", a5, URL_A5, [148, 210], false],
  ["pga-show-a5-bleed3mm", a5, URL_A5, [154, 216], true],
  ["pga-show-lanyard-a7", lanyard, URL_LANYARD, [74, 105], false],
  ["pga-show-lanyard-a7-bleed3mm", lanyard, URL_LANYARD, [80, 111], true],
  ["pga-show-lanyard-a7-back", lanyardBack, null, [74, 105], false],
  ["pga-show-lanyard-a7-back-bleed3mm", lanyardBack, null, [80, 111], true],
];
for (const [name, build, url, [w, h], bleed] of jobs) {
  const qr = url ? await qrSvg(url) : "";
  const html = build({ qr, bleed });
  const page = await browser.newPage({ viewport: { width: Math.round(w * 3.7795), height: Math.round(h * 3.7795) }, deviceScaleFactor: 3 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: `${OUT}${name}.pdf`, width: `${w}mm`, height: `${h}mm`, printBackground: true, preferCSSPageSize: true });
  if (!bleed) await page.screenshot({ path: `${OUT}${name}.png`, fullPage: false });
  await page.close();
  console.log("wrote", name);
}
await browser.close();

// Bare QR codes for anything else they want to put them on.
for (const [name, url] of [["qr-pga-show-a5", URL_A5], ["qr-pga-show-lanyard", URL_LANYARD]]) {
  writeFileSync(`${OUT}${name}.svg`, await qrSvg(url));
  await QRCode.toFile(`${OUT}${name}.png`, url, { errorCorrectionLevel: "M", margin: 2, width: 2000, color: { dark: NAVY, light: "#ffffff" } });
  console.log("wrote", name, "svg+png");
}

// Prove the rendered codes scan: decode the QR out of each preview PNG.
import jsQR from "jsqr";
import { PNG } from "pngjs";
for (const [name, want] of [["pga-show-a5", URL_A5], ["pga-show-lanyard-a7", URL_LANYARD]]) {
  const img = PNG.sync.read(readFileSync(`${OUT}${name}.png`));
  const hit = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  console.log(name, hit?.data === want ? "QR decodes to the right URL" : `QR FAILED: ${hit?.data}`);
}
