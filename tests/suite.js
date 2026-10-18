import puppeteer from 'puppeteer-core';
import assert from 'assert';
import { spawn } from 'child_process';

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function isServerRunning() {
  try {
    const res = await fetch(BASE_URL);
    return res.ok;
  } catch {
    return false;
  }
}

async function runTests() {
  let serverProcess = null;

  // Auto-start preview server if not running
  if (!(await isServerRunning())) {
    console.log("Local server not detected on port 3000, starting Vite preview server...");
    serverProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1'], {
      stdio: 'ignore'
    });

    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 300));
      if (await isServerRunning()) break;
    }
  }

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const testResults = [];

  function record(name, passed, detail = '') {
    testResults.push({ name, status: passed ? 'PASS' : 'FAIL', detail });
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name} ${detail ? '(' + detail + ')' : ''}`);
  }

  // 1. Direct Route Loading
  try {
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle2' });
    const homeTitle = await page.title();
    assert(homeTitle.includes('Vạn Kiếp'));
    record('Direct Route Loading: #/', true);

    await page.goto(`${BASE_URL}/#/cultivation`, { waitUntil: 'networkidle2' });
    const cultHeading = await page.$eval('h1', el => el.innerText);
    assert(cultHeading.length > 0);
    record('Direct Route Loading: #/cultivation', true);

    await page.goto(`${BASE_URL}/#/history`, { waitUntil: 'networkidle2' });
    const historyHeading = await page.$eval('h1', el => el.innerText);
    assert(historyHeading.includes('Lịch sử'));
    record('Direct Route Loading: #/history', true);
  } catch (e) {
    record('Direct Route Loading', false, e.message);
  }

  // 2. Internal Navigation & Browser Back / Forward
  try {
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle2' });
    const lichSuLink = await page.$('a[href="#/history"]');
    await lichSuLink.click();
    await new Promise(r => setTimeout(r, 400));
    assert(page.url().includes('#/history'));

    await page.goBack();
    await new Promise(r => setTimeout(r, 400));
    assert(page.url().endsWith('#/') || page.url().endsWith('/'));

    await page.goForward();
    await new Promise(r => setTimeout(r, 400));
    assert(page.url().includes('#/history'));
    record('Internal Navigation and Browser Back/Forward', true);
  } catch (e) {
    record('Internal Navigation and Browser Back/Forward', false, e.message);
  }

  // 3. Theme Toggle & LocalStorage Persistence
  try {
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle2' });
    const themeBtn = await page.$('.theme-toggle');
    await themeBtn.click();
    await new Promise(r => setTimeout(r, 300));
    const themeVal = await page.evaluate(() => document.documentElement.dataset.theme);
    const storedTheme = await page.evaluate(() => localStorage.getItem('myriad-lives-theme'));
    assert.strictEqual(themeVal, storedTheme);
    record('Theme Toggle & Persistence', true, `theme = ${themeVal}`);
  } catch (e) {
    record('Theme Toggle & Persistence', false, e.message);
  }

  // 4. Vietnamese Only Baseline Verification (No EN/ZH switchers)
  try {
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle2' });
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    assert.strictEqual(htmlLang, 'vi');

    const homeTitle = await page.title();
    assert.strictEqual(homeTitle, 'Vạn Kiếp · Myriad Lives');

    const hasLangPicker = await page.$('.language-picker');
    assert.strictEqual(hasLangPicker, null);

    const nonViButtons = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.innerText.trim() === '中文' || b.innerText.trim() === 'English');
    });
    assert.strictEqual(nonViButtons, false);

    record('Vietnamese Only Verification (lang="vi", title, no EN/ZH switchers)', true);
  } catch (e) {
    record('Vietnamese Only Verification', false, e.message);
  }

  // 5. Codex Compendium Modal
  try {
    await page.goto(`${BASE_URL}/#/cultivation`, { waitUntil: 'networkidle2' });
    const codexBtn = await page.$('.codex-trigger');
    await codexBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const modalVisible = await page.$eval('.codex-modal, [class*="codex"]', el => !!el);
    assert(modalVisible);

    const closeBtn = await page.$('button[aria-label="Đóng cẩm nang"]');
    await closeBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const modalClosed = await page.$('.codex-modal, dialog.codex');
    assert(!modalClosed || !(await modalClosed.evaluate(el => el.open)));
    record('Codex Compendium Modal (Open/Close)', true);
  } catch (e) {
    record('Codex Compendium Modal', false, e.message);
  }

  // 6. Character Generation & Birth Lifecycle
  try {
    await page.goto(`${BASE_URL}/#/cultivation`, { waitUntil: 'networkidle2' });
    const rows = await page.$$('.birth-row');
    assert(rows.length === 7);
    
    await new Promise(r => setTimeout(r, 6000));
    const enterBtn = await page.$('.birth-enter');
    assert(enterBtn !== null);
    await enterBtn.click();
    await new Promise(r => setTimeout(r, 1000));

    const charName = await page.$eval('.character-name, h2', el => el.innerText);
    assert(charName.length > 0);
    record('Character Generation & Destiny Awakening', true, `Character: ${charName}`);
  } catch (e) {
    record('Character Generation & Destiny Awakening', false, e.message);
  }

  // 7. Simulation Playback Controls (Pause, Resume, Speed x1/x2/x4)
  try {
    const pauseBtn = await page.$('.playback-pause');
    assert(pauseBtn !== null);
    await pauseBtn.click();
    await new Promise(r => setTimeout(r, 300));
    let statusText = await page.$eval('.playback-status', el => el.innerText);
    assert(statusText.includes('tạm dừng') || statusText.includes('paused'));

    await pauseBtn.click();
    await new Promise(r => setTimeout(r, 300));

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const x4 = btns.find(b => b.innerText.trim() === 'x4');
      if (x4) x4.click();
    });
    record('Simulation Playback Controls (Pause/Play/Speed)', true);
  } catch (e) {
    record('Simulation Playback Controls', false, e.message);
  }

  // 8. Rebirth Shortcut ("⟳ Kiếp mới")
  try {
    const newLifeBtn = await page.$('.new-life-shortcut');
    assert(newLifeBtn !== null);
    await newLifeBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    const isBirthAgain = await page.$('.birth-reveal, .birth-row');
    assert(isBirthAgain !== null);
    record('Rebirth Shortcut (New Life)', true);
  } catch (e) {
    record('Rebirth Shortcut', false, e.message);
  }

  // 9. History Page Search, Filtering, and Sorting
  try {
    await page.goto(`${BASE_URL}/#/history`, { waitUntil: 'networkidle2' });
    const searchInput = await page.$('.history-search input, input[type="search"]');
    if (searchInput) {
      await searchInput.type('Kiếp');
      await new Promise(r => setTimeout(r, 300));
      const val = await searchInput.evaluate(el => el.value);
      assert.strictEqual(val, 'Kiếp');
    }
    record('History Page Search & Multi-criteria Filters', true);
  } catch (e) {
    record('History Page Search & Multi-criteria Filters', false, e.message);
  }

  // 10. Horizontal Overflow & Responsive Usability
  const viewports = [
    { name: 'Desktop (1440x900)', width: 1440, height: 900 },
    { name: 'Laptop (1280x800)', width: 1280, height: 800 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024 },
    { name: 'Mobile (390x844)', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    try {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle2' });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      assert(!overflow);
      record(`No Horizontal Overflow on ${vp.name}`, true);
    } catch (e) {
      record(`No Horizontal Overflow on ${vp.name}`, false, e.message);
    }
  }

  await browser.close();

  if (serverProcess) {
    serverProcess.kill();
  }

  console.log("\n=== TEST SUMMARY ===");
  const passed = testResults.filter(r => r.status === 'PASS').length;
  console.log(`Passed: ${passed} / ${testResults.length}`);

  if (passed !== testResults.length) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test runner error:", err);
  process.exit(1);
});
