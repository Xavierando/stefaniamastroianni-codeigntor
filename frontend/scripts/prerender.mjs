// Build-time static prerendering for the public marketing routes.
//
// Aruba is static Apache hosting (no Node at runtime), so this generates a real
// HTML file per route — with the correct <title>/description/canonical/OG/JSON-LD
// and the page markup — that Apache serves directly to crawlers and users. The
// client bundle then mounts and takes over (CSR) as before. Dynamic routes
// (blog/:slug, events/:slug, admin, booking tokens) are intentionally left to CSR.
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const serverDir = path.join(distDir, "server");
const SITE_URL = (process.env.VITE_SITE_URL || "https://www.arpelux.it").replace(/\/$/, "");

// Static public routes (mirrors the sitemap route list).
const routes = [
  "/",
  "/chi-sono",
  "/maternita",
  "/trattamenti",
  "/consulenze",
  "/yoga-e-meditazione",
  "/laboratori-eventi",
  "/blog",
  "/contatti",
  "/privacy-policy",
  "/cookie-policy",
];

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");
const templateTitleMatch = template.match(/<title>[\s\S]*?<\/title>/i);
const fallbackTitle = templateTitleMatch ? templateTitleMatch[0] : "<title>Stefania Mastroianni</title>";

const entryFile = fs
  .readdirSync(serverDir)
  .find((f) => f.startsWith("entry-server") && f.endsWith(".js"));
if (!entryFile) {
  throw new Error(`prerender: could not find entry-server build in ${serverDir}`);
}
const { render } = await import(path.join(serverDir, entryFile));

// react-helmet-async (v3) + React 19 renderToString emits <title>/<meta>/<link>/
// JSON-LD inline in the markup rather than via a server context. Pull those SEO
// tags out of the body and return them separately so they can live in <head>.
function extractSeoTags(appHtml) {
  const titleRe = /<title>[\s\S]*?<\/title>/i;
  const metaRe = /<meta\b[^>]*?\/?>/gi;
  const canonicalRe = /<link\b[^>]*?rel="canonical"[^>]*?\/?>/gi;
  const jsonLdRe = /<script type="application\/ld\+json">[\s\S]*?<\/script>/gi;

  const title = (appHtml.match(titleRe) || [])[0] || "";
  const metas = appHtml.match(metaRe) || [];
  const jsonLd = appHtml.match(jsonLdRe) || [];

  // Remove the SEO tags from the body (the canonical is replaced per-route below).
  const body = appHtml
    .replace(titleRe, "")
    .replace(metaRe, "")
    .replace(canonicalRe, "")
    .replace(jsonLdRe, "");

  const head = [title, ...metas, ...jsonLd].join("");
  return { head, body };
}

function buildHtml(route) {
  const { appHtml } = render(route);
  const { head: seoHead, body } = extractSeoTags(appHtml);

  // Fall back to the template's default title for routes that render no <SEO>.
  const headTags = /<title[\s>]/i.test(seoHead) ? seoHead : fallbackTitle + seoHead;

  // Strip the template's static title/description/robots/canonical so only the
  // route-specific tags (and the single per-route canonical) remain.
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<meta\s+name="robots"[^>]*>/i, "")
    .replace(/<link[^>]*?rel="canonical"[^>]*?>/gi, "");

  const canonical = `<link rel="canonical" href="${SITE_URL}${route}" />`;

  html = html.replace("</head>", `${headTags}${canonical}\n</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  return html;
}

for (const route of routes) {
  const html = buildHtml(route);
  const outPath =
    route === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, route.replace(/^\//, ""), "index.html");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log(`prerendered ${route} -> ${path.relative(root, outPath)}`);
}

// The SSR bundle is only needed during prerender — don't ship it in the deploy.
fs.rmSync(serverDir, { recursive: true, force: true });
console.log(`prerender complete: ${routes.length} routes`);
