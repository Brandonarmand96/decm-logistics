import { chromium } from "playwright-core";
import fs from "node:fs/promises";

const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
await fs.mkdir(".impeccable/review", { recursive: true });

for (const [name, viewport] of Object.entries({
  desktop: { width: 1440, height: 1000 },
  "wide-short": { width: 1920, height: 880 },
  mobile: { width: 390, height: 844 },
})) {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: name === "mobile" ? 2 : 1,
  });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: `.impeccable/review/home-${name}.png`,
    fullPage: true,
  });
  if (name === "desktop") {
    const serviceCard = page.locator(".service-showcase-grid > a").nth(1);
    await serviceCard.scrollIntoViewIfNeeded();
    await serviceCard.hover();
    await page.screenshot({
      path: ".impeccable/review/home-service-hover.png",
      fullPage: false,
    });
  }
  for (const route of ["services", "about", "contact"]) {
    await page.goto(`http://127.0.0.1:4173/${route}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: `.impeccable/review/${route}-${name}.png`,
      fullPage: true,
    });
  }
  await page.goto("http://127.0.0.1:4173/app", { waitUntil: "networkidle" });
  await page.screenshot({
    path: `.impeccable/review/login-${name}.png`,
    fullPage: true,
  });
  await page.getByLabel("Email").fill("admin@decmnexus.com");
  await page.getByLabel("Password").fill("ChangeMe123!");
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await page.getByRole("heading", { name: "Operations in motion" }).waitFor();
  await page.screenshot({
    path: `.impeccable/review/${name}.png`,
    fullPage: true,
  });
  await page.close();
}

await browser.close();
