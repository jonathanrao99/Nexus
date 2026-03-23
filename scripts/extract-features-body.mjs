import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "legacy/features.html"), "utf8");

const bodyStart = src.indexOf("<body");
const bodyOpen = src.indexOf(">", bodyStart) + 1;
const bodyEnd = src.lastIndexOf("</body>");
let inner = src.slice(bodyOpen, bodyEnd);

inner = inner.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

inner = inner.replace(/href="generated-page\.html"/g, 'href="/"');
inner = inner.replace(/href="features\.html"/g, 'href="/features"');
inner = inner.replace(/href="generated-page\.html#/g, 'href="/#');
inner = inner.replace(/href="\/#platform"/g, 'href="/architecture"');
inner = inner.replace(/href="\/#network"/g, 'href="/network"');
inner = inner.replace(/href="\/#pricing"/g, 'href="/pricing"');

inner = inner.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/i, "");

const backdropGrain = `<div class="fixed inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50"></div>`;
const backdropGrad = `<div class="fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950 pointer-events-none"></div>`;
inner = inner.split(backdropGrain).join("");
inner = inner.split(backdropGrad).join("");

inner = inner.replace(
  'class="relative z-10 pt-32 pb-24 sm:pb-32"',
  'class="relative z-10 pt-6 pb-24 sm:pb-32"',
);

inner = inner.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>\s*/i, "");

inner = inner.trim();

const outPath = path.join(root, "lib/features-body-html.ts");
const out = `export const FEATURES_BODY_HTML = ${JSON.stringify(inner)};\n`;
fs.writeFileSync(outPath, out);
console.log("Wrote", outPath);
