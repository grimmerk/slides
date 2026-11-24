#!/usr/bin/env node
// Export every deck as static HTML (open-slide's own "Export as HTML", driven headlessly),
// so a plain HTTP fetch — an AI agent, a search engine, a reader without JavaScript — gets
// the slide text and the image/video URLs. The SPA at /s/<deck> stays the presenting view.
//
//   node scripts/export-static.cjs <preview-base-url> <out-dir>
// Writes <out-dir>/<deck>.html and <out-dir>/assets/*. Needs the `playwright` package and a
// running `open-slide preview` of the same build.
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const [base, outDir] = process.argv.slice(2);
  if (!base || !outDir) {
    console.error('usage: export-static.cjs <preview-base-url> <out-dir>');
    process.exit(2);
  }
  const decks = fs.readdirSync('slides', { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join('slides', d.name, 'index.tsx')))
    .map((d) => d.name);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, acceptDownloads: true });
  for (const deck of decks) {
    const page = await ctx.newPage();
    await page.goto(`${base.replace(/\/$/, '')}/s/${deck}?p=1`, { waitUntil: 'networkidle' });
    await page.locator('button[aria-label="Download"]').click();
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 120000 }),
      page.getByText('Export as HTML', { exact: true }).click(),
    ]);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `export-${deck}-`));
    const file = path.join(tmp, download.suggestedFilename());
    await download.saveAs(file);
    if (file.endsWith('.zip')) {
      // The zip holds <deck>.html plus assets/; asset names are content-hashed, so decks can share one assets/ dir.
      execFileSync('unzip', ['-o', '-q', file, '-d', outDir]);
    } else {
      fs.copyFileSync(file, path.join(outDir, `${deck}.html`));
    }
    if (!fs.existsSync(path.join(outDir, `${deck}.html`))) throw new Error(`export of ${deck} produced no ${deck}.html`);
    console.log(`exported ${deck}`);
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
