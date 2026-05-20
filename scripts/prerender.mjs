import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const distDir = resolve('dist');
const routes = ['/', '/services', '/services/rates', '/about', '/areas', '/careers', '/contact', '/privacy'];
const baseUrl = 'https://ashertouch-hc.com';

const routeMeta = {
  '/': {
    title: 'AsherTouch Homecare | Toronto Non-Medical Home Care',
    description:
      'Trusted non-medical home care for seniors in Toronto and GTA. Companionship, personal care, meal prep, housekeeping, and respite care. Book a free in-home assessment.',
  },
  '/services': {
    title: 'Home Care Services Toronto | AsherTouch Homecare',
    description:
      'Six core home care services: companionship, personal care, meal preparation, housekeeping, errands, and respite care for Toronto families. Flexible scheduling, no contracts.',
  },
  '/services/rates': {
    title: 'Home Care Rates 2025 | AsherTouch Homecare Toronto',
    description:
      'AsherTouch Homecare 2025 rate schedule for Toronto and GTA: home support, personal care, 24-hour care, and live-in options. Transparent hourly pricing, billing conditions, free assessment.',
  },
  '/about': {
    title: 'About AsherTouch Homecare | Toronto Senior Care Agency',
    description:
      'AsherTouch is a Toronto-based, privately owned home care agency built on dignity and compassion. Learn about our caregiver screening and care philosophy.',
  },
  '/areas': {
    title: 'Service Areas | Home Care in Toronto, Markham & GTA',
    description:
      'AsherTouch provides non-medical home care across Toronto, Markham, Scarborough, North York, Mississauga, Brampton, Durham, Hamilton, Burlington, Oakville, and the GTA.',
  },
  '/careers': {
    title: 'Caregiver Jobs Toronto | AsherTouch Homecare Careers',
    description:
      'Join AsherTouch Homecare as a caregiver in Toronto. We value compassion, reliability, and trust. Background checks and training provided.',
  },
  '/contact': {
    title: 'Book a Free In-Home Assessment | AsherTouch Homecare',
    description:
      'Schedule your free, no-obligation in-home care assessment in Toronto. Call (416) 293-3779 or fill out our contact form. Response within one business day.',
  },
  '/privacy': {
    title: 'Privacy Policy | AsherTouch Homecare',
    description: 'AsherTouch Homecare privacy policy. How we collect, use, and protect your personal information.',
  },
};

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
};

async function serveFile(req, res) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = resolve(distDir, requestedPath.slice(1));

  try {
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    const fallback = await readFile(join(distDir, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fallback);
  }
}

function startServer() {
  const server = createServer((req, res) => {
    serveFile(req, res).catch((error) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(String(error));
    });
  });

  return new Promise((resolveServer, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Unable to start prerender server'));
        return;
      }
      resolveServer({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

async function writeRouteHtml(route, html) {
  const outputPath = route === '/' ? join(distDir, 'index.html') : join(distDir, route, 'index.html');
  await mkdir(resolve(outputPath, '..'), { recursive: true });
  await writeFile(outputPath, normalizeSeoHead(route, html));
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function normalizeSeoHead(route, html) {
  const meta = routeMeta[route];
  if (!meta) return html;

  const canonical = `${baseUrl}${route === '/' ? '/' : route}`;
  const seoTags = [
    `<title>${escapeAttribute(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(meta.description)}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="AsherTouch Homecare">`,
    `<meta property="og:title" content="${escapeAttribute(meta.title)}">`,
    `<meta property="og:description" content="${escapeAttribute(meta.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${baseUrl}/assets/images/caregiver-senior-tea.png">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttribute(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeAttribute(meta.description)}">`,
  ].join('');

  return html
    .replace(/<title[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace('</head>', `${seoTags}</head>`);
}

const { server, origin } = await startServer();
const browser = await puppeteer.launch({ headless: true });

try {
  const page = await browser.newPage();

  for (const route of routes) {
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#main-content');
    const html = await page.content();
    await writeRouteHtml(route, html);
    console.log(`Prerendered ${route}`);
  }
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
