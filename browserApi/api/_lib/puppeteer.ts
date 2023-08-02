import { launch, Page } from "puppeteer-core";
import chrome from "chrome-aws-lambda";
let _page: Page | null;

async function getPage() {
  if (_page) return _page;
  const options = {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  };
  const browser = await launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(url, elementPath, width, height) {
  const page = await getPage();
  await page.goto(url);
  await page.setViewport({
    width: Number(width) || 1280,
    height: Number(height) || 720,
    deviceScaleFactor: 2,
  });

  if (elementPath) {
    await page.waitForSelector(elementPath);
    const element = await page.$(elementPath);
    const file = await element.screenshot();
    return file;
  }

  const file = await page.screenshot();

  return file;
}
