import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const BASE = process.env.TEMPLATE_BASE || 'http://localhost:63839';
const outDir = path.resolve(process.cwd(), 'Template', 'screenshots');
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { path: '/', name: 'home' },
  { path: '/pacientes', name: 'pacientes' },
  { path: '/prescricao', name: 'prescricoes' },
  { path: '/comercial', name: 'comercial' },
  { path: '/financeiro', name: 'financeiro' },
  { path: '/dashboard', name: 'dashboard' }
];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 768 }
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 1 });

  for (const pageDef of pages) {
    const url = new URL(pageDef.path, BASE).toString();
    const page = await context.newPage();

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch (err) {
        console.error(`Failed to load ${url}:`, err.message);
      }

      // small delay to allow animations/fetches to settle
      await page.waitForTimeout(800);

      const fileName = `${pageDef.name}-${vp.name}.png`;
      const outPath = path.join(outDir, fileName);
      try {
        await page.screenshot({ path: outPath, fullPage: true });
        console.log(`Saved ${outPath}`);
      } catch (err) {
        console.error(`Screenshot failed for ${url} @ ${vp.name}:`, err.message);
      }
    }

    await page.close();
  }

  await browser.close();
  console.log('All screenshots complete.');
})();
