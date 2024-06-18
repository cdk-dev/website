import { Context, Handler } from "aws-lambda";
import { Browser, Page, PuppeteerLaunchOptions } from "puppeteer";
import { PuppeteerExtra } from "puppeteer-extra";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

interface Link {
  id: string;
  url: string;
  comment: string;
}

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler: Handler = async (
  event: Link,
  context: Context,
): Promise<any> => {
  let browser: Browser | null = null;
  try {
    console.log("event:", event);
    const puppeteer: PuppeteerExtra = require("puppeteer-extra");
    const stealthPlugin = require("puppeteer-extra-plugin-stealth");
    puppeteer.use(stealthPlugin());
    const chromium = require("@sparticuz/chromium");

    const browserPath = await chromium.executablePath();

    console.log({path: browserPath})

    const launchOptions: PuppeteerLaunchOptions = context.functionName
      ? {
          headless: true,
          executablePath: browserPath,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--single-process",
            "--incognito",
            "--disable-client-side-phishing-detection",
            "--disable-software-rasterizer",
          ],
        }
      : {
          headless: false,
          executablePath: browserPath,
        };

    console.log('launch', {launchOptions})
    browser = await puppeteer.launch(launchOptions);
    console.log('launched')
    const page: Page = await browser.newPage();
    console.log('page')

    // Set viewport to a common desktop resolution
    await page.setViewport({ width: 1920, height: 1080 });
    console.log('viewport set')

    await page.goto(event.url);
    console.log('page loaded')
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('page content')

    // Take viewport screenshot
    const viewportScreenshot = await page.screenshot({ path: `/tmp/${event.id}_viewport.png` });
    console.log('viewport screenshot taken')

    // Take full page screenshot
    const fullPageScreenshot = await page.screenshot({ path: `/tmp/${event.id}_fullpage.png`, fullPage: true });
    console.log('full page screenshot taken')

    const content = await page.content();

    // Extract Open Graph image
    const ogImageUrl = await page.evaluate(() => {
      const metaTag = document.querySelector('meta[property="og:image"]');
      return metaTag ? metaTag.getAttribute('content') : null;
    });

    if (ogImageUrl) {
      const ogImageResponse = await fetch(ogImageUrl);
      const ogImageBuffer = Buffer.from(await ogImageResponse.arrayBuffer());

      // Save Open Graph image to S3
      const ogImageParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${event.id}_og_image.png`,
        Body: ogImageBuffer,
        ContentType: 'image/png'
      };
      await s3.send(new PutObjectCommand(ogImageParams));
      console.log('Open Graph image saved to S3');
    }

    // Save HTML to S3
    const htmlParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${event.id}.html`,
      Body: content,
      ContentType: 'text/html'
    };
    await s3.send(new PutObjectCommand(htmlParams));

    // Save viewport screenshot to S3
    const viewportScreenshotParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${event.id}_viewport.png`,
      Body: viewportScreenshot,
      ContentType: 'image/png'
    };
    await s3.send(new PutObjectCommand(viewportScreenshotParams));

    // Save full page screenshot to S3
    const fullPageScreenshotParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${event.id}_fullpage.png`,
      Body: fullPageScreenshot,
      ContentType: 'image/png'
    };
    await s3.send(new PutObjectCommand(fullPageScreenshotParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "HTML and screenshots saved to S3", id: event.id }),
    };
  } catch (e: any) {
    console.log("Error in Lambda Handler:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  } finally {
    if (browser) {
      try {
        await Promise.race([
          browser.close(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Browser close timeout")), 10000))
        ]);
      } catch (closeError) {
        console.log("Error closing browser:", closeError);
      }
    }
  }
};
