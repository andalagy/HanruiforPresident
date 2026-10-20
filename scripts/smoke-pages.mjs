import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from '@playwright/test';

// Exercise the real deployment artifact, not the Vite development server.
const root = resolve('dist');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    let pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname.startsWith('/HanruiforPresident/')) pathname = pathname.slice('/HanruiforPresident'.length);
    const file = resolve(root, `.${pathname.endsWith('/') ? pathname + 'index.html' : pathname}`);
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined, args: ['--no-sandbox'] });
  const address = `http://127.0.0.1:${server.address().port}`;
  for (const prefix of ['/', '/HanruiforPresident/']) {
    const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(address + prefix);
    await page.getByRole('heading', { name: '最高领袖陈汉瑞的命运', exact: true }).waitFor();
    assert.equal(await page.getByRole('slider').count(), 8);
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
    assert.match(await page.locator('header [lang=ko]').innerText(), /최고령도자 한루이 천/);
    assert.doesNotMatch(await page.locator('body').innerText(), /Hanrui|Supreme Leader|CALCULATE|ENGLISH/i);
    const initial = await page.getByTestId('probability').innerText();
    await page.locator('#factor-0').fill('100');
    assert.notEqual(await page.getByTestId('probability').innerText(), initial);
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: '计算命运', exact: true }).click();
    await page.getByRole('button', { name: '正在解读命运……', exact: true }).waitFor();
    await page.getByRole('button', { name: '计算命运', exact: true }).waitFor();
    await page.getByRole('navigation').getByRole('button', { name: '情报报告' }).click();
    await page.getByRole('button', { name: '下载陈汉瑞情报报告' }).waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: '模拟另一条时间线' }).click();
    await page.waitForFunction(() => !document.querySelector('.alternate h3').textContent.includes('原始时间线'));
    await page.getByRole('button', { name: '重置模拟' }).click();
    assert.equal(await page.getByTestId('probability').innerText(), initial);
    // Verify the reproducible 100% path documented in the handoff.
    await page.locator('#seed').fill('7');
    await page.getByRole('button', { name: '模拟另一条时间线' }).click();
    await page.waitForFunction(() => document.querySelector('.alternate h3').textContent.includes('陈汉瑞的就职典礼'));
    assert.equal(await page.getByTestId('probability').innerText(), '100.000%');
    await page.getByRole('button', { name: '计算命运', exact: true }).click();
    await page.getByRole('button', { name: '正在解读命运……', exact: true }).waitFor();
    await page.getByRole('button', { name: '计算命运', exact: true }).waitFor();
    await page.getByRole('navigation').getByRole('button', { name: '情报报告' }).click();
    assert.match(await page.getByRole('dialog').innerText(), /100.000%/);
    const pendingDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: '下载陈汉瑞情报报告' }).click();
    const download = await pendingDownload;
    const downloaded = await readFile(await download.path(), 'utf8');
    assert.match(downloaded, /分析对象：最高领袖陈汉瑞/);
    assert.match(downloaded, /掌权概率： 100.000%/);
    assert.doesNotMatch(downloaded, /Hanrui|Subject|Supreme Leader/);
    await page.keyboard.press('Escape');
    await page.getByRole('navigation').getByRole('link', { name: /历史档案/ }).click();
    assert.equal(new URL(page.url()).hash, '#archive');
    assert.ok(await page.locator('#archive').isVisible());
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile must not overflow');
    assert.deepEqual(errors, [], `Production errors under ${prefix}`);
    await page.close();
    console.log(`PASS: production assets, mounted portal, eight sliders, calculation, report, mobile at ${prefix}`);
  }
  const blocked = await browser.newPage();
  await blocked.route('**/*.js', route => route.abort());
  await blocked.goto(address + '/HanruiforPresident/');
  await blocked.getByRole('button', { name: '重新加载门户' }).waitFor();
  assert.match(await blocked.locator('#startup-status').innerText(), /暂时无法打开/);
  await blocked.close();
  console.log('PASS: failed script loading leaves a visible recovery page');
  const brokenRender = await browser.newPage();
  await brokenRender.route('**/HistoryChart-*.js', route => route.fulfill({ contentType: 'text/javascript', body: 'throw new Error("Simulated chart loading failure");' }));
  await brokenRender.goto(address + '/HanruiforPresident/');
  await brokenRender.getByRole('alert').waitFor();
  await brokenRender.getByRole('button', { name: '重新加载门户' }).waitFor();
  await brokenRender.close();
  console.log('PASS: rejected chart loading shows the React recovery page');
  const noJs = await browser.newPage({ javaScriptEnabled: false });
  await noJs.goto(address + '/HanruiforPresident/');
  assert.match(await noJs.locator('noscript').innerText(), /启用 JavaScript/);
  assert.match(await noJs.locator('h1').innerText(), /陈汉瑞/);
  await noJs.close();
  console.log('PASS: JavaScript-disabled visitors see a readable portal and instructions');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
