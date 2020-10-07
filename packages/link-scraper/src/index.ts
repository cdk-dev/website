import { writeFileSync } from 'fs';
import { chromium } from 'playwright';
import { scraper, screenshot } from './scraper';

void (async () => {
  const url = 'https://www.endoflineblog.com/cdk-tips-02-how-to-contribute-to-the-cdk';
  const browser = await chromium.launch();
  const result = await scraper(browser, url);
  const files = await screenshot(browser, url);
  await browser.close();
  writeFileSync('/tmp/foobar', JSON.stringify(result, null, 2));
  console.log({ result, files });
})();
