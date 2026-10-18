import puppeteer from 'puppeteer-core';
import assert from 'assert';
import { getBrowserExecutablePath, ensureServerRunning } from './test_utils.js';

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runMigrationTest() {
  let serverHandle = null;
  let browser = null;

  try {
    serverHandle = await ensureServerRunning({ port: PORT, host: '127.0.0.1' });
    const executablePath = getBrowserExecutablePath();

    browser = await puppeteer.launch({
      executablePath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

  const page = await browser.newPage();

  // 1. Mock old English save
  const oldSaveEn = JSON.stringify({
    version: 1,
    language: 'en',
    speed: 2,
    paused: false,
    session: { runCount: 3, pityCount: 2 },
    history: [
      { number: 1, name: 'Lâm Vô Trần', realm: 3, age: 245, status: 'finished' },
      { number: 2, name: 'Diệp Tử Yên', realm: 5, age: 980, status: 'finished' }
    ]
  });

  await page.evaluateOnNewDocument((save) => {
    localStorage.setItem('myriad-lives-save', save);
  }, oldSaveEn);

  await page.goto(`${BASE_URL}/#/history`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  const stateEn = await page.evaluate(() => {
    const raw = localStorage.getItem('myriad-lives-save');
    const parsed = JSON.parse(raw);
    return {
      htmlLang: document.documentElement.lang,
      title: document.title,
      savedLanguage: parsed?.language,
      runCount: parsed?.session?.runCount,
      historyCount: parsed?.history?.length,
      historyName: parsed?.history?.[0]?.name
    };
  });

  console.log('Result of Old English Save Migration:', stateEn);
  assert.strictEqual(stateEn.htmlLang, 'vi');
  assert.strictEqual(stateEn.title, 'Vạn Kiếp · Myriad Lives');
  assert.strictEqual(stateEn.savedLanguage, 'vi');
  assert.strictEqual(stateEn.runCount, 3);
  assert.strictEqual(stateEn.historyCount, 2);
  assert.strictEqual(stateEn.historyName, 'Lâm Vô Trần');
  console.log('[PASS] Old English save migrated to Vietnamese cleanly without data loss');

  await page.close();

  // 2. Mock old Chinese save in fresh page
  const oldSaveZh = JSON.stringify({
    version: 1,
    language: 'zh',
    speed: 4,
    paused: true,
    session: { runCount: 5, pityCount: 1 },
    history: [
      { number: 1, name: 'Tô Nhược Thủy', realm: 8, age: 7200, status: 'finished' }
    ]
  });

  const pageZh = await browser.newPage();
  await pageZh.evaluateOnNewDocument((save) => {
    localStorage.setItem('myriad-lives-save', save);
  }, oldSaveZh);

  await pageZh.goto(`${BASE_URL}/#/history`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  const stateZh = await pageZh.evaluate(() => {
    const raw = localStorage.getItem('myriad-lives-save');
    const parsed = JSON.parse(raw);
    return {
      htmlLang: document.documentElement.lang,
      title: document.title,
      savedLanguage: parsed?.language,
      runCount: parsed?.session?.runCount,
      historyCount: parsed?.history?.length,
      historyName: parsed?.history?.[0]?.name
    };
  });

  console.log('Result of Old Chinese Save Migration:', stateZh);
  assert.strictEqual(stateZh.htmlLang, 'vi');
  assert.strictEqual(stateZh.title, 'Vạn Kiếp · Myriad Lives');
  assert.strictEqual(stateZh.savedLanguage, 'vi');
  assert.strictEqual(stateZh.runCount, 5);
  assert.strictEqual(stateZh.historyCount, 1);
  assert.strictEqual(stateZh.historyName, 'Tô Nhược Thủy');
  console.log('[PASS] Old Chinese save migrated to Vietnamese cleanly without data loss');

  console.log('\n=== ALL MIGRATION TESTS PASSED ===');
} finally {
  if (browser) {
    try {
      await browser.close();
    } catch (err) {
      console.error('Error closing browser:', err);
    }
  }
  if (serverHandle) {
    serverHandle.stopServer();
  }
}
}

runMigrationTest().catch(err => {
  console.error('Migration test error:', err);
  process.exit(1);
});
