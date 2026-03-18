import { chromium } from "playwright";
import type { BrowserSession } from "./BrowserSession.js";

export interface BrowserManagerOptions {
  headless?: boolean;
  slowMo?: number;
}

export class BrowserManager {
  async launch(options: BrowserManagerOptions = {}): Promise<BrowserSession> {
    const browser = await chromium.launch({
      headless: options.headless ?? false,
      slowMo: options.slowMo ?? 0,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    return {
      browser,
      context,
      page,
    };
  }

  async close(session: BrowserSession): Promise<void> {
    await session.context.close();
    await session.browser.close();
  }
}
