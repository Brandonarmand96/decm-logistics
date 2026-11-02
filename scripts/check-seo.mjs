import { chromium } from "playwright-core";

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

const expectations = {
  "/": "DECM Nexus | Integrated Logistics & Consulting",
  "/services": "Services | DECM Nexus",
  "/about": "About | DECM Nexus",
  "/contact": "Contact | DECM Nexus",
};

for (const [path, expectedTitle] of Object.entries(expectations)) {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:4173${path}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(
    (title) => document.title === title,
    expectedTitle,
  );
  const metadata = await page.evaluate(() => ({
    title: document.title,
    description: document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content"),
    canonical: document
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href"),
    robots: document
      .querySelector('meta[name="robots"]')
      ?.getAttribute("content"),
  }));
  if (metadata.title !== expectedTitle) {
    throw new Error(`${path}: unexpected title ${metadata.title}`);
  }
  if (!metadata.description || !metadata.canonical) {
    throw new Error(`${path}: missing description or canonical URL`);
  }
  if (!metadata.robots?.startsWith("index")) {
    throw new Error(`${path}: public page is not indexable`);
  }
  await page.close();
}

const portal = await browser.newPage();
await portal.goto("http://127.0.0.1:4173/app", {
  waitUntil: "domcontentloaded",
});
await portal.waitForFunction(
  () =>
    document.querySelector('meta[name="robots"]')?.getAttribute("content") ===
    "noindex, nofollow",
);
const portalRobots = await portal
  .locator('meta[name="robots"]')
  .getAttribute("content");
if (portalRobots !== "noindex, nofollow") {
  throw new Error("/app: portal must be noindex, nofollow");
}
await portal.close();

const sitemap = await fetch("http://127.0.0.1:4173/sitemap.xml").then(
  (response) => response.text(),
);
for (const path of ["/", "/services", "/about", "/contact"]) {
  const suffix = path === "/" ? "/</loc>" : `${path}</loc>`;
  if (!sitemap.includes(`https://decmnexus.com${suffix}`)) {
    throw new Error(`sitemap.xml is missing ${path}`);
  }
}
if (sitemap.includes("/app")) {
  throw new Error("sitemap.xml must not include /app");
}

await browser.close();
console.log("SEO checks passed for four public routes and the private portal.");
