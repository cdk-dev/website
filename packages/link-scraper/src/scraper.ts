import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { ChromiumBrowser } from 'playwright';

const readabilityJsStr = fs.readFileSync(
  require.resolve('@mozilla/readability/Readability.js'),
  { encoding: 'utf-8' },
);

const executor = `function executor() {
  return new Readability({}, document).parse();
}`;

interface OpenGraphData {
  image?: string;
  siteName?: string;
  url?: string;
  title?: string;
}

interface TwitterData {
  description?: string;
  title?: string;
  image?: string;
  site?: string;
  domain?: string;
}

interface ReadabilityData {
  title?: string;
  byline?: string;
  dir?: string;
  content?: string;
  textContent?: string;
  length?: number;
  excerpt?: string;
  siteName?: string;
}

interface WebsiteData {
  openGraph: OpenGraphData;
  twitter: TwitterData;
  tags?: string[];
  description?: string;
  title?: string;
  url?: string;
  canonicalUrl?: string;
  readability: ReadabilityData;
}


interface ViewPort {
  width: number;
  height: number;
}

interface ScreenshotResult {
  viewport: string;
  full: string;
}

export const screenshot = async (
  browser: ChromiumBrowser,
  url: string,
  viewPort: ViewPort = { width: 1280, height: 800 },
): Promise<ScreenshotResult> => {

  const salt = 'Wj9J5U82Om';
  const key = crypto.createHmac('sha256', salt).update(url).digest('hex').slice(0, 9);
  if (!fs.existsSync(path.join(process.cwd(), 'out', key))) {
    fs.mkdirSync(path.join(process.cwd(), 'out', key), { recursive: true });
  }

  const context = await browser.newContext({
    userAgent: 'cdk.dev - chromium',
  });
  const page = await context.newPage();
  await page.setViewportSize(viewPort);
  page.on('console', console.log);

  const viewportPath = `out/${key}/screenshot.png`;
  const fullPath = `out/${key}/full_screenshot.png`;

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: viewportPath });
  await page.screenshot({ path: fullPath, fullPage: true });

  return {
    viewport: viewportPath,
    full: fullPath,
  };
};

export const scraper = async (browser: ChromiumBrowser, url: string): Promise<WebsiteData> => {
  const context = await browser.newContext({
    userAgent: 'cdk.dev - chromium',
  });
  const page = await context.newPage();
  page.on('console', console.log);

  await page.goto(url, { waitUntil: 'networkidle' });

  const readability = await page.evaluate(`
    (function(){
      ${readabilityJsStr}
      ${executor}
      return executor();
    }())
  `);

  const content = await page.evaluate(() => {
    let data: WebsiteData = {
      openGraph: {},
      twitter: {},
      readability: {},
    };

    let metaTags = document.getElementsByTagName('meta');
    for (let metaTag of metaTags) {
      if (metaTag.getAttribute('property') === 'og:image') {
        data.openGraph.image = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('property') === 'og:site_name') {
        data.openGraph.siteName = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('property') === 'og:url') {
        data.openGraph.url = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('property') === 'og:title') {
        data.openGraph.title = metaTag.getAttribute('content') ?? undefined;
      }

      if (metaTag.getAttribute('name') === 'twitter:description') {
        data.twitter.description = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('name') === 'twitter:title') {
        data.twitter.title = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('name') === 'twitter:image') {
        data.twitter.image = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('name') === 'twitter:site') {
        data.twitter.site = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('name') === 'twitter:domain') {
        data.twitter.domain = metaTag.getAttribute('content') ?? undefined;
      }

      if (metaTag.getAttribute('property') === 'twitter:description') {
        data.twitter.description = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('property') === 'twitter:title') {
        data.twitter.title = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('property') === 'twitter:image') {
        data.twitter.image = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('property') === 'twitter:site') {
        data.twitter.site = metaTag.getAttribute('content') ?? undefined;
      }
      if (metaTag.getAttribute('property') === 'twitter:domain') {
        data.twitter.domain = metaTag.getAttribute('content') ?? undefined;
      }

      if (metaTag.getAttribute('name') === 'keywords') {
        data.tags = metaTag.getAttribute('content')?.split(',') ?? undefined;
      }

      if (metaTag.getAttribute('name') === 'description') {
        data.description = metaTag.getAttribute('content') ?? undefined;
      }

      data.title = document.title;
      data.url = document.URL;

      let links = document.getElementsByTagName('link');

      for (let link of links) {
        if (link.getAttribute('rel') === 'canonical') {
          data.canonicalUrl = link.getAttribute('href') ?? undefined;
        }
      }
    }
    return data;
  });

  content.readability = readability as ReadabilityData;

  return content;
};
