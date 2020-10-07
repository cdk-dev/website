import { writeFileSync } from 'fs';
import * as Playwright from 'playwright-aws-lambda';
import { scraper, screenshot } from './scraper';

export const scrape = async (url: string): Promise<any> => {
  const browser = await Playwright.launchChromium();
  const result = await scraper(browser, url);
  const files = await screenshot(browser, url);
  await browser.close();
  writeFileSync('/tmp/foobar', JSON.stringify(result, null, 2));
  console.log({ result, files });
  return result
};
