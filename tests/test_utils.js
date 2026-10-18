import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn, execSync } from 'child_process';

/**
 * Resolves Chrome or Chromium executable across different operating systems.
 * Prioritizes PUPPETEER_EXECUTABLE_PATH environment variable if set.
 */
export function getBrowserExecutablePath() {
  // 1. Explicit environment variable
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    const envPath = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (fs.existsSync(envPath)) {
      return envPath;
    }
    throw new Error(
      `PUPPETEER_EXECUTABLE_PATH is set to "${envPath}", but the file does not exist.`
    );
  }

  // 2. Platform-specific candidate paths
  const platform = process.platform;
  const candidates = [];

  if (platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      path.join(os.homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
      path.join(os.homedir(), 'Applications/Chromium.app/Contents/MacOS/Chromium')
    );
  } else if (platform === 'win32') {
    const programFiles = process.env['PROGRAMFILES'] || 'C:\\Program Files';
    const programFilesX86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';
    const localAppData = process.env['LOCALAPPDATA'] || path.join(os.homedir(), 'AppData', 'Local');

    candidates.push(
      path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(programFiles, 'Chromium', 'Application', 'chrome.exe'),
      path.join(programFilesX86, 'Chromium', 'Application', 'chrome.exe'),
      path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe')
    );
  } else {
    // Linux and other Unixes
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium',
      '/usr/bin/google-chrome-unstable'
    );
  }

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // 3. Fallback: try `which` on unix-like systems
  if (platform !== 'win32') {
    const binaries = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
    for (const bin of binaries) {
      try {
        const result = execSync(`which ${bin} 2>/dev/null`, { encoding: 'utf8' }).trim();
        if (result && fs.existsSync(result)) {
          return result;
        }
      } catch {}
    }
  }

  throw new Error(
    'Could not find a Google Chrome or Chromium executable.\n' +
    'Please install Google Chrome/Chromium or set the PUPPETEER_EXECUTABLE_PATH environment variable.\n' +
    'Example:\n' +
    '  export PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome"'
  );
}

/**
 * Checks whether an HTTP server is actively responding on baseUrl.
 */
export async function isServerRunning(baseUrl = 'http://127.0.0.1:3000') {
  try {
    const res = await fetch(baseUrl);
    return res.ok || res.status === 404;
  } catch {
    return false;
  }
}

/**
 * Ensures preview server is running on the given port and host.
 * If not running, launches 'vite preview' and waits for readiness.
 * Returns an object with baseUrl, serverProcess, and stopServer callback.
 */
export async function ensureServerRunning({ port = 3000, host = '127.0.0.1' } = {}) {
  const baseUrl = `http://${host}:${port}`;
  if (await isServerRunning(baseUrl)) {
    return {
      baseUrl,
      serverProcess: null,
      stopServer: () => {}
    };
  }

  // Check if dist/index.html exists before attempting preview
  const distIndex = path.resolve(process.cwd(), 'dist/index.html');
  if (!fs.existsSync(distIndex)) {
    throw new Error(
      `Production build not found at ${distIndex}. Please run "npm run build" before running tests.`
    );
  }

  console.log(`Local server not detected on port ${port}, starting Vite preview server...`);

  let serverOutput = '';
  const serverProcess = spawn('npx', ['vite', 'preview', '--port', String(port), '--host', host], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', chunk => {
    serverOutput += chunk.toString();
  });
  serverProcess.stderr.on('data', chunk => {
    serverOutput += chunk.toString();
  });

  let hasExited = false;
  let exitCode = null;
  serverProcess.on('exit', code => {
    hasExited = true;
    exitCode = code;
  });

  const stopServer = () => {
    if (serverProcess && !serverProcess.killed) {
      try {
        serverProcess.kill('SIGTERM');
      } catch {}
    }
  };

  const maxRetries = 25;
  const intervalMs = 250;
  let running = false;

  for (let i = 0; i < maxRetries; i++) {
    if (hasExited) {
      throw new Error(
        `Vite preview server process exited unexpectedly with code ${exitCode}.\nOutput:\n${serverOutput}`
      );
    }
    await new Promise(r => setTimeout(r, intervalMs));
    if (await isServerRunning(baseUrl)) {
      running = true;
      break;
    }
  }

  if (!running) {
    stopServer();
    throw new Error(
      `Failed to connect to Vite preview server at ${baseUrl} after ${(maxRetries * intervalMs) / 1000}s.\nOutput:\n${serverOutput}`
    );
  }

  const cleanExit = () => stopServer();
  process.once('exit', cleanExit);
  process.once('SIGINT', cleanExit);
  process.once('SIGTERM', cleanExit);

  return {
    baseUrl,
    serverProcess,
    stopServer: () => {
      process.removeListener('exit', cleanExit);
      process.removeListener('SIGINT', cleanExit);
      process.removeListener('SIGTERM', cleanExit);
      stopServer();
    }
  };
}
