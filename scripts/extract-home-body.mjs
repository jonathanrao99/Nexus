import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcPath = path.join(root, "legacy/generated-page.html");
const src = fs.readFileSync(srcPath, "utf8");

const bodyStart = src.indexOf("<body");
if (bodyStart === -1) throw new Error("No body tag");
const bodyOpen = src.indexOf(">", bodyStart) + 1;
const bodyEnd = src.lastIndexOf("</body>");
let inner = src.slice(bodyOpen, bodyEnd);

// Strip all script tags (inline and external)
inner = inner.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

// Pricing toggle used inline handler — wire from React instead
inner = inner.replace(/\s*onchange="togglePricing\(\)"/g, "");

// Point nav to Next routes
inner = inner.replace(/href="generated-page\.html"/g, 'href="/"');
inner = inner.replace(/href="features\.html"/g, 'href="/features"');

// Shared glass nav is rendered by <SiteNav /> — strip embedded nav
inner = inner.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/i, "");

inner = inner.replace(/href="#platform"/g, 'href="/architecture"');
inner = inner.replace(/href="#network"/g, 'href="/network"');
inner = inner.replace(/href="#pricing"/g, 'href="/pricing"');

// SiteFooter renders CTA + bottom strip — remove legacy footer block
inner = inner.replace(
  /<!-- Call to Action Footer -->[\s\S]*?<\/footer>\s*/i,
  "",
);

const outPath = path.join(root, "lib/home-body-html.ts");
const out = `export const HOME_BODY_HTML = ${JSON.stringify(inner)};\n`;
fs.writeFileSync(outPath, out);
console.log("Wrote", outPath, "bytes:", Buffer.byteLength(out));
